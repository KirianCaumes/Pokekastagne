import mongoose from 'mongoose';


export const PokemonSchema = new mongoose.Schema({
    name: Object,
    type: String,
    attack: Number,
    skin: String
});

export const PokemonModel = mongoose.model(
    'pokemon',
    PokemonSchema
);
