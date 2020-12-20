import mongoose from 'mongoose';
import {UserSchema} from "./User";
import {PokemonSchema} from "./Pokemon";

const {Schema} = mongoose;

export const PlayerSchema = new Schema({
    username: String,
    skin: String,
    pokemon: PokemonSchema,
    life: Number,
    isYourTurn: Boolean,
    position: Number
});

// Old version
export const _PlayerSchema = new Schema({
    user: UserSchema,
    hp: Number,
    position: Number,
    //location: CoordsSchema
});

export const PlayerModel = mongoose.model(
    'Player',
    PlayerSchema
);
