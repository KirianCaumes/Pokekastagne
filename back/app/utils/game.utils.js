function generateCode() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


function initGrid(xLength, yLength) {
    const grid = new Array(xLength);

    for (let cell in grid) {
        cell = new Array(yLength);
    }

    return grid;
}

function getNewGrid(xLength = 50, yLength = 50) {
    let emptyGrid = initGrid(xLength, yLength);
}

export {generateCode, getNewGrid};
