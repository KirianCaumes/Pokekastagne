import mongoose from 'mongoose';
import {UserSchema} from "./User.js";
import {PokemonSchema} from "./Pokemon.js";

const {Schema} = mongoose;

export const PlayerSchema = new Schema({
    _id: Number,
    username: String,
    skin: String,
    pokemon: PokemonSchema,
    life: Number,
    isYourTurn: Boolean,
    position: Number
});

export const PlayerModel = mongoose.model(
    'Player',
    PlayerSchema
);
