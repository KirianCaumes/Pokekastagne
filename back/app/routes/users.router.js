import {Router} from 'express';

import {UserModel} from "../data/models/User.js";
import {encrypt} from "../utils/security.utils";

const userRoutes = Router();

// userRoutes.use('/auth', authRoutes);

userRoutes.route('/')
    .get((req, res) => {
        UserModel.find().exec()
            .then(users => {
                res.send(users);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('internal server error.');
            });
    })
    .post((req, res) => {
        // Create hash from password
        const hashPwd = encrypt(req.body.password);

        if (hashPwd === false) {
            res.status(500).send('issue with the password, aborting.');
        }

        UserModel.create({
            email: req.body.email,
            username: req.body.username,
            password: hashPwd,
            skin: req.body.skin
        })
            .then(user => {
                res.send(user);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('internal server error.');
            });
    });

userRoutes.route('/login')
    .post((req, res) => {
        // Login user
    });

export {userRoutes};
