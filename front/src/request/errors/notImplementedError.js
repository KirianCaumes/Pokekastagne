/**
 * Not Implemented Error, thrown when you call a non implemented method
 */
export class NotImplementedError extends Error {
    constructor() {
        super('Not implemented')
        this.name = this.constructor.name
    }
}