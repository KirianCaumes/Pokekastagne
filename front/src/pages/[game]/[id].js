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
import { faForward, faSync } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'

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

    const currentPlayer = useMemo(() => game.players?.find(player => player.isYourTurn), [game])
    const nextPlayer = useMemo(() => game.players?.find(x => x.position === (currentPlayer?.position < game.players?.length ? currentPlayer?.position + 1 : 1)), [game, currentPlayer])

    const lang = useLang()

    const getGame = useCallback(async () => {
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
                // case NotFoundError:
                //     console.log(error)
                //     history.goBack()
                //     break
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

    useEffect(() => {
        (async () => getGame())()
    }, [getGame])

    useEffect(() => {
        console.log(game)
    }, [game])

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
                            return 'rgba(255,255,255,0.4)'
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
        [game, border, size]
    )

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
                                    // case NotFoundError:
                                    //     console.log(error)
                                    //     history.goBack()
                                    //     break
                                    case NotImplementedError:
                                    default:
                                        setStatus(Status.REJECTED)
                                        console.error(error)
                                        break
                                }
                            }
                        }}
                />
            </div>
            <div
                style={{ width: imgSize.width }}
                className="info-bar"
            >
                <div
                    className="buttons"
                >
                    <button
                        className={classnames("button is-orange", { 'is-loading': status === Status.PENDING })}
                        disabled={isOffline ? false : me._id !== currentPlayer?._id}
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
                                    // case NotFoundError:
                                    //     console.log(error)
                                    //     history.goBack()
                                    //     break
                                    case NotImplementedError:
                                    default:
                                        setStatus(Status.REJECTED)
                                        console.error(error)
                                        break
                                }
                            }
                        }}
                    >
                        <span>End of turn</span>
                        <span className="icon is-small">
                            <FontAwesomeIcon icon={faForward} />
                        </span>
                    </button>
                    <button
                        className={classnames("button is-info", { 'is-loading': status === Status.PENDING })}
                        onClick={() => getGame()}
                    >
                        <span>Refresh</span>
                        <span className="icon is-small">
                            <FontAwesomeIcon icon={faSync} />
                        </span>
                    </button>

                </div>
                <div>
                    <p><b>Your Pokemon</b>: {(isOffline ? currentPlayer?.pokemon?.name?.en?.toString() : game.players.find(player => player._id === me._id)?.pokemon?.name?.en.toString()) ?? <i>None</i>}</p>
                </div>
                <div>
                    <p><b>Turn</b>: {currentPlayer?.username}</p>
                    &nbsp;/&nbsp;
                    <p><b>Next player</b>: {nextPlayer?.username}</p>
                </div>
                <p><b>Turn number</b>: {game.turnNumber ?? ''}</p>
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
 */
function _ModalInfos({ isDisplayed = false, x = 0, y = 0, cell, size, border, onHide = () => null, onAction = () => null, status }) {
    // @ts-ignore
    _ModalInfos.handleClickOutside = () => isDisplayed ? onHide() : null

    if (!isDisplayed)
        return null

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
                                return /** @type {Pokemon} **/(cell)?.name?.en ?? <i>Pkmn</i>
                            case Obstacle:
                                return <i>Obstacle</i>
                            case Player:
                                return /** @type {Player} **/(cell)?.username ?? <i>User</i>
                            default:
                                return <>Move here ?</>
                        }
                    })()}
                </p>
                <div className="buttons">
                    {(() => {
                        switch (cell?.constructor) {
                            case Pokemon:
                                return <>
                                    <button
                                        type="button"
                                        className={classnames("button is-link", { 'is-loading': status === Status.PENDING })}
                                        onClick={() => onHide()} //TODO
                                    >
                                        Infos
                                    </button>
                                    <button
                                        type="button"
                                        className={classnames("button is-danger", { 'is-loading': status === Status.PENDING })}
                                        onClick={async () => {
                                            await onAction({ x, y }, 'catch')
                                            onHide()
                                        }}
                                    >
                                        Catch
                                    </button>
                                </>
                            case Obstacle:
                                return null
                            case Player:
                                return <>
                                    <button
                                        type="button"
                                        className={classnames("button is-link", { 'is-loading': status === Status.PENDING })}
                                        onClick={async () => { //TODO
                                            onHide()
                                        }}
                                    >
                                        Infos
                                    </button>
                                    <button
                                        type="button"
                                        className={classnames("button is-danger", { 'is-loading': status === Status.PENDING })}
                                        onClick={() => onHide()} //TODO
                                    >
                                        Attack
                                    </button>
                                </>
                            default:
                                return <>
                                    <button
                                        type="button"
                                        className={classnames("button is-link", { 'is-loading': status === Status.PENDING })}
                                        onClick={async () => {
                                            await onAction({ x, y }, 'walk')
                                            onHide()
                                        }}
                                    >
                                        Yes
                                    </button>
                                    {/* <button
                                        type="button"
                                        className={classnames("button is-danger", { 'is-loading': status === Status.PENDING })}
                                        onClick={() => onHide()}
                                    >
                                        No
                                    </button> */}
                                </>
                        }
                    })()}
                </div>
            </div>
        </div>
    )
}

const ModalInfos = onClickOutside(_ModalInfos, {
    // @ts-ignore
    handleClickOutside: () => _ModalInfos.handleClickOutside
})