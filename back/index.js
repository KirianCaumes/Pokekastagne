'use strict';

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import {mongoUrl} from "./app/config/config.main.js";
import {userRoutes} from './app/routes/users.router.js';
import {authRoutes} from './app/routes/auth.router.js';
import path from 'path'


/**
 * PARAMS
 */
const app = express();
app.use(bodyParser.json());
app.use('/api')
const port = 5000;

/**
 * ROUTES
 */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);



app.get('/', (req, res) => {
/** @type {object} Express config */
const CONFIG = {
    PORT: process.env.PORT || 5000,
    HOST: process.env.HOST || '127.0.0.1'
}

app.get('/api', (req, res) => {
    res.send('Hello World!')
    res.send('Hello World!')
});


// Serve static files from the React frontend app
app.use(express.static(path.join(path.resolve(), '/client')))
app.get('*', (req, res) => res.sendFile(path.join(path.resolve() + '/client/index.html')))


/** Run server */
app.listen(CONFIG.PORT, () => console.log(`Running on http://${CONFIG.HOST}:${CONFIG.PORT}`))


/**
 * MONGODB / MONGOOSE
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
