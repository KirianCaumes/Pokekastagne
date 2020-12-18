import mongoose from 'mongoose';

const {Schema} = mongoose;

export const CoordsSchema = new Schema({
        players: [Player],
        playersNumber: Number,
        turnNumber: Number,
        timeLeftToPlay: Number,
        grid: [[]] // A revoir ça
});

export const CoordsModel = mongoose.model(
    'Coords',
    CoordsSchema
);
