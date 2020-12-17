import mongoose from 'mongoose';

const {Schema} = mongoose;

export const Pokemon = mongoose.model(
    'pokemon',
    new Schema({
        name: String,
        atk: Number
    })
);
