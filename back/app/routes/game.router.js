import {Router} from 'express';
import {GameModel} from "../data/models/Game.js";
import {PokemonModel} from "../data/models/Pokemon.js";
import {generateCode, getNewMap, shuffleArray, searchAndUpdatePlayerCoords, summonPokemon} from "../utils/game.utils.js";
import {getUserFromToken} from "../security/auth.js";
import {MapModelModel} from "../data/models/MapModel";
import webpush from "web-push";
import {UserModel} from "../data/models/User";
import {GameConstants} from "../data/constants/game.constants";

const gameRoutes = Router();


gameRoutes.route('/:mode')
    .get((req, res) => {
        const gameMode = req.params.mode;
        const token = req.headers.authorization.split(' ')[1];
        const userFromToken = getUserFromToken(token);

        // Misspelled mode handling
        if (!['online', 'offline'].includes(gameMode)) {
            res.status(400).send('Syntax error, check your request url.');
            return;
        }

        // TODO try to filter in the query
        GameModel.find({status: {$in: ['await', 'running']}, mode: gameMode}).exec()
            .then(games => {
                const userGames = games.players.find(player => player.user?.email === userFromToken.email);
                res.send({
                    games: userGames
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('internal server error.');
            });
    })
    .post((req, res) => {
        const gameMode = req.params.mode;
        let generatedCode = '';

        // Assert that the generatedCode is unique in the database
        GameModel.find({}).exec()
            .then(games => {
                const alreadyUsedCodes = games.map(item => item.gameId);
                generatedCode = generateCode(alreadyUsedCodes);

                const token = req.headers.authorization.split(' ')[1];
                const userFromToken = getUserFromToken(token);

                // Create the game
                GameModel.create({
                    creatorId: userFromToken.id,
                    gameId: generatedCode,
                    players: [
                        {
                            _id: userFromToken.id,
                            username: userFromToken.username,
                            skin: userFromToken.skin,
                            pokemon: null,
                            life: process.env.START_LIFE,
                            isYourTurn: false,
                            position: 1
                        }
                    ],
                    playersAlive: 1, // TODO changer ça / mais je sais plus pourquoi mdr
                    turnNumber: 1,
                    startDate: new Date(),
                    map: [[]],
                    status: "await",
                    gameMode: gameMode
                })
                    .then(game => {
                        res.send({
                            game: game
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).send('Could not create the game.');
                    });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Could not create the game id, aborting.');
            });
    });

gameRoutes.route('/:mode/:id')
    .get((req, res) => {
        const gameMode = req.params.mode;
        const gameId = req.params.id;

        GameModel.findOne({gameMode: gameMode, gameId: gameId}).exec()
            .then(game => {
                res.send({
                    game: game
                });

            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Could not fetch the game.');
            });
    })
    .put((req, res) => {
        const gameMode = req.params.mode;
        const gameId = req.params.id;
        const token = req.headers.authorization.split(' ')[1];
        const userFromToken = getUserFromToken(token);

        if (!['online', 'offline'].includes(gameMode)) {
            res.status(400).send('Syntax error, check your request url.');
            return;
        }

        GameModel.findOne({gameId: gameId, gameMode: gameMode}).exec()
            .then(game => {
                if (game === null) {
                    res.status(404).send('Cannot find your game! Check your game code.');
                    return;
                } else if (game.players.length === 5) {
                    res.send('The lobby is already full!');
                    return;
                } else if (game.status === 'running') {
                    res.send('The game already started!');
                    return;
                } else if (game.status === 'finished') {
                    res.send('The game is already finished.');
                    return;
                }
                if (game.players.map(p => p._id).includes(userFromToken.id)) {
                    res.send('You already are in this game!');
                }

                game.players.push({
                    _id: userFromToken.id,
                    username: userFromToken.username,
                    skin: userFromToken.skin,
                    pokemon: null,
                    ap: GameConstants.DEFAULT_AP,
                    mp: GameConstants.DEFAULT_MP,
                    life:  GameConstants.DEFAULT_START_LIFE,
                    isYourTurn: false,
                    position: game.players.length + 1
                });
                game.playersAlive++;

                if (game.playersAlive === 5) {
                    // Start the game
                    game.status = 'running';

                    game.players.forEach(player => {
                        player.lastActionDate = Date.now();
                    });

                    PokemonModel.find({}).exec()
                        .then(pokemon => {
                            if (pokemon.length < 5) {
                                res.status(404).send('Not enough pokemon! Aborting.');
                                return;
                            }

                            game.players = shuffleArray(game.players);
                            for (let i = 0; i < game.players.length; i++) {
                                game.players[i].position = i + 1;
                            }

                            // Init map
                            const shuffled = shuffleArray(pokemon)

                            MapModelModel.find({}).exec()
                                .then(mapModels => {
                                    const chosenModel = mapModels[Math.floor(Math.random() * mapModels.length)];

                                    game.map = getNewMap(game.players, shuffled, chosenModel.map);
                                    game.pngImg = chosenModel.pngImg;

                                    game.save();

                                    res.send({
                                        game: game
                                    });
                                })
                                .catch(err => {
                                    console.error(err);
                                    res.status(500).send('Error fetching the mapModel.');
                                });
                        }).catch(err => {
                            console.error(err);
                            res.status(500).send('Error fetching pokemon.');
                        });
                } else {
                    game.save();

                    res.send({
                        game: game
                    });
                }

            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Could not create the game.');
            });
    })
    .delete((req, res) => {
        const gameId = req.params.id;

        const token = req.headers.authorization.split(' ')[1];
        const userFromToken = getUserFromToken(token);

        GameModel.findOneAndDelete({creatorId: userFromToken.id, gameId: gameId}).exec()
            .then(deletedGame => {
                res.send('Successfully deleted!');
            })
            .catch(err => {
                // TODO handle 404 errors? and not allowed to delete errors?
                console.error(err);
                res.status(500).send('internal server error.');
            });
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

        if (!['online', 'offline'].includes(gameMode)) {
            res.status(400).send('Syntax error for the mode, check your request url.');
            return;
        }
        if (!['walk', 'attack', 'catch', 'skip'].includes(move)) {
            res.status(400).send('Syntax error for the move, check your request url.');
            return;
        }

        GameModel.findOne({gameId: gameId, mode: gameMode}).exec()
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

                                    UserModel.findOne({_id: game.players[i]._id}).exec()
                                        .then(user => {
                                            webpush.sendNotification(user.subscription, {
                                                title: 'A TOI DE JOUER BONHOMME' // TODO implement better
                                            }).catch(err => {
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

export {gameRoutes};
