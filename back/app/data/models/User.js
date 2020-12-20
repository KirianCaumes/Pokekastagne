import mongoose from 'mongoose';

const {Schema} = mongoose;


export const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
    },
    username: String,
    password: String,
    skin: String
});

export const UserModel = mongoose.model(
    'user',
    UserSchema
);
