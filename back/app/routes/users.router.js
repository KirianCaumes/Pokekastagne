import { Router } from 'express';

import { UserModel } from "../data/models/User.js";
import { compare, encrypt } from "../utils/password.utils.js";
import { authenticate, getUserFromToken, login } from "../security/auth.js";
import {skins} from "../data/playerSkins";

const userRoutes = Router();

// userRoutes.use('/auth', authRoutes);

userRoutes.route('/')
    .get(authenticate, (req, res) => {
        UserModel.find().exec()
            .then(users => {
                res.send({
                    users: users
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('internal server error.');
            });
    })
    .post((req, res) => {
        // Create hash from password
        encrypt(req.body.password).then(hash => {
            if (hash === false) {
                res.status(500).send('issue with the password, aborting.');
                return;
            }
            console.log(hash);

            if (!skins.values().includes(req.body.skin)) {
                res.status(400).send('This skin does not exist. Available skins are : ' + skins.values());
                return;
            }

            UserModel.create({
                email: req.body.email,
                username: req.body.username,
                password: hash,
                skin: req.body.skin
            })
                .then(_user => {
                    res.send({
                        user: {
                            token: login(_user)
                        }
                    });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send('internal server error.');
                });
        }).catch(err => {
            console.error(err);
            res.status(500).send('Issue hashing the password, aborting.')
        });
    });

userRoutes.route('/login')
    .post((req, res) => {
        // Login user
        const { email, password } = req.body;

        UserModel.findOne({ email: email }).exec()
            .then(_user => {
                if (!_user) {
                    res.status(404).send('No user found with these credentials.');
                }

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
                    console.error(err);
                    res.status(500).send('Internal server error, please retry later.');
                });

            }).catch(err => {
                console.error(err);
                res.status(500).send('internal server error.');
            });
    });

userRoutes.route('/me',)
    .get(authenticate, (req, res) => {

        const token = req.headers.authorization.split(' ')[1];
        const userFromToken = getUserFromToken(token);

        UserModel.findOne({ email: userFromToken.email }).exec()
            .then(_user => {
                res.send({
                    user: _user
                });

            }).catch(err => {
                console.error(err);
                res.status(500).send('internal server error.');
            });
    });

export { userRoutes };
