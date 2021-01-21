import { Router } from 'express';
import { GameModel } from "../data/models/Game.js";
import { PokemonModel } from "../data/models/Pokemon.js";
import { generateCode, getNewMap, shuffleArray, findPlayerCoords, summonPokemon } from "../utils/game.utils.js";
import { getUserFromToken } from "../security/auth.js";
import { MapModelModel } from "../data/models/MapModel";
import webpush from "web-push";
import { UserModel } from "../data/models/User";
import { GameConstants } from "../data/constants/game.constants";

const gameRoutes = Router();

gameRoutes.route('/:mode')
    .get((req, res) => {
        const { mode = GameConstants.ONLINE } = req.params;
        const userFromToken = getUserFromToken(req.headers.authorization.split(' ')?.[1]);

        // Misspelled mode handling
        if (![GameConstants.ONLINE, GameConstants.OFFLINE].includes(mode))
            return res.status(400).send('Syntax error, check your request url.');

        GameModel
            .find({ status: { $in: [GameConstants.STATUS_AWAIT, GameConstants.STATUS_RUNNING] }, gameMode: mode, players: { $elemMatch: { _id: userFromToken._id } } })
            .sort({ startDate: -1 })
            .exec()
            .then(games => res.send({ game: games }))
            .catch(err => res.status(500).send({ error: 'internal server error.', stacktrace: JSON.stringify(err) }));
    })
    .post((req, res) => {
        const { name } = req.body;
        const { mode = GameConstants.ONLINE } = req.params;

        // Assert that the generatedCode is unique in the database
        GameModel.find({}).exec()
            .then(async games => {
                const alreadyUsedCodes = games.map(item => item.gameId);
                const generatedCode = generateCode(alreadyUsedCodes);

                const userFromToken = getUserFromToken(req.headers.authorization.split(' ')?.[1]);

                const me = {
                    type: 'player',
                    _id: userFromToken._id,
                    email: userFromToken.email,
                    username: userFromToken.username,
                    skin: userFromToken.skin,
                    pokemon: null,
                    life: GameConstants.DEFAULT_START_LIFE,
                    ap: GameConstants.DEFAULT_AP,
                    mp: GameConstants.DEFAULT_MP,
                    isYourTurn: false,
                    position: 1
                }

                // Create the game
                GameModel.create({
                    name,
                    creatorId: userFromToken._id,
                    gameId: generatedCode,
                    players: [
                        me
                    ],
                    playersAlive: 1,
                    turnNumber: 1,
                    startDate: new Date(),
                    map: [[]],
                    status: "await",
                    gameMode: mode,
                    pngImg: 1
                })
                    .then(game => res.send({ game: game }))
                    .catch(err => res.status(500).send({ error: 'Could not create the game.', stacktrace: JSON.stringify(err) }));
            })
            .catch(err => res.status(500).send({ error: 'Could not create the game id, aborting.', stacktrace: JSON.stringify(err) }));
    });

gameRoutes.route('/:mode/:id')
    .get((req, res) => {
        const { mode, id } = req.params

        GameModel.findOne({ gameMode: mode, gameId: id }).exec()
            .then(game => {
                if (!game)
                    throw 'Not found'

                res.send({ game });
            })
            .catch(err => res.status(500).send({ error: 'Could not fetch the game.', stacktrace: JSON.stringify(err) }));
    })
    .put((req, res) => {
        const { mode, id } = req.params
        const userFromToken = getUserFromToken(req.headers.authorization.split(' ')?.[1]);

        if (![GameConstants.ONLINE, GameConstants.OFFLINE].includes(mode))
            return res.status(400).send('Syntax error, check your request url.');

        GameModel.findOne({ gameId: id, gameMode: mode }).exec()
            .then(game => {
                if (!game) {
                    return res.status(404).send('Cannot find your game! Check your game code.');
                } else if (game.players.length === 5) {
                    return res.status(400).send('The lobby is already full!');
                } else if (game.status === 'running') {
                    return res.status(400).send('The game already started!');
                } else if (game.status === 'finished') {
                    return res.status(400).send('The game is already finished.');
                }

                if (game.players.map(p => p._id).includes(userFromToken.id))
                    return res.status(400).send('You already are in this game!');

                game.players.push({
                    type: 'player',
                    _id: userFromToken._id,
                    email: userFromToken.email,
                    username: userFromToken.username,
                    skin: userFromToken.skin,
                    pokemon: null,
                    life: GameConstants.DEFAULT_START_LIFE,
                    ap: GameConstants.DEFAULT_AP,
                    mp: GameConstants.DEFAULT_MP,
                    isYourTurn: false,
                    position: 1
                });

                game.playersAlive++;

                if (game.players?.length >= GameConstants.MAX_PLAYERS) {
                    // Start the game
                    game.status = GameConstants.STATUS_RUNNING;

                    game.players.forEach(player => {
                        player.lastActionDate = new Date();
                    });

                    PokemonModel.find({}).exec()
                        .then(pokemon => {
                            if (pokemon.length < 5)
                                return res.status(404).send('Not enough pokemon! Aborting.');

                            game.players = shuffleArray(game.players);

                            for (let i = 0; i < game.players.length; i++)
                                game.players[i].position = i + 1;

                            game.players[0].isYourTurn = true;

                            // Init map
                            const shuffledPkmn = shuffleArray(pokemon)

                            MapModelModel.find({}).exec()
                                .then(mapModels => {
                                    const chosenModel = mapModels[Math.floor(Math.random() * mapModels.length)];

                                    game.map = getNewMap(game.players, shuffledPkmn, chosenModel.map);
                                    game.pngImg = chosenModel.pngImg;

                                    game.save();

                                    return res.send({ game: game });
                                })
                                .catch(err => {
                                    console.error(err);
                                    res.status(500).send('Error fetching the mapModel.');
                                });
                        })
                        .catch(err => res.status(500).send({ error: 'Error fetching pokemon.', stacktrace: JSON.stringify(err) }));
                } else {
                    game.save();

                    return res.send({ game: game });
                }

            })
            .catch(err => res.status(500).send({ error: 'Could not create the game.', stacktrace: JSON.stringify(err) }));
    })
    .delete((req, res) => {
        const { mode, id } = req.params
        const userFromToken = getUserFromToken(req.headers.authorization.split(' ')?.[1]);

        GameModel.findOneAndDelete({ creatorId: userFromToken.id, gameId: id }).exec()
            .then(() => res.send('Successfully deleted!'))
            .catch(err => res.status(500).send({ error: 'internal server error.', stacktrace: JSON.stringify(err) }));
    });

gameRoutes.route('/:mode/:id/:move')
    .patch((req, res) => {
        const gameMode = req.params.mode;
        const move = req.params.move;
        const gameId = req.params.id;
        const body = {
            x: req.body.x,
            y: req.body.y
        };

        if (![GameConstants.ONLINE, GameConstants.OFFLINE].includes(gameMode)) {
            res.status(400).send('Syntax error for the mode, check your request url.');
            return;
        }
        if (!['walk', 'attack', 'catch', 'skip'].includes(move)) {
            res.status(400).send('Syntax error for the move, check your request url.');
            return;
        }

        GameModel.findOne({ gameId: gameId, gameMode: gameMode }).lean().exec()
            .then(async game => {
                const currentPlayerPos = (() => {
                    for (const [y, row] of game.map.entries()) {
                        for (const [x, cell] of row.entries()) {
                            if (cell?.type === 'player' && /** @type {Player} */(cell)?.isYourTurn)
                                return { x, y }
                        }
                    }
                    throw new Error('Player current not found')
                })()
                const currentPlayer = {...game.map[currentPlayerPos.y][currentPlayerPos.x], type: 'player' }
                const currentPlayerIndex = game.players.findIndex(x => x._id.toString() === currentPlayer._id.toString()) //Based on uniq username for test

                const nextPosition = (() => {
                    const _getNextPos = (pos = currentPlayer.position) => pos < game.players.length ? pos + 1 : 1
                    let nextPos = _getNextPos()
                    while (game.players.find(x => x.position === nextPos)?.life <= 0) { // eslint-disable-line
                        nextPos = _getNextPos(nextPos > game.players.length ? 1 : nextPos)
                    }
                    return nextPos
                })()

                console.log('currentPlayerPos', currentPlayerPos)
                console.log('currentPlayer', currentPlayer)
                console.log('currentPlayerIndex', currentPlayerIndex)
                console.log('nextPosition', nextPosition)

                const nextPlayer = {...game.players.find(x => x.position === nextPosition), type: 'player' }
                const nextPlayerIndex = game.players.findIndex(x => x.position === nextPosition)
                console.log('bonjour ', nextPlayer)

                const nextPlayerPos = (() => {
                    for (const [y, row] of game.map.entries()) {
                        for (const [x, cell] of row.entries()) {
                            if (cell?.type === 'player' && /** @type {Player} */(cell)?._id.toString() === nextPlayer._id.toString())
                                return { x, y }
                        }
                    }
                    throw new Error('Player next not found')
                })()

                console.log('nextPlayer', nextPlayer)
                console.log('nextPlayerIndex', nextPlayerIndex)
                console.log('nextPlayerPos', nextPlayerPos)

                switch (move) {
                    case 'walk':
                        //Check if pkmn
                        if (game.map[body.y][body.x]?.type === null) //Not an empty cell
                            break

                        console.log(currentPlayer)

                        currentPlayer.mp -= Math.abs(body.x - currentPlayerPos.x) + Math.abs(body.y - currentPlayerPos.y)

                        if (currentPlayer.mp < 0) //Not enough mp
                            break

                        console.log(currentPlayer)


                        //Clear current player cell
                        game.map[currentPlayerPos.y][currentPlayerPos.x] = null

                        //Update new player
                        game.map[body.y][body.x] = currentPlayer
                        game.players[currentPlayerIndex] = currentPlayer
                        break
                    case 'attack':
                        if (currentPlayer.ap <= 0) //No ap
                            break

                        if (!currentPlayer.pokemon) //No pkmn
                            break

                        //Update hp of attacked enemy
                        currentPlayer.ap -= 1

                        //Get target player
                        const targetPlayer = /** @type {Player} */(game.map[body.y][body.x])
                        const targetPlayerIndex = game.players.findIndex(x => x.username === targetPlayer.username) //Based on uniq username for test

                        //Update target player
                        targetPlayer.life -= currentPlayer.pokemon?.attack

                        if (targetPlayer.life <= 0)
                            game.playersAlive -= 1

                        //Update target player
                        game.map[body.y][body.x] = targetPlayer.life > 0 ? targetPlayer : null
                        game.players[targetPlayerIndex] = targetPlayer

                        //Update current player
                        game.map[currentPlayerPos.y][currentPlayerPos.x] = currentPlayer
                        game.players[currentPlayerIndex] = currentPlayer

                        game.status = game.playersAlive <= 1 ? 'finished' : 'running'
                        break
                    case 'catch':
                        //Check if pkmn
                        if (game.map[body.y][body.x]?.type !== 'pokemon') //Not a pokemon
                            break

                        currentPlayer.mp -= Math.abs(body.x - currentPlayerPos.x) + Math.abs(body.y - currentPlayerPos.y)

                        if (currentPlayer.mp < 0) //Not enough mp
                            break

                        //If has pkmn, put in randomly on map
                        if (!!currentPlayer.pokemon) {
                            let y = -1
                            let x = -1
                            while (y < 0 || x < 0 || !game.map[y] || game.map[y][x] !== null) {
                                y = Math.floor(Math.random() * (game.map?.length - 0 + 1) + 0)
                                x = Math.floor(Math.random() * (game.map?.[0]?.length - 0 + 1) + 0)
                            }
                            game.map[y][x] = currentPlayer.pokemon
                        }

                        //Clear current player cell
                        game.map[currentPlayerPos.y][currentPlayerPos.x] = null

                        //Update new player
                        currentPlayer.pokemon = /** @type {Pokemon} */(game.map[body.y][body.x])
                        game.map[body.y][body.x] = currentPlayer
                        game.players[currentPlayerIndex] = currentPlayer
                        break
                    case 'skip':
                        //Update player
                        currentPlayer.isYourTurn = false
                        currentPlayer.ap = 1
                        currentPlayer.mp = 3

                        //Update new player
                        game.map[currentPlayerPos.y][currentPlayerPos.x] = currentPlayer
                        game.players[currentPlayerIndex] = currentPlayer

                        //Set next player turn is done
                        nextPlayer.isYourTurn = true

                        //Update pos new player
                        game.map[nextPlayerPos.y][nextPlayerPos.x] = nextPlayer
                        console.log('nextPlayer', nextPlayer)
                        game.players[nextPlayerIndex] = nextPlayer
                        console.log('game', JSON.stringify(game))

                        if (nextPosition === 1)
                            game.turnNumber += 1
                        break
                    default:
                        break
                }

                await GameModel.findOneAndUpdate({ gameId: game.gameId }, game).exec();

                res.send({
                    game: game
                });

            })
            .catch(err => {
                console.error(err);
                res.status(500).send('internal server error.');
            });
    });

export { gameRoutes };
