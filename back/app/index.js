import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import {mongoUrl} from "./config/config.main.js";
import {appRoutes} from "./routes/app.router.js";
import {userRoutes} from './routes/users.router.js';
import {gameRoutes} from "./routes/game.router.js";
import {authenticate} from "./security/auth.js";

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

/**
 * ROUTES
 */
app.use('/api', appRoutes);
app.use('/api/user', userRoutes);
app.use('/api/game', authenticate, gameRoutes);

app.get('/api', (req, res) => {
    res.send('Hello World!');
});


/**
 * APP
 */

// Serve static files from the React frontend app
app.use(express.static(path.join(path.resolve(), '/client')));
app.get('*', (req, res) => res.sendFile(path.join(path.resolve() + '/client/index.html')));
if (fs.existsSync(path.join(__dirname, '/client'))) {
    // Serve static files from the React frontend app
    app.use(express.static(path.join(__dirname, '/client')))
    app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/client/index.html')))
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
