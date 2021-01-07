/**
 * Coord Object
 */
export class Coord {
    /**
     * @param {object} data  
     * @param {number=} data.x
     * @param {number=} data.y
     */
    constructor({
        x = undefined,
        y = undefined
    } = {}) {
        this.x = x
        this.y = y
    }
}
