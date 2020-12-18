import mongoose from 'mongoose';
import {PlayerSchema} from "./Player";

const {Schema} = mongoose;

export const GameSchema = new Schema({
        players: [PlayerSchema],
        playersNumber: Number,
        turnNumber: Number,
        timeLeftToPlay: Number,
        grid: [[]] // A revoir ça
});

export const GameModel = mongoose.model(
    'Game',
    GameSchema
);
