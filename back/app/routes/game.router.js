import {Router} from 'express';
import {GameModel} from "../data/models/Game.js";
import {generateCode, getNewGrid} from "../utils/game.utils.js";

const gameRoutes = Router();


gameRoutes.route('/:mode')
    .get((req, res) => {
        const gameMode = req.params.mode;

        // Misspelled mode handling
        if (!['online', 'offline'].includes(gameMode)) {
            res.status(400).send('Syntax error, check your request url.');
        }

        // TODO try to filter in the query
        GameModel.find({status: {$in: ['await', 'running']}, mode: gameMode}).exec()
            .then(games => {
                const userGames = games.players.find(player => player.user?._id.toString() === "" /* put here connected user */);
                res.send(userGames);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('internal server error.');
            });
    })
    .post((req, res) => {
        const gameMode = req.params.mode;
        const generatedCode = generateCode();

        GameModel.create({
            creatorId: "", // put here connected user id
            gameCode: generatedCode,
            players: [
                // Put connected user
            ],
            playersAlive: 0,
            turnNumber: 1,
            lastActionDate: new Date(), // setting to now???
            grid: getNewGrid(0, 0),
            status: "await",
            mode: gameMode
        })
            .then(game => {
                res.send(game);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('internal server error.');
            });
    });

gameRoutes.route('/:mode/:id')
    .get((req, res) => {
        // Get a game
    })
    .put((req, res) => {
        const gameMode = req.params.mode;
        // Join a game
        if (!['online', 'offline'].includes(gameMode)) {
            res.status(400).send('Syntax error, check your request url.');
        }


    })
    .delete((req, res) => {
        const userId = 0; // get connected user id
        const gameId = req.params.id;

        GameModel.findOneAndDelete({creatorId: userId, gameCode: gameId}).exec()
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
                game.map
                // TODO actions
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('internal server error.');
            });
    });

export {gameRoutes};
