import Pretender from 'pretender'
import { Game } from './objects/game'

/** @type {Game[]} */
let games = []

new Pretender(function () {
    this.post('/api/user/login', this.passthrough)
    this.post('/api/user', this.passthrough)
    this.get('/api/user/me', this.passthrough)

    this.get('/api/game/online', this.passthrough)
    this.get('/api/game/offline', request => {
        return [200, { "Content-Type": "application/json" }, JSON.stringify({ game: games })]
    })

    this.get('/api/game/online/:id', this.passthrough)
    this.get('/api/game/offline/:id', request => {
        const game = games.find(x => x._id)
        if (game)
            return [200, { "Content-Type": "application/json" }, JSON.stringify({ game: games })]
        else
            return [404, { "Content-Type": "application/json" }, JSON.stringify({ game: {} })]
    })

    this.post('/api/game/online', this.passthrough)
    this.post('/api/game/offline', request => {
        const game = new Game({ ...JSON.parse(request.requestBody), _id: new Date().getUTCMilliseconds() })
        games = [game, ...games]
        return [200, { "Content-Type": "application/json" }, JSON.stringify({ game })]
    })

    this.put('/api/game/online/:id', this.passthrough)
    this.put('/api/game/offline/:id', request => {
        const game = games.find(x => x._id)
        if (game)
            return [200, { "Content-Type": "application/json" }, JSON.stringify({ game: games })]
        else
            return [404, { "Content-Type": "application/json" }, JSON.stringify({ game: {} })]
    })

    this.delete('/api/game/online/:id', this.passthrough)
    this.delete('/api/game/offline/:id', request => {
        const game = games.find(x => x._id)
        if (game)
            return [200, { "Content-Type": "application/json" }, JSON.stringify({ game: games })]
        else
            return [404, { "Content-Type": "application/json" }, JSON.stringify({ game: {} })]
    })

    this.patch('/api/game/online/:id/:action', this.passthrough)
    this.patch('/api/game/offline/:id/:action', request => {
        const game = games.find(x => x._id)
        if (game)
            return [200, { "Content-Type": "application/json" }, JSON.stringify({ game: games })]
        else
            return [404, { "Content-Type": "application/json" }, JSON.stringify({ game: {} })]
    })
})