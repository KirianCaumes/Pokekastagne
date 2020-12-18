import express from 'express';
import {userRoutes} from '../app/routes/user';

const app = express();
const port = 5000;

app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
