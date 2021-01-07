/**
 * User Object
 */
export class User {
    /**
     * @param {object} data 
     * @param {any=} data._id Id of the User 
     * @param {string=} data.email
     * @param {string=} data.username
     * @param {string=} data.password
     * @param {string=} data.skin
     * 
     * @param {string=} data.token
     */
    constructor({
        _id = 0,
        email = undefined,
        username = undefined,
        password = undefined,
        skin = undefined,

        token = undefined
    } = {}) {
        this._id = _id?.$oid ?? _id
        this.email = email
        this.username = username
        this.password = password
        this.skin = skin

        this.token = token
    }
}

/**
 * User Object used to bind error message
 */
export class ErrorUser {
    _id
    email
    username
    password
    skin
}