const login = process.env.DB_LOGIN;
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_DBNAME;
const host = process.env.DB_HOST;

export const mongoUrl = `mongodb+srv://${login}:${password}@${host}/${dbName}?retryWrites=true&w=majority`;
