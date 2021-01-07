import {Router} from 'express';
import {GameModel} from "../data/models/Game.js";
import {generateCode, getNewGrid} from "../utils/game.utils.js";
import {getUserFromToken} from "../security/auth";

const gameRoutes = Router();


gameRoutes.route('/:mode')
    .get((req, res) => {
        const gameMode = req.params.mode;
        const token = req.headers.authorization.split(' ')[1];
        const userFromToken = getUserFromToken(token);

        // Misspelled mode handling
        if (!['online', 'offline'].includes(gameMode)) {
            res.status(400).send('Syntax error, check your request url.');
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
        const generatedCode = generateCode();

        const token = req.headers.authorization.split(' ')[1];
        const userFromToken = getUserFromToken(token);

        const lifeValue = 100;

        GameModel.create({
            creatorId: userFromToken.id,
            gameCode: generatedCode,
            players: [
                {
                    _id: userFromToken.id,
                    username: userFromToken.username,
                    skin: userFromToken.skin,
                    pokemon: null,
                    life: lifeValue,
                    isYourTurn: false,
                    position: 1
                }
            ],
            playersAlive: 1, // TODO changer ça
            turnNumber: 1,
            lastActionDate: new Date(), // setting to now???
            grid: getNewGrid(0, 0),
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
    });

gameRoutes.route('/:mode/:id')
    .get((req, res) => {
        // Get a game
    })
    .put((req, res) => {
        const gameMode = req.params.mode;
        const gameCode = req.params.id;
        const token = req.headers.authorization.split(' ')[1];
        const userFromToken = getUserFromToken(token);
        const lifeValue = 100;

        if (!['online', 'offline'].includes(gameMode)) {
            res.status(400).send('Syntax error, check your request url.');
        }

        GameModel.findOne({gameCode: gameCode, gameMode: gameMode}).exec()
            .then(game => {
                game.players.push({
                    _id: userFromToken.id,
                    username: userFromToken.username,
                    skin: userFromToken.skin,
                    pokemon: null,
                    life: lifeValue,
                    isYourTurn: false,
                    position: game.players.length + 1
                });
                game.playersAlive++;
                game.lastActionDate = new Date();

                if (game.playersAlive === 5) {
                    game.status = 'running';
                }

                game.save();

                res.send({
                    game: game
                });

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

        GameModel.findOneAndDelete({creatorId: userFromToken.id, gameCode: gameId}).exec()
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
        }
        if (!['walk', 'attack', 'catch', 'skip'].includes(move)) {
            res.status(400).send('Syntax error for the move, check your request url.');
        }

        GameModel.findOne({gameCode: gameId, mode: gameMode}).exec()
            .then(game => {
                switch (move) {
                    case 'walk':
                        game.map[destCoords.xCoord][destCoords.yCoord] = {
                            // Current player
                        };

                        game.save();
                        break;
                    case 'attack':
                        break;
                    case 'catch':
                        break;
                    case 'skip':
                        break;
                }

                // TODO actions
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('internal server error.');
            });
    });

export {gameRoutes};
