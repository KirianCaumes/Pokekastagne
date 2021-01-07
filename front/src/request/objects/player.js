import { Pokemon } from "./pokemon"
import { User } from "./user"

/**
 * Player Object
 */
export class Player extends User {
    /**
     * @param {object} data  
     * @param {object=} data.pokemon
     * @param {string=} data.life
     * @param {string=} data.isYourTurn
     * @param {string=} data.position
     */
    constructor({
        pokemon = undefined,
        life = undefined,
        isYourTurn = undefined,
        position = undefined,
        ...data
    } = {}) {
        super(data)
        this.pokemon = pokemon ? new Pokemon(pokemon) : null
        this.life = life
        this.isYourTurn = isYourTurn
        this.position = position
    }
}

/**
 * Player Object used to bind error message
 */
export class ErrorPlayer { }