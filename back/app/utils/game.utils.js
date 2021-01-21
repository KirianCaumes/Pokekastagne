import {GameConstants} from "../data/constants/game.constants";

function generateCode(alreadyUsedCodes) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    let strLength = 5;
    for (let i = 0; i < strLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    if (alreadyUsedCodes.includes(result)) {
        generateCode(alreadyUsedCodes);
    }

    return result;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function addPokemon(map, pokemon) {
    const xLength = map[0]?.length;
    const yLength = map.length;

    if (!xLength || !yLength)
        return map

    let i = 0;
    while (i < pokemon?.length) {
        let xCoord = getRandomInt(xLength);
        let yCoord = getRandomInt(yLength);

        if (map[yCoord][xCoord] === null) {
            map[yCoord][xCoord] = {
                type: 'pokemon',
                name: pokemon[i].name,
                attack: pokemon[i].attack,
                skin: pokemon[i].skin
            }
            i++;
        }
    }

    return map;
}

function initPlayerPositions(map, players) {
    const xLength = map[0]?.length;
    const yLength = map.length;

    if (!xLength || !yLength)
        return map

    let i = 0;

    while (i < players.length) {
        let xCoord = getRandomInt(xLength);
        let yCoord = getRandomInt(yLength);

        if (map[yCoord][xCoord] === null) {
            map[yCoord][xCoord] = {
                type: 'player',
                _id: players[i]._id,
                username: players[i].username,
                skin: players[i].skin,
                pokemon: null,
                life: players[i].life,
                ap: GameConstants.DEFAULT_AP,
                mp: GameConstants.DEFAULT_MP,
                isYourTurn: players[i].isYourTurn,
                position: players[i].position
            }
            i++;
        }
    }

    return map;
}

// TODO implement for multiple maps

function getNewMap(players, pokemon, map) {
    let blankMap = map;

    const playerMap = initPlayerPositions(blankMap, players);
    const readyMap = addPokemon(playerMap, pokemon);

    return readyMap;
}

function summonPokemon(map, pokemon) {
    const xLength = map[0].length;
    const yLength = map.length;

    let xCoord = getRandomInt(xLength);
    let yCoord = getRandomInt(yLength);

    if (map[yCoord][xCoord] === null) {
        map[yCoord][xCoord] = {
            type: 'pokemon',
            name: pokemon.name,
            attack: pokemon.attack,
            skin: pokemon.skin
        }
    } else {
        // TODO pas sûr de la manoeuvre
        return summonPokemon(map, pokemon);
    }
    return map;
}

function findPlayerCoords(map, player) {
    for (const [y, row] of map.entries()) {
        for (const [x, cell] of row.entries()) {
            if (cell?.type === 'player') {
                if (cell._id.toString() === player._id.toString()) {
                    return {x, y};
                }
            }
        }
    }
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }

    return arr;
}


export {generateCode, getNewMap, summonPokemon, findPlayerCoords, shuffleArray};
