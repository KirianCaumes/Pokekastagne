import { Router } from 'express';
import { GameModel } from "../data/models/Game.js";
import { PokemonModel } from "../data/models/Pokemon.js";
import { generateCode, getNewMap, shuffleArray, searchAndUpdatePlayerCoords, summonPokemon } from "../utils/game.utils.js";
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
                    _id: userFromToken._id,
                    email: userFromToken.email,
                    username: userFromToken.username,
                    skin: userFromToken.skin,
                    pokemon: null,
                    life: GameConstants.DEFAULT_START_LIFE,
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
                    _id: userFromToken._id,
                    email: userFromToken.email,
                    username: userFromToken.username,
                    skin: userFromToken.skin,
                    pokemon: null,
                    life: GameConstants.DEFAULT_START_LIFE,
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
        const destCoords = {
            xCoord: req.body.x,
            yCoord: req.body.y
        };

        if (![GameConstants.ONLINE, GameConstants.OFFLINE].includes(gameMode)) {
            res.status(400).send('Syntax error for the mode, check your request url.');
            return;
        }
        if (!['walk', 'attack', 'catch', 'skip'].includes(move)) {
            res.status(400).send('Syntax error for the move, check your request url.');
            return;
        }

        GameModel.findOne({ gameId: gameId, mode: gameMode }).exec()
            .then(game => {
                let currentPlayer = game.players.find(player => player.isYourTurn);

                if ((Date.now() - currentPlayer.lastActionDate) / (1000 * 3600 * 24) > 1) {
                    // Too late
                    currentPlayer.life = 0;
                    game.playersAlive -= 1;

                    res.send('Your last move was more than 24h ago, disqualified!');
                } else {
                    switch (move) {
                        case 'walk':
                            game.map = searchAndUpdatePlayerCoords(game.map, currentPlayer);

                            game.map[destCoords.yCoord][destCoords.xCoord] = {
                                type: 'player',
                                ...currentPlayer
                            };

                            break;
                        case 'attack':
                            const attackedPlayer = game.map[destCoords.yCoord][destCoords.xCoord];

                            attackedPlayer.life -= currentPlayer.pokemon.attack;

                            // If the player is DEAD
                            if (attackedPlayer.life < 0) {
                                attackedPlayer.life = 0;
                                game.playersAlive -= 1;
                            }

                            break;
                        case 'catch':
                            const caughtPokemon = game.map[destCoords.yCoord][destCoords.xCoord];
                            game.map[destCoords.yCoord][destCoords.xCoord] = null;

                            if (currentPlayer.pokemon !== null) {
                                // Set the old pokemon randomly on the map
                                game.map = summonPokemon(game.map, currentPlayer.pokemon);
                            }
                            currentPlayer.pokemon = caughtPokemon;

                            break;
                        case 'skip':
                            // end of turn
                            const currentPlayerIndex = game.players.indexOf(currentPlayer);
                            currentPlayer.isYourTurn = false;

                            for (let i = currentPlayerIndex + 1; i < 100; i++) {
                                if (game.players[i].life > 0) {
                                    game.players[i].isYourTurn = true;

                                    UserModel.findOne({ _id: game.players[i]._id }).exec()
                                        .then(user => {
                                            webpush.sendNotification(user.subscription, JSON.stringify({
                                                title: 'A TOI DE JOUER BONHOMME' // TODO implement better
                                            })).catch(err => {
                                                console.error(err.stack);
                                            });
                                        });

                                    break;
                                }
                                if (i + 1 === game.players.length) {
                                    i = 0;
                                }
                            }

                            break;
                    }
                }

                if (game.playersAlive === 1) {
                    game.status = 'finished';
                    // currentPlayer won mais on sait pas qui
                }

                // Increment turn
                if (game.players.map(p => p.life > 0).indexOf(currentPlayer) === game.players.map(p => p.life > 0).length - 1) {
                    game.turnNumber += 1;
                }

                game.save();

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
