import express from 'express';
import mongoose from 'mongoose';
import {User} from "./app/data/models/User.js";
import {mongoUrl} from "./app/data/config/config.main.js";

const app = express();
const port = 5000;

app.route('/users')
    .post((req, res) => {
        User.create({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username
        }, (err, user) => {
            if (err) {
                console.error(err);
                res.status(500).send('internal server error.');
            }
            res.render(user);
        });
    })

app.get('/howto', (req, res) => {

});

// Not implemented
app.route('/settings')
    .get((req, res) => {

    })
    .post((req, res) => {
        // Changer les paramètres
    });

app.route('/play/single')
    .get((req, res) => {

    })
    .post((req, res) => {

    });

app.route('/play/single/:id')
    .get((req, res) => {

    })
    .post((req, res) => {

    });

app.route('/play/online')
    .get((req, res) => {

    })
    .post((req, res) => {

    });

app.route('/play/online/:id')
    .get((req, res) => {

    })
    .post((req, res) => {

    });


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
