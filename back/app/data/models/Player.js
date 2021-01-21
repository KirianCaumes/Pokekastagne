import mongoose from 'mongoose';
import { PokemonSchema } from "./Pokemon.js";

const { Schema } = mongoose;

export const PlayerSchema = new Schema({
    _id: Number,
    username: String,
    email: String,
    skin: String,
    pokemon: PokemonSchema,
    life: Number,
    ap: Number,
    mp: Number,
    isYourTurn: Boolean,
    position: Number,
    lastActionDate: Date
});

export const PlayerModel = mongoose.model(
    'Player',
    PlayerSchema
);
