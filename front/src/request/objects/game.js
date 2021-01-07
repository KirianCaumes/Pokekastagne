import { Obstacle } from "./obstacle"
import { Player } from "./player"
import { Pokemon } from "./pokemon"

/**
 * Game Object
 */
export class Game {
    /**
     * @param {object} data 
     * @param {any=} data._id Id of the Game 
     * @param {any=} data.creatorId
     * @param {string=} data.name
     * @param {string=} data.gameCode
     * @param {any[]=} data.players
     * @param {number=} data.playersAlive
     * @param {number=} data.turnNumber
     * @param {Date=} data.lastActionDate
     * @param {any[]=} data.map
     * @param {('await' | 'running' | 'finished')=} data.status
     * @param {Date=} data.startDate
     * @param {('offline' | 'online')=} data.mode
     */
    constructor({
        _id = 0,
        creatorId = undefined,
        name = undefined,
        gameCode = undefined,
        players = undefined,
        playersAlive = undefined,
        turnNumber = undefined,
        lastActionDate = undefined,
        map = undefined,
        status = undefined,
        startDate = undefined,
        mode = undefined,
    } = {}) {
        this._id = _id?.$oid ?? _id
        this.creatorId = creatorId?.$oid ?? creatorId
        this.name = name
        this.gameCode = gameCode
        this.players = players?.map(player => new Player(player)) ?? []
        this.playersAlive = playersAlive
        this.turnNumber = turnNumber
        this.lastActionDate = lastActionDate ? new Date(lastActionDate) : null
        this.map = map?.map(row =>
            row.map(cell => {
                switch (cell?.type) {
                    case 'obstacle':
                        return new Obstacle()
                    case 'pokemon':
                        return new Pokemon(cell)
                    case 'joueur':
                        return new Player(cell)
                    default:
                        return null
                }
            })
        )
        this.status = status
        this.startDate = startDate ? new Date(startDate) : null
        this.mode = mode
    }
}

/**
 * Game Object used to bind error message
 */
export class ErrorGame { }