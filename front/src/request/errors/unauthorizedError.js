/**
 * Unauthorized Error when 401
 */
export class UnauthorizedError extends Error {
    /**
     * @param {string} description 
     */
    constructor(description) {
        super(description)
        this.name = this.constructor.name
    }
}