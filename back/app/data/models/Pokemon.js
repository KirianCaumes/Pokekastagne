import mongoose from 'mongoose';

const {Schema} = mongoose;

export const PokemonSchema = new Schema({
    name: String,
    atk: Number
});

export const PokemonModel = mongoose.model(
    'pokemon',
    PokemonSchema
);
