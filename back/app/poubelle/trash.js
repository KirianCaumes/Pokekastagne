/*
import {findPlayerCoords, summonPokemon} from "../utils/game.utils";
import {GameConstants} from "../data/constants/game.constants";
import {UserModel} from "../data/models/User";
import webpush from "web-push";

let currentPlayer = game.players.find(player => player.isYourTurn);
let currentPlayerCoords = findPlayerCoords(game.map, currentPlayer);
const currentPlayerIndex = game.players.findIndex(x => x._id === currentPlayer._id); //Based on uniq username for test

// TODO à revoir
if ((Date.now() - currentPlayer.lastActionDate) / (1000 * 3600 * 24) > 1) {
    // Too late
    currentPlayer.life = 0;
    game.playersAlive -= 1;

    res.send('Your last move was more than 24h ago, disqualified!');

} else {
    switch (move) {
        case 'walk':
            currentPlayerCoords = findPlayerCoords(game.map, currentPlayer);

            currentPlayer.mp -= Math.abs(destCoords.x - currentPlayerCoords.x) + Math.abs(destCoords.y - currentPlayerCoords.y);

            if (currentPlayer.mp <= 0) // Not enough mp
                break;

            game.map[currentPlayerCoords.y][currentPlayerCoords.x] = null;
            game.map[destCoords.y][destCoords.x] = {
                type: 'player',
                ...currentPlayer
            };

            game.players[currentPlayerIndex] = currentPlayer;

            break;
        case 'attack':
            if (currentPlayer.ap <= 0) //No ap
                break;

            if (!currentPlayer.pokemon) //No pkmn
                break;

            const targetPlayer = game.map[destCoords.y][destCoords.x];
            const targetPlayerIndex = game.players.findIndex(x => x._id === targetPlayer._id);//Based on uniq username for test

            targetPlayer.life -= currentPlayer.pokemon.attack;
            currentPlayer.ap -= 1

            // If the player is DEAD
            if (targetPlayer.life < 0) {
                targetPlayer.life = 0;
                game.playersAlive -= 1;
            }



            game.map[destCoords.y][destCoords.x] = targetPlayer.life > 0 ? targetPlayer : null;
            game.players[targetPlayerIndex] = targetPlayer;

            break;
        case 'catch':
            if (game.map[destCoords.y][destCoords.x]?.type !== 'pokemon') //Not a pokemon
                break;

            const caughtPokemon = game.map[destCoords.y][destCoords.x];
            game.map[destCoords.y][destCoords.x] = null;

            if (currentPlayer.pokemon !== null) {
                // Set the old pokemon randomly on the map
                game.map = summonPokemon(game.map, currentPlayer.pokemon);
            }
            currentPlayer.pokemon = caughtPokemon;

            game.players[currentPlayerIndex] = currentPlayer;

            break;
        case 'skip':
            // end of turn
            currentPlayer.isYourTurn = false;
            currentPlayer.ap = GameConstants.DEFAULT_AP;
            currentPlayer.mp = GameConstants.DEFAULT_MP;

            // TODO mettre dans une fonction ?
            for (let i = currentPlayerIndex + 1; i < 100; i++) {

                if (game.players[i].life > 0) {
                    game.players[i].isYourTurn = true;

                    UserModel.findOne({ _id: game.players[i]._id }).exec()
                        .then(user => {
                            webpush.sendNotification(user.subscription, JSON.stringify({
                                title: 'A TOI DE JOUER BONHOMME' // TODO implement better
                            })).catch(err => {
                                console.error(err.stack);
                            });
                        });

                    // Increment turn
                    if (game.players.map(p => p.life > 0).indexOf(currentPlayer) === game.players.map(p => p.life > 0).length - 1) {
                        game.turnNumber += 1;
                    }

                    break;
                }
                // if we get to the end of the array, reset i to 0 and go on again
                if (i + 1 === game.players.length) {
                    i = 0;
                }
            }
            break;
        default:
            break;
    }
}

if (game.playersAlive === 1) {
    game.status = 'finished';
    // currentPlayer won mais on sait pas qui
}
*/
