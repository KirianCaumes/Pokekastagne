import mongoose from 'mongoose';

export function getDB() {
    const username = 'sasha';
    const password = 'dubourgpalette';
    const dbName = 'pokekastagnedb';

    mongoose.connect(`mongodb+srv://${username}:${password}@pokekastagnedb.a412i.mongodb.net/${dbName}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );

    return mongoose.connection;
}
