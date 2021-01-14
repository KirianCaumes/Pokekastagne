/**
 * Pokemon Object
 */
export class Pokemon {
    /**
     * @param {object} data
     * @param {string=} data.type   
     * @param {any=} data._id 
     * @param {any=} data.name
     * @param {number=} data.attack
     * @param {string=} data.skin
     */
    constructor({
        _id = 0,
        type = 'pokemon',
        name = undefined,
        attack = undefined,
        skin = undefined
    } = {}) {
        this._id = _id?.$oid ?? _id
        this.type = type
        this.name = {
            en: name?.en,
            fr: name?.fr
        }
        this.attack = attack
        this.skin = skin
    }
}

/**
 * Pokemon Object used to bind error message
 */
export class ErrorPokemon { }