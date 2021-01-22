import {Router} from 'express';

import {UserModel} from "../data/models/User.js";
import {compare, encrypt} from "../utils/password.utils.js";
import {authenticate, getUserFromToken, login} from "../security/auth.js";
import {getRandomSkin} from "../utils/user.utils.js";

const userRoutes = Router();

userRoutes.route('/')
    .get(authenticate, (req, res) => {
        UserModel.find().exec()
            .then(users => {
                res.send({
                    users: users
                });
            })
            .catch(err => {
                return res.status(400).send({error: 'internal server error.', stacktrace: err});
            });
    })
    .post((req, res) => {
        // Create hash from password
        encrypt(req.body.password).then(hash => {
            if (hash === false)
                return res.status(400).send({error: 'issue with the password, aborting.', stacktrace: null});

            // console.log(hash);

            // if (!skins.values().includes(req.body.skin)) {
            //     res.status(400).send('This skin does not exist. Available skins are : ' + skins.values());
            //     return;
            // }

            UserModel.create({
                email: req.body.email,
                username: req.body.username,
                password: hash,
                skin: getRandomSkin()
            })
                .then(_user => {
                    res.send({
                        user: {
                            token: login(_user)
                        }
                    });
                })
                .catch(err => {
                    return res.status(400).send({error: 'internal server error.', stacktrace: JSON.stringify(err)});
                });
        })
            .catch(err => {
                return res.status(400).send({
                    error: 'Issue hashing the password, aborting.',
                    stacktrace: JSON.stringify(err)
                });
            });
    });

userRoutes.route('/login')
    .post((req, res) => {
        // Login user
        const {email, password} = req.body;

        UserModel.findOne({email: email}).exec()
            .then(_user => {
                if (!_user)
                    return res.status(404).send({error: 'No user found with these credentials.', stacktrace: null});

                compare(password, _user.password).then(_res => {
                    if (_res) {
                        res.send({
                            user: {
                                token: login(_user)
                            }
                        });
                    } else {
                        res.status(401).send('Wrong password.');
                    }
                }).catch(err => {
                    return res.status(400).send({
                        error: 'Internal server error, please retry later.',
                        stacktrace: JSON.stringify(err)
                    });
                });

            }).catch(err => {
            return res.status(400).send({error: 'internal server error.', stacktrace: JSON.stringify(err)});
        });
    });

userRoutes.route('/subscribe')
    .post(authenticate, (req, res) => {
        const subscription = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const userFromToken = getUserFromToken(token);

        UserModel.findOneAndUpdate(
            {email: userFromToken.email},
            {
                $push: {
                    subscriptions: subscription
                }

            }).exec()
            .then(() => {
                console.log('subscribing');

                res.status(201).json({});
            })
            .catch(err => {
                return res.status(400).send({error: 'internal server error.', stacktrace: JSON.stringify(err)});
            });
    });

userRoutes.route('/me')
    .get(authenticate, (req, res) => {

        const token = req.headers.authorization.split(' ')[1];
        const userFromToken = getUserFromToken(token);

        UserModel.findOne({email: userFromToken.email}).exec()
            .then(_user => {
                res.send({
                    user: _user
                });

            }).catch(err => {
            return res.status(400).send({error: 'internal server error.', stacktrace: JSON.stringify(err)});
        });
    });

export {userRoutes};
