import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import webpush from 'web-push';
import dotenv from 'dotenv';
import { mongoUrl } from "./config/config.main.js";
import { appRoutes } from "./routes/app.router.js";
import { userRoutes } from './routes/users.router.js';
import { gameRoutes } from "./routes/game.router.js";
import { mapModelRoutes } from "./routes/mapmodel.router.js";
import {pokemonRoutes} from "./routes/pokemon.router.js";
import { authenticate } from "./security/auth.js";


/**
 * PARAMS
 */
const app = express();
app.use(bodyParser.json());


/**
 * CONFIG
 */
/** @type {object} Express config */
const CONFIG = {
    PORT: process.env.PORT || 5000,
    HOST: process.env.HOST || '127.0.0.1'
}

dotenv.config();

webpush.setVapidDetails('mailto:malo.dupont@ynov.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);


/**
 * ROUTES
 */
app.use('/api', appRoutes);
app.use('/api/user', userRoutes);
app.use('/api/mapmodel', authenticate, mapModelRoutes);
app.use('/api/pokemon', authenticate, pokemonRoutes);
app.use('/api/game', authenticate, gameRoutes);

app.get('/api', (req, res) => {
    res.send('Hello World!');
});

app.get('/api', (req, res) => {
    res.send('Hello World!');
});

app.post('/api/subscribe', (req, res) => {
    const subscription = req.body;
    const payload = JSON.stringify({ title: 'test' });

    console.log(subscription);

    res.status(201).send({
        sub: subscription,
        payload: payload
    });


    webpush.sendNotification(subscription, payload).catch(err => {
        console.error(err.stack);
    });
});


/**
 * APP
 */
if (fs.existsSync(path.join(path.resolve(), '/client'))) {
    // Serve static files from the React frontend app
    app.use(express.static(path.join(path.resolve(), '/client')))
    app.get('*', (req, res) => res.sendFile(path.join(path.resolve() + '/client/index.html')))
}

/** Run server */
app.listen(CONFIG.PORT, () => console.log(`Running on http://${CONFIG.HOST}:${CONFIG.PORT}`));


/**
 * MONGODB CONNECTION
 */
mongoose.connect(mongoUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(
        () => console.log('Connected to database!'),
        err => console.log('Unable to connect to database...\n', err)
    )
    .catch(err => console.log('Unable to connect to database...\n', err));
