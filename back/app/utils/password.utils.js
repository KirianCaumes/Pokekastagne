import bcrypt from 'bcryptjs';

async function encrypt(inputStr) {
    const saltRounds = 10;
    return await new Promise((res, rej) => {
        bcrypt.hash(inputStr, saltRounds, (err, hash) => {
            if (err) {
                rej(false);
            }
            res(hash);
        });
    });

}

async function compare(inputStr, dbHash) {
    return await new Promise((res, rej) => {
        bcrypt.compare(inputStr, dbHash, (err, result) => {
            if (err) {
                console.error(err);
                rej(err);
            }

            res(result);
        });
    });
}

export {encrypt, compare};
