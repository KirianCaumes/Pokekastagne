import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AppProps } from 'app'// eslint-disable-line
import useLang from 'helpers/hooks/useLang'
import { Status } from 'static/status'
import { Game } from 'request/objects/game'
import { CancelRequestError } from 'request/errors/cancelRequestError'
import { UnauthorizedError } from 'request/errors/unauthorizedError'
import { InvalidEntityError } from 'request/errors/invalidEntityError'
import { NotImplementedError } from 'request/errors/notImplementedError'
import { NotFoundError } from 'request/errors/notFoundError'
import ImageMapper from 'react-image-mapper';
import { Pokemon } from 'request/objects/pokemon'
import { Obstacle } from 'request/objects/obstacle'
import { Player } from 'request/objects/player'
import onClickOutside from "react-onclickoutside"
import { Coord } from 'request/objects/meta/coord'// eslint-disable-line
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackward, faForward, faHeart, faPaw, faShoePrints, faStar, faSync } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { history } from 'helpers/history'
import useDefaultLang from 'helpers/hooks/useDefaultLang'
import { Link } from 'react-router-dom'

/**
 * @typedef {object} ModalInfos 
 * @property {boolean} isDisplayed
 * @property {number=} x
 * @property {number=} y
 * @property {Obstacle | Pokemon | Player | object=} cell
 */

/**
 * @param {AppProps} props
 */
export default function IdGame({ gameManager, match, me }) {
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = useState(Status.IDLE)
    /** @type {[boolean, function(boolean):any]} Is offline */
    const [isOffline] = useState(match.params?.gametype === 'singleplayer')
    /** @type {[Game, function(Game):any]} Game */
    const [game, setGame] = useState(new Game())
    /** @type {[ModalInfos, function(ModalInfos):any]} Modal infos */
    const [modalInfos, setModalInfos] = useState({ isDisplayed: !!false })

    const type = useMemo(() => isOffline ? 'offline' : 'online', [isOffline])
    const size = useMemo(() => 38, [])
    const border = useMemo(() => 2, [])
    const imgSize = useMemo(() => ({ width: 1600, height: 800 }), [])
    const lang = useLang()
    const defaultLang = useDefaultLang()

    const currentPlayer = useMemo(() => game.players?.find(player => player.isYourTurn), [game])
    const mePlayer = useMemo(() => {
        if (isOffline)
            return game.players?.find(player => player.isYourTurn)
        else
            return game.players?.find(player => me._id === player?._id)
    }, [game, isOffline, me])
    const isYourTurn = useMemo(
        () => isOffline ? true : currentPlayer?._id === mePlayer?._id,
        [isOffline, currentPlayer, mePlayer]
    )
    const mePlayerPos = useMemo(() => {
        if (!game?.map)
            return { x: 0, y: 0 }
        for (const [y, row] of game?.map?.entries()) {
            for (const [x, cell] of row?.entries()) {
                if (isOffline) {
                    if (cell?.type === 'player' && /** @type {Player} */(cell)?.isYourTurn)
                        return { x, y }
                } else {
                    if (cell?.type === 'player' && me._id === /** @type {Player} */(cell)?._id)
                        return { x, y }
                }
            }
        }
        return { x: 0, y: 0 }
    }, [game, isOffline, me])
    const nextPlayer = useMemo(
        () => game.players?.find(x => x.position === (() => {
            const _getNextPos = (pos = currentPlayer?.position) => pos < game.players.length ? pos + 1 : 1
            let nextPos = _getNextPos()
            while (game.players.find(x => x.position === nextPos)?.life <= 0) { // eslint-disable-line
                nextPos = _getNextPos(nextPos > game.players.length ? 1 : nextPos)
            }
            return nextPos
        })()),
        [game, currentPlayer]
    )

    const getGame = useCallback(
        async () => {
            setStatus(Status.PENDING)
            try {
                const game = await gameManager.getById(match.params.id, type)
                setGame(game)
                setStatus(Status.RESOLVED)
            } catch (error) {
                switch (error?.constructor) {
                    case CancelRequestError: break
                    case UnauthorizedError:
                    case InvalidEntityError:
                        setStatus(Status.REJECTED)
                        console.error(error)
                        break
                    case NotFoundError:
                        console.log(error)
                        history.goBack()
                        break
                    case NotImplementedError:
                    default:
                        setStatus(Status.REJECTED)
                        console.error(error)
                        break
                }
            }
        },
        [gameManager, type, match]
    )

    const areas = useMemo(() =>
        game.map?.map((row, y) =>
            row?.map((cell, x) =>
            ({
                name: `[${x},${y}]`,
                shape: "rect",
                coords: (() => {
                    return [
                        x * size + ((x + 1) * border),
                        y * size + ((y + 1) * border),
                        (x + 1) * size + ((x) * border),
                        (y + 1) * size + ((y) * border),
                    ]
                })(),
                fillColor: (() => {
                    switch (cell?.constructor) {
                        case Pokemon:
                            return "rgb(31,58,147,0.4)"
                        case Obstacle:
                            return "rgba(207,0,15,0.4)"
                        case Player:
                            return "rgba(233,212,96,0.4)"
                        default:
                            return Math.abs(x - mePlayerPos?.x) + Math.abs(y - mePlayerPos?.y) <= mePlayer?.mp ? 'rgba(255,255,255,0.4)' : 'rgba(207,0,15,0.8)'
                    }
                })(),
                props: {
                    coord: {
                        x, y
                    },
                    cell: JSON.parse(JSON.stringify(cell))
                }
            })
            ))?.flat() ?? []
        ,
        [game, border, size, mePlayerPos?.x, mePlayerPos?.y, mePlayer?.mp]
    )

    useEffect(() => {
        (async () => getGame())()
    }, [getGame])

    useEffect(() => {
        console.log(game)
    }, [game])

    return (
        <main
            className="app-page-game-id"
        >
            <div
                className="img-container"
                style={{ width: imgSize.width, height: imgSize.height, pointerEvents: status === Status.PENDING ? 'none' : undefined }}
            >
                <ImageMapper
                    src={require(`assets/img/maps/${game.pngImg ?? 1}.png`).default}
                    width={imgSize.width}
                    height={imgSize.height}
                    map={{
                        name: "my-map",
                        areas
                    }}
                    onClick={area => {
                        if (modalInfos?.x === area?.props?.coord?.x && modalInfos?.y === area?.props?.coord?.y)
                            setModalInfos({ isDisplayed: false })
                        else
                            switch (area?.props?.cell?.type) {
                                case 'pokemon':
                                    return setModalInfos({ isDisplayed: true, x: area?.props?.coord?.x, y: area?.props?.coord?.y, cell: new Pokemon(area?.props?.cell) })
                                case 'obstacle':
                                    return setModalInfos({ isDisplayed: false, cell: new Obstacle(area?.props?.cell) })
                                case 'player':
                                    return setModalInfos({ isDisplayed: true, x: area?.props?.coord?.x, y: area?.props?.coord?.y, cell: new Player(area?.props?.cell) })
                                default:
                                    return setModalInfos({ isDisplayed: true, x: area?.props?.coord?.x, y: area?.props?.coord?.y })
                            }
                    }}
                />
                {game.map?.map((row, y) =>
                    row?.map((cell, x) => {
                        if (Pokemon === cell?.constructor || Player === cell?.constructor)
                            return (
                                <img
                                    key={`[${x},${y}]`}
                                    src={(() => {
                                        switch (cell?.constructor) {
                                            case Pokemon:
                                                return require(`assets/img/pkmns/${cell.skin ?? 'lugia'}.png`).default
                                            case Player:
                                                return require(`assets/img/players/${cell.skin ?? 'papy'}.png`).default
                                            default:
                                                return null
                                        }
                                    })()}
                                    className="img-item"
                                    alt="item"
                                    style={{
                                        left: x * size + ((x + 1) * border),
                                        top: y * size + ((y + 1) * border)
                                    }}
                                />
                            )
                        return null
                    })
                )}
                <ModalInfos
                    isDisplayed={modalInfos.isDisplayed}
                    x={modalInfos.x}
                    y={modalInfos.y}
                    cell={modalInfos.cell}
                    size={size}
                    border={border}
                    status={status}

                    isYourTurn={isYourTurn}
                    isCloseEnough={[0, 1].includes(Math.abs(modalInfos.x - mePlayerPos?.x)) && [0, 1].includes(Math.abs(modalInfos.y - mePlayerPos?.y))}
                    isMe={modalInfos.x === mePlayerPos?.x && modalInfos.y === mePlayerPos?.y}
                    isAtRange={Math.abs(modalInfos?.x - mePlayerPos?.x) + Math.abs(modalInfos?.y - mePlayerPos?.y) <= mePlayer?.mp}
                    isEnoughAp={mePlayer?.ap > 0}
                    hasPkmn={!!mePlayer?.pokemon}

                    onHide={() => setModalInfos({ isDisplayed: false })}
                    onAction={
                        /**
                         * @param {Coord} data 
                         * @param {'walk' | 'attack' | 'catch' | 'skip'} action 
                         */
                        async (data, action) => {
                            setStatus(Status.PENDING)
                            try {
                                const game = await gameManager.action(data, match.params.id, action, type)
                                setGame(game)
                                setStatus(Status.RESOLVED)
                            } catch (error) {
                                switch (error?.constructor) {
                                    case CancelRequestError: break
                                    case UnauthorizedError:
                                    case InvalidEntityError:
                                        setStatus(Status.REJECTED)
                                        console.error(error)
                                        break
                                    case NotFoundError:
                                        console.log(error)
                                        // history.goBack()
                                        break
                                    case NotImplementedError:
                                    default:
                                        setStatus(Status.REJECTED)
                                        console.error(error)
                                        break
                                }
                            }
                        }}
                />
                {/* Awaiting screen */}
                {game?.status === 'await' &&
                    <div className="wait-screen">
                        <div>
                            <p>{lang('waiting')}</p>
                            <p>{game.players?.length}/5</p>
                            <p>{lang('roomCode')}</p>
                            <p>{game?.gameId}</p>
                        </div>
                    </div>
                }
                {/* Winning screen */}
                {game?.status === 'finished' && mePlayer?._id === game.players.find(player => player?.life > 0)?._id &&
                    <div className="win-screen">
                        <p className="top1">#1</p>
                        <p className="victory">{lang('victory')}</p>
                        <p className="royale">{lang('royale')}</p>
                    </div>
                }
                {/* Losing screen */}
                {mePlayer?.life < 0 &&
                    <div className="lose-screen">
                        <div>
                            <p className="defeat">{lang('defeat')}</p>
                            <Link
                                className="button is-orange"
                                to={isOffline ? '/singleplayer' : '/multiplayer'}
                            >
                                <span>{lang('backToMenu')}</span>
                                <span className="icon is-small">
                                    <FontAwesomeIcon icon={faBackward} />
                                </span>
                            </Link>
                        </div>

                    </div>
                }
            </div>
            <div
                style={{ width: imgSize.width }}
                className="info-bar"
            >
                <div
                    className="buttons"
                >
                    <Link
                        className="button is-blue"
                        to={isOffline ? '/singleplayer' : '/multiplayer'}
                    >
                        <span>{lang('backToMenu')}</span>
                        <span className="icon is-small">
                            <FontAwesomeIcon icon={faBackward} />
                        </span>
                    </Link>
                    <button
                        className={classnames("button is-orange", { 'is-loading': status === Status.PENDING })}
                        disabled={(isOffline ? false : currentPlayer?._id !== mePlayer?._id) || game?.status !== 'running'}
                        onClick={async () => {
                            setStatus(Status.PENDING)
                            try {
                                const game = await gameManager.action(null, match.params.id, 'skip', type)
                                setGame(game)
                                setStatus(Status.RESOLVED)
                            } catch (error) {
                                switch (error?.constructor) {
                                    case CancelRequestError: break
                                    case UnauthorizedError:
                                    case InvalidEntityError:
                                        setStatus(Status.REJECTED)
                                        console.error(error)
                                        break
                                    case NotFoundError:
                                        console.log(error)
                                        // history.goBack()
                                        break
                                    case NotImplementedError:
                                    default:
                                        setStatus(Status.REJECTED)
                                        console.error(error)
                                        break
                                }
                            }
                        }}
                    >
                        <span>{lang('endOfTurn')}</span>
                        <span className="icon is-small">
                            <FontAwesomeIcon icon={faForward} />
                        </span>
                    </button>
                    <button
                        className={classnames("button is-info", { 'is-loading': status === Status.PENDING })}
                        onClick={() => getGame()}
                        disabled={game?.status === 'finished'}
                    >
                        <span>{lang('refresh')}</span>
                        <span className="icon is-small">
                            <FontAwesomeIcon icon={faSync} />
                        </span>
                    </button>
                </div>
                <div>
                    <FontAwesomeIcon color="#FA0701" icon={faHeart}/>&nbsp;
                    <p><b>{lang('hp')}</b>: {mePlayer?.life ?? 0}</p>&nbsp;&nbsp;
                    <FontAwesomeIcon color="#FAC601" icon={faStar}/>&nbsp;
                    <p><b>{lang('ap')}</b>: {mePlayer?.ap ?? 0}</p>&nbsp;&nbsp;
                    <FontAwesomeIcon color="#0AC429" icon={faShoePrints}/>&nbsp;
                    <p><b>{lang('mp')}</b>: {mePlayer?.mp ?? 0}</p>&nbsp;&nbsp;
                    <FontAwesomeIcon color="#000000"icon={faPaw}/>&nbsp;
                    <p><b>{lang('pokemon')}</b>: {mePlayer?.pokemon?.name?.[defaultLang ?? 'en']?.toString() ?? <i>{lang('none')}</i>}</p>
                </div>
                <div>
                    <p><b>{lang('turn')}</b>: {currentPlayer?.username}</p>&nbsp;/&nbsp;
                    <p><b>{lang('nextPlayer')}</b>: {nextPlayer?.username}</p>
                </div>
                <p><b>{lang('turnNumber')}</b>: {game.turnNumber ?? ''}</p>
            </div>
        </main>
    )
}

/**
 * @param {object} props 
 * @param {boolean} props.isDisplayed
 * @param {number} props.x
 * @param {number} props.y
 * @param {Pokemon | Obstacle | Player} props.cell
 * @param {number} props.size
 * @param {number} props.border
 * @param {function} props.onHide
 * @param {function(Coord, 'walk' | 'attack' | 'catch' | 'skip'):any} props.onAction
 * @param {Status} props.status
 * @param {boolean} props.isCloseEnough
 * @param {boolean} props.isYourTurn
 * @param {boolean} props.isMe
 * @param {boolean} props.isAtRange
 * @param {boolean} props.isEnoughAp
 * @param {boolean} props.hasPkmn
 */
function _ModalInfos({ isDisplayed = false, x = 0, y = 0, cell, size, border, onHide = () => null, onAction = () => null, status, isCloseEnough = false, isYourTurn = false, isMe = false, isAtRange = false, isEnoughAp = false, hasPkmn = false }) {
    // @ts-ignore
    _ModalInfos.handleClickOutside = () => {
        setIsShowInfo(false)
        onHide()
    }

    /** @type {[boolean, function(boolean):any]} Show info */
    const [isShowInfo, setIsShowInfo] = useState(!!false)
    const lang = useLang()
    const defaultLang = useDefaultLang()

    if (!isDisplayed)
        return <></>

    return (
        <div
            className="card"
            style={{
                left: (() => {
                    const val = (x - 1.9) * size + ((x + 1) * border)
                    if (val >= 1420)
                        return 1420
                    else if (val <= 0)
                        return (x) * size + ((x + 1) * border)
                    else
                        return val
                })(),
                top: (() => {
                    const val = (y - 2.2) * size + ((y + 1) * border)
                    return val > 0 ? val : (y + 1) * size + ((y + 1) * border)
                })()
            }}
        >
            <div
                className="card-content"
            >
                <p>
                    {(() => {
                        switch (cell?.constructor) {
                            case Pokemon:
                                return /** @type {Pokemon} **/(cell)?.name?.[defaultLang ?? 'en'] ?? <i>{lang('pkmn')}</i>
                            case Obstacle:
                                return null
                            case Player:
                                return /** @type {Player} **/(cell)?.username ?? <i>{lang('user')}</i>
                            default:
                                return <>{lang('moveHere')}</>
                        }
                    })()}
                </p>
                {
                    isShowInfo ?
                        <>{(() => {
                            switch (cell?.constructor) {
                                case Pokemon:
                                    return <p>
                                        <b>{lang('attack')}</b>: {/** @type {Pokemon} */(cell)?.attack}
                                    </p>
                                case Player:
                                    return <p>
                                        <b>{lang('hp')}</b>: {/** @type {Player} */(cell)?.life}<br />
                                        <b>{lang('pokemon')}</b>: {/** @type {Player} */(cell)?.pokemon?.name?.[defaultLang ?? 'en'] ?? <i>{lang('none')}</i>}
                                    </p>
                                default:
                                    return <></>
                            }
                        })()}</>
                        :
                        <div className="buttons">
                            {(() => {
                                switch (cell?.constructor) {
                                    case Pokemon:
                                        return <>
                                            <button
                                                type="button"
                                                className={classnames("button is-link", { 'is-loading': status === Status.PENDING })}
                                                onClick={() => setIsShowInfo(true)}
                                            >
                                                {lang('infos')}
                                            </button>
                                            <button
                                                type="button"
                                                className={classnames("button is-danger", { 'is-loading': status === Status.PENDING })}
                                                disabled={!isYourTurn || !isCloseEnough || !isAtRange}
                                                onClick={async () => {
                                                    await onAction({ x, y }, 'catch')
                                                    onHide()
                                                }}
                                            >
                                                {lang('catch')}
                                            </button>
                                        </>
                                    case Obstacle:
                                        return null
                                    case Player:
                                        return <>
                                            <button
                                                type="button"
                                                className={classnames("button is-link", { 'is-loading': status === Status.PENDING })}
                                                onClick={() => setIsShowInfo(true)}
                                            >
                                                {lang('infos')}
                                            </button>
                                            <button
                                                type="button"
                                                className={classnames("button is-danger", { 'is-loading': status === Status.PENDING })}
                                                disabled={!isYourTurn || !isCloseEnough || isMe || !isEnoughAp || !hasPkmn}
                                                onClick={async () => {
                                                    await onAction({ x, y }, 'attack')
                                                    onHide()
                                                }}
                                            >
                                                {lang('attack')}
                                            </button>
                                        </>
                                    default:
                                        return <>
                                            <button
                                                type="button"
                                                className={classnames("button is-link", { 'is-loading': status === Status.PENDING })}
                                                disabled={!isYourTurn || !isAtRange}
                                                onClick={async () => {
                                                    await onAction({ x, y }, 'walk')
                                                    onHide()
                                                }}
                                            >
                                                {lang('yes')}
                                            </button>
                                        </>
                                }
                            })()}
                        </div>
                }
            </div>
        </div>
    )
}

const ModalInfos = onClickOutside(_ModalInfos, {
    // @ts-ignore
    handleClickOutside: () => _ModalInfos.handleClickOutside
})
