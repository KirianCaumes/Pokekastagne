import {bcrypt} from 'bcrypt';

function encrypt(inputStr) {
    const saltRounds = 10;
    bcrypt.hash(inputStr, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            return false;
        }

        return hash;
    });
}

function compare(inputStr, dbHash) {
    bcrypt.compare(inputStr, dbHash, (err, res) => {
        if (err) {
            console.error(err);
            return false;
        }

        return res;
    });
}

export {encrypt, compare};
