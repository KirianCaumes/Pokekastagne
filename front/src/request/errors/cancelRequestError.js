/**
 * Cancel Request Error, thrown when request is cancel
 */
export class CancelRequestError extends Error {
    /**
     * @param {string} description 
     */
    constructor(description) {
        super(description)
        this.name = this.constructor.name
    }
}