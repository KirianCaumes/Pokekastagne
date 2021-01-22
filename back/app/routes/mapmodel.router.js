import { Router } from 'express';

import { MapModelModel } from "../data/models/MapModel.js";

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
                return res.status(400).send({ error: 'internal server error.', stacktrace: JSON.stringify(err) });
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
                return res.status(400).send({ error: 'internal server error.', stacktrace: JSON.stringify(err) });
            });
    });


export { mapModelRoutes };
