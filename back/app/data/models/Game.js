import mongoose from 'mongoose';
import {PlayerSchema} from "./Player.js";


export const GameSchema = new mongoose.Schema({
        creatorId: String,
        gameCode: String,
        players: [PlayerSchema],
        playersAlive: Number,
        turnNumber: Number,
        lastActionDate: Date,
        map: [[]],
        status: String, // await, running, finished
        gameMode: String    // offline, online
});

// Old version
export const _GameSchema = new mongoose.Schema({
        gameCode: String,
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
