import Pretender from 'pretender'
import { Game } from 'request/objects/game'
import { Player } from 'request/objects/player'

const server = new Pretender()

/**
 * Passthrough
 */
server.post('/api/user/login', server.passthrough)
server.post('/api/user', server.passthrough)
server.get('/api/user/me', server.passthrough)

server.get('/api/game/online', server.passthrough)
server.get('/api/game/online/:id', server.passthrough)
server.post('/api/game/online', server.passthrough)
server.put('/api/game/online/:id', server.passthrough)
server.delete('/api/game/online/:id', server.passthrough)
server.patch('/api/game/online/:id/:action', server.passthrough)

/**
 * Game offline
 */
const skin = ['biker', 'cameraman', 'clown', 'girl', 'papy']
const pkmn = ['artikodin', 'bulbizarre', 'charkos', 'lugia', 'makuhita', 'pikachu', 'psykokwak', 'tenefix', 'tiplouf']

const map = [[{ type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'pokemon', name: { en: 'Pikachu', fr: 'Pikachu' }, skin: pkmn[Math.floor(Math.random() * pkmn.length)] }, { type: 'player', username: 'Toto', skin: skin[Math.floor(Math.random() * skin.length)] }, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[{ type: 'obstacle' }, null, null, { type: 'obstacle' }, null, null, { type: 'obstacle' }, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null],
[null, null, null, null, null, { type: 'obstacle' }, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null],
[null, { type: 'obstacle' }, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, { type: 'obstacle' }, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[{ type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, { type: 'obstacle' }, null, null, null, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, null],
[{ type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[{ type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, { type: 'obstacle' }, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[{ type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, { type: 'obstacle' }, null, null, null, null, { type: 'obstacle' }, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, { type: 'obstacle' }, null, null, { type: 'obstacle' }, null, null, { type: 'obstacle' }, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null],
[null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, { type: 'obstacle' }, { type: 'obstacle' }, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, { type: 'obstacle' }, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[{ type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, { type: 'obstacle' }, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[{ type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, { type: 'obstacle' }, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, { type: 'obstacle' }, null, { type: 'obstacle' }, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }],
[null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, { type: 'obstacle' }, { type: 'obstacle' }, null, null, { type: 'obstacle' }, { type: 'obstacle' }],
[null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, { type: 'obstacle' }, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }],
[null, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, { type: 'obstacle' }, { type: 'obstacle' }, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }],
[null, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { type: 'obstacle' }, null, null, { type: 'player' }, { type: 'obstacle' }, { type: 'obstacle' }]]

/** @type {Game[]} */
let games = []

server.get('/api/game/offline', (request) => {
    return [200, { "Content-Type": "application/json" }, JSON.stringify({ game: games })]
})

server.get('/api/game/offline/:id', request => {
    // const game = games.find(x => x.gameId)
    // if (game)
    //     return [200, { "Content-Type": "application/json" }, JSON.stringify({ game: game })]
    // else
    //     return [404, { "Content-Type": "application/json" }, JSON.stringify({ game: {} })]

    return [200, { "Content-Type": "application/json" }, JSON.stringify({
        game: new Game({
            _id: new Date().getUTCMilliseconds(),
            gameId: new Date().getUTCMilliseconds().toString(),
            startDate: new Date(),
            map: [...map],
            players: [
                new Player(),
                new Player(),
                new Player(),
                new Player(),
                new Player()
            ],
            playersAlive: 5
        })
    })]
})

server.post('/api/game/offline', request => {
    const game = {
        ...JSON.parse(request.requestBody),
        _id: new Date().getUTCMilliseconds(),
        gameId: new Date().getUTCMilliseconds(),
        startDate: new Date(),
        map: [...map],
        players: [
            new Player(),
            new Player(),
            new Player(),
            new Player(),
            new Player()
        ],
        playersAlive: 5
    }
    games = [game, ...games]
    return [200, { "Content-Type": "application/json" }, JSON.stringify({ game })]
})

server.put('/api/game/offline/:id', request => {
    const game = games.find(x => x.gameId)
    if (game)
        return [200, { "Content-Type": "application/json" }, JSON.stringify({ game: game })]
    else
        return [404, { "Content-Type": "application/json" }, JSON.stringify({ game: {} })]
})

server.delete('/api/game/offline/:id', request => {
    const game = games.find(x => x.gameId)
    if (game)
        return [200, { "Content-Type": "application/json" }, JSON.stringify({ game: game })]
    else
        return [404, { "Content-Type": "application/json" }, JSON.stringify({ game: {} })]
})

server.patch('/api/game/offline/:id/:action', request => {
    const game = games.find(x => x.gameId)
    if (game)
        return [200, { "Content-Type": "application/json" }, JSON.stringify({ game: game })]
    else
        return [404, { "Content-Type": "application/json" }, JSON.stringify({ game: {} })]
})