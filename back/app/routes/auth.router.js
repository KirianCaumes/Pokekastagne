import express from 'express' ;
import {signup, login} from '../controllers/user' ;


const authRoutes = express.Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);

export  {authRoutes};
