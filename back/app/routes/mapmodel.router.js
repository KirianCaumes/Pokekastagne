import {Router} from 'express';

import {MapModelModel} from "../data/models/MapModel.js";

const mapModelRoutes = Router();

mapModelRoutes.route('/')
    .get((req, res) => {
        MapModelModel.find().exec()
            .then(mapModels => {
                res.send({
                    mapModels: mapModels
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('internal server error.');
            });
    })
    .post((req, res) => {
        MapModelModel.create({
            map: req.body.map,
            pngImg: req.body.pngImg
        })
            .then(mapModel => {
                res.send({
                    mapModel: mapModel
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('internal server error.');
            });
    });


export {mapModelRoutes};
