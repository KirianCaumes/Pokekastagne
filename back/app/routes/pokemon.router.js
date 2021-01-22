import { Router } from 'express';

import { PokemonModel } from "../data/models/Pokemon.js";

const pokemonRoutes = Router();

pokemonRoutes.route('/')
    .get((req, res) => {
        PokemonModel.find().exec()
            .then(pokemon => {
                res.send({
                    pokemon: pokemon
                });
            })
            .catch(err => {
                return res.status(400).send({ error: 'internal server error.', stacktrace: JSON.stringify(err) });
            });
    })
    .post((req, res) => {
        PokemonModel.create({
            name: req.body.name,
            attack: req.body.attack
        })
            .then(pokemon => {
                res.send({
                    pokemon: pokemon
                });
            })
            .catch(err => {
                return res.status(400).send({ error: 'internal server error.', stacktrace: JSON.stringify(err) });
            });
    });


export { pokemonRoutes };
