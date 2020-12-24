import express from 'express';
import path from 'path'
import fs from 'fs'

const app = express();

/** @type {object} Express config */
const CONFIG = {
    PORT: process.env.PORT || 5000,
    HOST: process.env.HOST || '127.0.0.1'
}

app.get('/api', (req, res) => {
    res.send('Hello World!')
});

if (fs.existsSync(path.join(__dirname, '/client'))) {
    // Serve static files from the React frontend app
    app.use(express.static(path.join(__dirname, '/client')))
    app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/client/index.html')))
}

/** Run server */
app.listen(CONFIG.PORT, () => console.log(`Running on http://${CONFIG.HOST}:${CONFIG.PORT}`))
