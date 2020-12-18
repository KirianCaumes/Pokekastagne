import mongoose from 'mongoose';
import {User, UserSchema} from "./User";
import {Coords, CoordsSchema} from "./Coords";

const {Schema} = mongoose;

export const PlayerSchema = new Schema({
    user: UserSchema,
    hp: Number,
    position: Number,
    location: CoordsSchema
});

export const PlayerModel = mongoose.model(
    'Player',
    PlayerSchema
);
