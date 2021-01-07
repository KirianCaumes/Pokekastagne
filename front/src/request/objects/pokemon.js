/**
 * Pokemon Object
 */
export class Pokemon {
    /**
     * @param {object} data  
     * @param {any=} data._id 
     * @param {any=} data.name
     * @param {number=} data.attack
     */
    constructor({
        _id = 0,
        name = undefined,
        attack = undefined,
    } = {}) {
        this._id = _id?.$oid ?? _id
        this.name = {
            en: name?.en,
            fr: name?.fr
        }
        this.attack = attack
    }
}

/**
 * Pokemon Object used to bind error message
 */
export class ErrorPokemon { }