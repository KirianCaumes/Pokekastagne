/**
 * NotFound Error when 404
 */
export class NotFoundError extends Error {
    /**
     * @param {string} description 
     */
    constructor(description) {
        super(description)
        this.name = this.constructor.name
    }
}