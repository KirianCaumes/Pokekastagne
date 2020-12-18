import express from 'express';
import path from 'path'

const app = express();

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
