import {Router} from 'express';

import {UserModel} from "../data/models/User";


const userRoutes = Router();

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
        if (req.body.pokemon === undefined || req.body.pokemon === null)
            req.body.pokemon = [];

        UserModel.create({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
            pokemon: req.body.pokemon
        })
            .then(user => {
                res.send(user);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('internal server error.');
            });
    });

userRoutes.route('/:id/pokemon')
    .get((req, res) => {
        const id = req.params.id;
        UserModel.findById(id).exec()
            .then(pokemon => {
                res.send(pokemon);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('internal server error.');
            });
    })
    .post((req, res) => {
        const id = req.params.id;

        UserModel.findById(id).exec()
            .then(user => {
                user.pokemon.push(
                    {
                        name: req.body.name,
                        atk: req.body.atk
                    }
                )
                user.save();
                res.send(user);

            }).catch(err => {
            console.error(err);
            res.status(500).send('internal server error.');
        });
    });


userRoutes.route('/:uid/pokemon/:pid')
    .get((req, res) => {
        const userId = req.params.uid;
        const pokemonId = req.params.pid;

        UserModel.findById(userId).exec()
            .then(user => {
                const foundPokemon = user.pokemon.find(el => el._id?.toString() === pokemonId);
                res.send(foundPokemon);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('internal server error.');
            });
    })

module.exports = userRoutes;
