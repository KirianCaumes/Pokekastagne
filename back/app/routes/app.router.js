import {Router} from 'express';
import {authenticate} from "../security/auth.js";
import {GameModel} from "../data/models/Game.js";
import {rememberPlayerToPlay} from "../utils/main.utils.js";
import {UserModel} from "../data/models/User";
import webpush from "web-push";
import {isPlayerOutOfTime} from "../utils/main.utils";


const appRoutes = Router();

appRoutes.get('/howto', authenticate, (req, res) => {

});

appRoutes.route('/settings')
    .get((req, res) => {

    })
    .post((req, res) => {
        // Changer les paramètres
    });


appRoutes.route('/alertActivePlayers')
    .get((req, res) => {
        GameModel.find().exec()
            .then(games => {
                games.forEach(game => {
                    for (let i = 0; i < game.length; i++) {
                        let player = game.players[i];

                        if (player.isYourTurn) {
                            if (rememberPlayerToPlay(player.lastActionDate)) {
                                UserModel.findOne({_id: player._id}).exec()
                                    .then(user => {
                                        user.subscriptions.forEach(sub => {
                                            webpush.sendNotification(sub, JSON.stringify({
                                                title: `Remember to play your move, trainer ${user.username}!`,
                                                gameCode: game.gameId,
                                                actions: [
                                                    {action: 'see', title: 'See'},
                                                    {action: 'close', title: 'Close'},
                                                ],
                                            })).catch(err => {
                                                console.error(err.stack);
                                            });
                                        });
                                    });
                            } else if (isPlayerOutOfTime(player.lastActionDate)) {
                                UserModel.findOne({_id: player._id}).exec()
                                    .then(user => {
                                        user.subscriptions.forEach(sub => {
                                            webpush.sendNotification(sub, JSON.stringify({
                                                title: `You waited too long to play, skipping your turn trainer ${user.username}!`,
                                                gameCode: game.gameId,
                                                actions: [
                                                    {action: 'see', title: 'See'},
                                                    {action: 'close', title: 'Close'},
                                                ],
                                            })).catch(err => {
                                                console.error(err.stack);
                                            });
                                        });
                                    });

                                game.players[i].isYourTurn = false;

                                if (game.players.length - 1 === i)
                                    game.players[0].isYourTurn = true;
                                else
                                    game.players[i + 1].isYourTurn = true;
                            }
                        }
                    }
                });
            });
        return res.status(200).send('Success!');
    });

export {appRoutes};
