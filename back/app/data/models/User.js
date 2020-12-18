import mongoose from 'mongoose';
import {PokemonSchema} from "./Pokemon.js";

const {Schema} = mongoose;


export const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
    },
    password: String,
    username: String,
    pokemon: [PokemonSchema]
});

export const UserModel = mongoose.model(
    'user',
    UserSchema
);
