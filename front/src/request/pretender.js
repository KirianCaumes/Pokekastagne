import Pretender from 'pretender'
import { Game } from 'request/objects/game'
import { Player } from 'request/objects/player'
// import { Obstacle } from './objects/obstacle'
import { Pokemon } from './objects/pokemon'

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
// const skin = ['biker', 'cameraman', 'clown', 'girl', 'papy']
// const pkmn = ['artikodin', 'bulbizarre', 'charkos', 'lugia', 'makuhita', 'pikachu', 'psykokwak', 'tenefix', 'tiplouf']

const map = [[{ type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
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
[null, null, null, null, null, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }, { type: 'obstacle' }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { type: 'obstacle' }, null, null, null, { type: 'obstacle' }, { type: 'obstacle' }]]

/** @type {Game[]} */
let games = []

const FORCE_ID = 123 //⚠⚠ FORCE ID FOR ALL GAMES IN DEV


server.get('/api/game/offline', (request) => {
    return [200, { "Content-Type": "application/json" }, JSON.stringify({ game: games })]
})

server.get('/api/game/offline/:id', request => {
    let game = games.find(x => x.gameId === (FORCE_ID || request.params?.id))

    if (!game) {
        if (FORCE_ID) {
            const newGame = getNewGame({ gameId: FORCE_ID }) //Test purpose right member
            games = [newGame, ...games]
            game = newGame
        } else {
            return [404, { "Content-Type": "application/json" }, JSON.stringify({ game: {} })]
        }
    }
    return [200, { "Content-Type": "application/json" }, JSON.stringify({ game: game })]
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
    let game = games.find(x => x.gameId === (FORCE_ID || request.params?.id))
    if (game)
        return [200, { "Content-Type": "application/json" }, JSON.stringify({ game: game })]
    else
        return [404, { "Content-Type": "application/json" }, JSON.stringify({ game: {} })]
})

server.delete('/api/game/offline/:id', request => {
    let game = games.find(x => x.gameId === (FORCE_ID || request.params?.id))
    if (game)
        return [200, { "Content-Type": "application/json" }, JSON.stringify({ game: game })]
    else
        return [404, { "Content-Type": "application/json" }, JSON.stringify({ game: {} })]
})

server.patch('/api/game/offline/:id/:action', request => {
    let game = games.find(x => x.gameId === (FORCE_ID || request.params?.id))

    if (!game) {
        if (FORCE_ID) {
            const newGame = getNewGame({ gameId: FORCE_ID })
            games = [newGame, ...games]
            game = newGame
        } else {
            return [404, { "Content-Type": "application/json" }, JSON.stringify({ game: {} })]
        }
    }

    const body = JSON.parse(request.requestBody)

    const currentPlayerPos = (() => {
        for (const [y, row] of game.map.entries()) {
            for (const [x, cell] of row.entries()) {
                if (cell?.type === 'player' && /** @type {Player} */(cell)?.isYourTurn)
                    return { x, y }
            }
        }
        throw new Error('Player current not found')
    })()
    const currentPlayer = new Player({ ...game.map[currentPlayerPos.y][currentPlayerPos.x] })
    const currentPlayerIndex = game.players.findIndex(x => x.username === currentPlayer.username) //Based on uniq username for test

    const nextPosition = (() => {
        const _getNextPos = (pos = currentPlayer.position) => pos < game.players.length ? pos + 1 : 1
        let nextPos = _getNextPos()
        while (game.players.find(x => x.position === nextPos)?.life <= 0) { // eslint-disable-line
            nextPos = _getNextPos(nextPos > game.players.length ? 1 : nextPos)
        }
        return nextPos
    })()

    const nextPlayer = game.players.find(x => x.position === nextPosition)
    const nextPlayerIndex = game.players.findIndex(x => x.position === nextPosition)
    const nextPlayerPos = (() => {
        for (const [y, row] of game.map.entries()) {
            for (const [x, cell] of row.entries()) {
                if (cell?.type === 'player' && /** @type {Player} */(cell)?.username === nextPlayer.username)
                    return { x, y }
            }
        }
        throw new Error('Player next not found')
    })()

    switch (request.params?.action) {
        case 'walk':
            //Check if pkmn
            if (game.map[body.y][body.x]?.type === null) //Not an empty cell
                break

            currentPlayer.mp -= Math.abs(body.x - currentPlayerPos.x) + Math.abs(body.y - currentPlayerPos.y)

            if (currentPlayer.mp < 0) //Not enough mp
                break

            //Clear current player cell
            game.map[currentPlayerPos.y][currentPlayerPos.x] = null

            //Update new player
            game.map[body.y][body.x] = currentPlayer
            game.players[currentPlayerIndex] = currentPlayer
            break
        case 'attack':
            if (currentPlayer.ap <= 0) //No ap
                break

            if (!currentPlayer.pokemon) //No pkmn
                break

            //Update hp of attacked enemy
            currentPlayer.ap -= 1

            //Get target player
            const targetPlayer = /** @type {Player} */(game.map[body.y][body.x])
            const targetPlayerIndex = game.players.findIndex(x => x.username === targetPlayer.username) //Based on uniq username for test

            //Update target player
            targetPlayer.life -= currentPlayer.pokemon?.attack

            if (targetPlayer.life <= 0)
                game.playersAlive -= 1

            //Update target player
            game.map[body.y][body.x] = targetPlayer.life > 0 ? targetPlayer : null
            game.players[targetPlayerIndex] = targetPlayer

            //Update current player
            game.map[currentPlayerPos.y][currentPlayerPos.x] = currentPlayer
            game.players[currentPlayerIndex] = currentPlayer
            break
        case 'catch':
            //Check if pkmn
            if (game.map[body.y][body.x]?.type !== 'pokemon') //Not a pokemon
                break

            currentPlayer.mp -= Math.abs(body.x - currentPlayerPos.x) + Math.abs(body.y - currentPlayerPos.y)

            if (currentPlayer.mp < 0) //Not enough mp
                break

            //If has pkmn, put in randomly on map
            if (!!currentPlayer.pokemon) {
                let y = -1
                let x = -1
                while (y < 0 || x < 0 || !game.map[y] || game.map[y][x] !== null) {
                    y = Math.floor(Math.random() * (game.map?.length - 0 + 1) + 0)
                    x = Math.floor(Math.random() * (game.map?.[0]?.length - 0 + 1) + 0)
                }
                game.map[y][x] = currentPlayer.pokemon
            }

            //Clear current player cell
            game.map[currentPlayerPos.y][currentPlayerPos.x] = null

            //Update new player
            currentPlayer.pokemon = /** @type {Pokemon} */(game.map[body.y][body.x])
            game.map[body.y][body.x] = currentPlayer
            game.players[currentPlayerIndex] = currentPlayer
            break
        case 'skip':
            //Update player
            currentPlayer.isYourTurn = false
            currentPlayer.ap = 1
            currentPlayer.mp = 3

            //Update new player
            game.map[currentPlayerPos.y][currentPlayerPos.x] = currentPlayer
            game.players[currentPlayerIndex] = currentPlayer

            //Set next player turn is done
            nextPlayer.isYourTurn = true

            //Update pos new player
            game.map[nextPlayerPos.y][nextPlayerPos.x] = nextPlayer
            game.players[nextPlayerIndex] = nextPlayer

            if (nextPosition === 1)
                game.turnNumber += 1
            break
        default:
            break
    }
    // console.log(games, games.findIndex(x => x.gameId === game.gameId))
    games[games.findIndex(x => x.gameId === game.gameId)] = game

    return [200, { "Content-Type": "application/json" }, JSON.stringify({ game })]
})


const getNewGame = ({ name = "MyName", gameId = undefined } = {}) => {
    const myId = (new Date().getUTCMilliseconds() / 2).toString()

    const player1 = new Player({ _id: myId, username: 'Biker', isYourTurn: true, position: 1, skin: 'biker', mp: 3, ap: 1, life: 10 })
    const player2 = new Player({ _id: myId, username: 'Cameraman', isYourTurn: false, position: 2, skin: 'cameraman', mp: 3, ap: 1, life: 10 })
    const player3 = new Player({ _id: myId, username: 'Clown', isYourTurn: false, position: 3, skin: 'clown', mp: 3, ap: 1, life: 10 })
    const player4 = new Player({ _id: myId, username: 'Girl', isYourTurn: false, position: 4, skin: 'girl', mp: 3, ap: 1, life: 10 })
    const player5 = new Player({ _id: myId, username: 'Papy', isYourTurn: false, position: 5, skin: 'papy', mp: 3, ap: 1, life: 10 })

    const pokemon1 = new Pokemon({ _id: 1, name: { en: 'Artikodin', fr: 'Artikodin' }, attack: 100, skin: 'artikodin' })
    const pokemon2 = new Pokemon({ _id: 2, name: { en: 'Bulbizarre', fr: 'Bulbizarre' }, attack: 1, skin: 'bulbizarre' })
    const pokemon3 = new Pokemon({ _id: 3, name: { en: 'Charkos', fr: 'Charkos' }, attack: 4, skin: 'charkos' })
    const pokemon4 = new Pokemon({ _id: 4, name: { en: 'Lugia', fr: 'Lugia' }, attack: 5, skin: 'lugia' })
    const pokemon5 = new Pokemon({ _id: 5, name: { en: 'Makuhita', fr: 'Makuhita' }, attack: 2, skin: 'makuhita' })

    const customMap = [...map]

    player1.pokemon = pokemon1

    customMap[2][0] = player1
    customMap[3][0] = player2
    customMap[2][1] = player3
    customMap[2][2] = player4
    customMap[2][3] = player5

    customMap[0][7] = pokemon1
    customMap[4][7] = pokemon2
    customMap[13][9] = pokemon3
    customMap[14][13] = pokemon4
    customMap[17][14] = pokemon5

    return new Game({
        _id: new Date().getUTCMilliseconds(),
        gameId: gameId ?? new Date().getUTCMilliseconds().toString(),
        creatorId: myId,
        name,
        startDate: new Date(),
        map: customMap,
        players: [
            player1,
            player2,
            player3,
            player4,
            player5,
        ],
        playersAlive: 5,
        turnNumber: 0,
        lastActionDate: null,
        status: 'running',
        mode: 'offline',
        pngImg: 1,
    })
}