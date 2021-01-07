import {Router} from 'express';
import {authenticate} from "../security/auth.js";


const appRoutes = Router();

appRoutes.get('/howto', authenticate, (req, res) => {

});

appRoutes.route('/settings')
    .get((req, res) => {

    })
    .post((req, res) => {
        // Changer les paramètres
    });

export {appRoutes};
