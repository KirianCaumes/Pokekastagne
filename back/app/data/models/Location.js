import mongoose from 'mongoose';
import {Player} from "./Player";
const { Schema } = mongoose;

const _Game = new Schema({
    players: [Player],
    playersNumber: Number,
    turnNumber: Number,
    timeLeftToPlay: Number,
    grid: [[]] // A revoir ça
});

export const Game = mongoose.model('Game', _Game);
