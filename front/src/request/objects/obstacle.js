/**
 * Obstacle Object
 */
export class Obstacle {
    /**
     * @param {object} data  
     * @param {string=} data.type 
     */
    constructor({
        type = 'obstacle'
    } = {}) {
        this.type = type
    }
}

/**
 * Obstacle Object used to bind error message
 */
export class ErrorObstacle { }