import mongoose from 'mongoose';
import {Pokemon} from "./Pokemon";

const {Schema} = mongoose;

export const User = mongoose.model(
    'user',
    new Schema({
        email: {
            type: String,
            unique: true,
        },
        password: String,
        username: String,
        pokemon: [Pokemon]
    })
);
