import { Pokemon } from "./pokemon"
import { User } from "./user"

/**
 * Player Object
 * @extends {User}
 */
export class Player extends User {
    /**
     * @param {object} data  
     * @param {any=} data._id Id of the User 
     * @param {string=} data.email
     * @param {string=} data.username
     * @param {string=} data.password
     * @param {string=} data.skin
     * @param {string=} data.token
     * 
     * @param {string=} data.type 
     * @param {object=} data.pokemon
     * @param {string=} data.life
     * @param {boolean=} data.isYourTurn
     * @param {number=} data.position
     */
    constructor({
        _id = 0,
        email = undefined,
        username = undefined,
        password = undefined,
        skin = undefined,
        token = undefined,

        type = 'player',
        pokemon = undefined,
        life = undefined,
        isYourTurn = undefined,
        position = undefined,
    } = {}) {
        super({ _id, email, username, password, skin, token })

        this.type = type
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