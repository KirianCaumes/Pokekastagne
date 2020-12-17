import mongoose from 'mongoose';
import {User} from "./User";
import {Coords} from "./Coords";

const {Schema} = mongoose;

export const Player = mongoose.model(
    'Player',
    new Schema({
        user: User,
        hp: Number,
        position: Number,
        location: Coords
    })
);
