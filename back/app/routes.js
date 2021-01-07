const express = require('express');
const router = express.Router();

import {userCtrl} from '../controllers/user';

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

export  {router};