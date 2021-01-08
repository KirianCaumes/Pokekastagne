import mongoose from 'mongoose';
import {PlayerSchema} from "./Player.js";


export const GameSchema = new mongoose.Schema({
        creatorId: String,
        gameId: String,
        players: [PlayerSchema],
        playersAlive: Number,
        turnNumber: Number,
        lastActionDate: Date,
        map: [[]],
        pngImg: Number,
        status: String, // await, running, finished
        gameMode: String    // offline, online
});

export const GameModel = mongoose.model(
    'Game',
    GameSchema
);
