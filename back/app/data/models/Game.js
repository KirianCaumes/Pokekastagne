import mongoose from 'mongoose';
import {Player} from "./Player";

const {Schema} = mongoose;

export const Game = mongoose.model(
    'Game',
    new Schema({
        players: [Player],
        playersNumber: Number,
        turnNumber: Number,
        timeLeftToPlay: Number,
        grid: [[]] // A revoir ça
    })
);
