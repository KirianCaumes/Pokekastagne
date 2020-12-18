import express from 'express';

const app = express();
const port = 5000;

app.get('/api', (req, res) => {
    res.send('Hello World!')
    res.send('Hello World!')
});


// Serve static files from the React frontend app
app.use(express.static(path.join(path.resolve(), '/client')))
app.get('*', (req, res) => res.sendFile(path.join(path.resolve() + '/client/index.html')))


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
