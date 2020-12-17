import mongoose from 'mongoose';

export function getDB() {
    const username = '';
    const password = '';
    const dbName = '';

    mongoose.connect('mongodb+srv://' + username + ':' + password + '@pokekastagnedb.a412i.mongodb.net/' + dbName + '?retryWrites=true&w=majority');

    return mongoose.connection;
}
