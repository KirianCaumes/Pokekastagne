import {Router} from 'express';


const appRoutes = Router();

appRoutes.get('/howto', (req, res) => {

});

appRoutes.route('/settings')
    .get((req, res) => {

    })
    .post((req, res) => {
        // Changer les paramètres
    });

export {appRoutes};
