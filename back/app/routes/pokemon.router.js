import {Router} from 'express';

import {PokemonModel} from "../data/models/Pokemon.js";

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
                console.error(err);
                res.status(500).send('internal server error.');
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
                console.error(err);
                res.status(500).send('internal server error.');
            });
    });


export {pokemonRoutes};
