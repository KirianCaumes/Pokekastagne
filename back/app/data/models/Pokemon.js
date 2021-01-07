import mongoose from 'mongoose';


export const PokemonSchema = new mongoose.Schema({
    name: Object,
    attack: Number
});

export const PokemonModel = mongoose.model(
    'pokemon',
    PokemonSchema
);
