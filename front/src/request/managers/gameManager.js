import { Game, ErrorGame } from 'request/objects/game'
import ApiManager from 'request/apiManager'
import { Coord } from 'request/objects/meta/coord'// eslint-disable-line

/**
 * GameManager
 * @extends {ApiManager<Game, ErrorGame>}
 */
export default class GameManager extends ApiManager {
    constructor() {
        super({ type: Game, errorType: ErrorGame, key: 'game' })
    }

    /**
     * @param {'online' | 'offline'} type Type
     * @override
     */
    getById(id, type = 'online') {
        this.key = `game/${type}`
        return super.getById(id)
    }

    /**
     * @param {'online' | 'offline'} type Type
     * @override
     */
    getAll(params = {}, type = 'online') {
        this.key = `game/${type}`
        return super.getAll(params)
    }

    /**
     * @param {'online' | 'offline'} type Type
     * @override
     */
    create(obj = new (this.type)(), type = 'online') {
        this.key = `game/${type}`
        return super.create(obj)
    }

    /**
     * @param {'online' | 'offline'} type Type
     * @override
     */
    updateById(obj = new (this.type)(), id = undefined, type = 'online') {
        this.key = `game/${type}`
        return super.updateById(obj, id)
    }

    /**
     * @param {'online' | 'offline'} type Type
     * @override
     */
    upsert(obj = new (this.type)(), id = undefined, type = 'online') {
        if (id) {
            return this.updateById(obj, id, type)
        } else {
            return this.create(obj, type)
        }
    }

    /**
     * @param {'online' | 'offline'} type Type
     * @override
     */
    removeById(id, type = 'online') {
        this.key = `game/${type}`
        return super.removeById(id)
    }

    /**
     * Authentificate User
     * @param {Coord} data Coord
     * @param {string} id
     * @param {'walk'|'attack'|'catch'|'skip'} action
     * @param {'online' | 'offline'} type Type
     * @returns {Promise<Game>}
     */
    action(data, id, action, type) {
        this.key = `game/${type}`
        const request = this._getRequest({ url: [id, action], method: 'PATCH', data })

        return request.req
            .then(res => {
                return new (this.type)(res.data[this.objectName])
            })
            .catch(err => {
                throw this._handleError(err)
            })
            .finally(() => {
                delete this.cancelTokens[request.cancelTokenId]
            })
    }
}