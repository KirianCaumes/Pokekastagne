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
import { history } from 'helpers/history'
import ImageMapper from 'react-image-mapper';
import { Pokemon } from 'request/objects/pokemon'
import { Obstacle } from 'request/objects/obstacle'
import { Player } from 'request/objects/player'

/**
 * @param {AppProps} props
 */
export default function IdGame({ gameManager, match }) {
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = useState(Status.IDLE)
    /** @type {[boolean, function(boolean):any]} Is offline */
    const [isOffline] = useState(match.params?.gametype === 'singleplayer')
    /** @type {[Game, function(Game):any]} Game */
    const [game, setGame] = useState(new Game())
    /** @type {[any, function(any):any]} Is offline */
    const [modalInfos, setModalInfos] = useState({ isDisplayed: false, x: 0, y: 0, cell: {} })

    const type = useMemo(() => isOffline ? 'offline' : 'online', [isOffline])
    const size = useMemo(() => 38, [])
    const border = useMemo(() => 2, [])
    const imgSize = useMemo(() => ({ width: 1600, height: 800 }), [])
    const lang = useLang()

    useEffect(() => {
        (async () => {
            setStatus(Status.PENDING)
            try {
                const game = await gameManager.getById(match.params.id, type)
                setGame(game)
                console.log(game)
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
        })()
    }, [gameManager, type, match])


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
                            return "rgba(145,61,136,0.4)"
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
                style={{ width: imgSize.width, height: imgSize.height }}
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
                        console.log(area?.props?.cell?.type)
                        switch (area?.props?.cell?.type) {
                            case 'pokemon':
                                return setModalInfos({ isDisplayed: true, x: area?.props?.coord?.x, y: area?.props?.coord?.y, cell: area?.props?.cell })
                            case 'obstacle':
                                return setModalInfos({ isDisplayed: false })
                            case 'player':
                                return setModalInfos({ isDisplayed: true, x: area?.props?.coord?.x, y: area?.props?.coord?.y, cell: area?.props?.cell })
                            default:
                                return setModalInfos({ isDisplayed: true, x: area?.props?.coord?.x, y: area?.props?.coord?.y })
                        }

                    }}
                />
                {game.map?.map((row, y) =>
                    row?.map((cell, x) => {
                        if (
                            Pokemon === cell?.constructor ||
                            Player === cell?.constructor
                        )
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
                        return <></>
                    })
                )}
                {modalInfos.isDisplayed &&
                    <div
                        className="card"
                        style={{
                            left: (modalInfos.x - 2) * size + ((modalInfos.x + 1) * border),
                            top: (modalInfos.y - 2.5) * size + ((modalInfos.y + 1) * border)
                        }}
                    >
                        <div
                            className="card-content"
                        >
                            <p>{modalInfos.cell?.name?.en ?? modalInfos?.cell?.username}</p>
                            <div className="buttons">
                                <button
                                    type="button"
                                    className="button is-link"
                                    onClick={() => null}
                                >
                                    Infos
                            </button>
                                <button
                                    type="button"
                                    className="button is-danger"
                                    onClick={() => null}
                                >
                                    Attack
                            </button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </main>
    )
}