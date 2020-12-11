/**
 * Release Object
 */
export class Release {
    /**
     * @param {object} data 
     * @param {number=} data.id Id of the Release 
     * @param {string=} data.title
     * @param {number=} data.year
     * @param {string=} data.desc
     * @param {string[]=} data.categories
     */
    constructor({ id = 0, title = undefined, year = undefined, desc = undefined, categories = [] } = {}) {
        this.id = id
        this.title = title
        this.year = year
        this.desc = desc
        this.categories = categories
    }
}

/**
 * Release Object used to bind error message
 */
export class ErrorRelease {
    id
    title
    year
    desc
}