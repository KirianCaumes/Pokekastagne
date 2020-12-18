'use strict';

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import {mongoUrl} from "./app/config/config.main.js";
import {userRoutes} from './app/routes/users.router.js';


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
app.use('/api/users', userRoutes);



app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

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
