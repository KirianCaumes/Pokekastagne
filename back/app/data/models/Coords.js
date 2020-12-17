import mongoose from 'mongoose';

const {Schema} = mongoose;

export const Coords = mongoose.model(
    'Coords',
    new Schema({
        players: [Player],
        playersNumber: Number,
        turnNumber: Number,
        timeLeftToPlay: Number,
        grid: [[]] // A revoir ça
    })
);
