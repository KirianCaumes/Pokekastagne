import {Router} from 'express';
import {authenticate} from "../security/auth.js";
import {GameModel} from "../data/models/Game.js";
import {isPlayerTurnOutdated} from "../utils/main.utils.js";
import {UserModel} from "../data/models/User";
import webpush from "web-push";


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
                    game.players.forEach(player => {
                        if (player.isYourTurn && !isPlayerTurnOutdated(player.lastActionDate)) {
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

                                    return res.status(200).send('Success!');
                                });
                        }
                    });
                });
            });
    });

export {appRoutes};
