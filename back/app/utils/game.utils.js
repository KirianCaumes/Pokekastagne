import {map} from "../data/maps.js";

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
    const xLength = map[0].length;
    const yLength = map.length;

    let i = 0;
    while (i < 5) {
        let xCoord = getRandomInt(xLength);
        let yCoord = getRandomInt(yLength);

        if (map[yCoord][xCoord] === null) {
            map[yCoord][xCoord] = {
                type: 'pokemon',
                name: pokemon[i].name,
                attack: pokemon[i].attack
            }
            i++;
        }
    }

    return map;
}

function initPlayerPositions(map, players) {
    const xLength = map[0].length;
    const yLength = map.length;

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
            attack: pokemon.attack
        }
    } else {
        // TODO pas sûr de la manoeuvre
        return summonPokemon(map, pokemon);
    }
    return map;
}

function searchAndUpdatePlayerCoords(map, player) {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j].type === 'player') {
                if (map[i][j]._id === player._id) {
                    map[i][j] = null;
                }
            }
        }
    }

    return map;
}

function shuffleArray(arr) {
    for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * i)
        const temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }

    return arr;
}


export {generateCode, getNewMap, summonPokemon, searchAndUpdatePlayerCoords, shuffleArray};
