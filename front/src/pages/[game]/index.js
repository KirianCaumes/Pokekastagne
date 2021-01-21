import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AppProps } from 'app'// eslint-disable-line
// @ts-ignore
import { Section, Container, Columns } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointUp, faHome, faHourglass, faPlusSquare, faTrash, faUsers } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import useLang from 'helpers/hooks/useLang'
import { Status } from 'static/status'
import { Game } from 'request/objects/game'// eslint-disable-line
import { Loader } from 'components/visuals/loader'
import { NotImplementedError } from 'request/errors/notImplementedError'
import { InvalidEntityError } from 'request/errors/invalidEntityError'
import { UnauthorizedError } from 'request/errors/unauthorizedError'
import { CancelRequestError } from 'request/errors/cancelRequestError'
import Modal from 'components/general/modal'
import { ModalType } from 'components/general/modal'// eslint-disable-line
import { history } from 'helpers/history'

/**
 * Select lobby
 * @param {AppProps} props
 */
export default function IndexGame({ match, me, gameManager }) {
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = useState(Status.IDLE)
    /** @type {[boolean, function(boolean):any]} Is offline */
    const [isOffline] = useState(match.params?.gametype === 'singleplayer')
    /** @type {[Game[], function(Game[]):any]} Game */
    const [games, setGames] = useState([])

    /** @type {[ModalType, function(ModalType):any]} Modal */
    const [modalCreation, setModalCreation] = useState({ isDisplay: !!false })
    /** @type {[ModalType, function(ModalType):any]} Modal */
    const [modalJoin, setModalJoin] = useState({ isDisplay: !!false })
    /** @type {[Game, function(Game):any]} New game name */
    const [newGame, setNewGame] = useState(new Game())

    const type = useMemo(() => isOffline ? 'offline' : 'online', [isOffline])

    useEffect(() => {
        (async () => {
            setStatus(Status.PENDING)
            try {
                const games = await gameManager.getAll({}, type)
                setGames(games)
                setStatus(Status.RESOLVED)
            } catch (error) {
                switch (error?.constructor) {
                    case CancelRequestError: break
                    case UnauthorizedError:
                    case InvalidEntityError:
                        setStatus(Status.REJECTED)
                        console.error(error)
                        break
                    case NotImplementedError:
                    default:
                        setStatus(Status.REJECTED)
                        console.error(error)
                        break
                }
            }
        })()
    }, [gameManager, type])

    const _upsert = useCallback(
        async () => {
            setStatus(Status.PENDING)
            try {
                const game = await gameManager.create(newGame, type)
                setGames([game, ...games])
                setStatus(Status.RESOLVED)
                setNewGame(new Game())
            } catch (error) {
                switch (error?.constructor) {
                    case CancelRequestError: break
                    case UnauthorizedError:
                    case InvalidEntityError:
                        // setErrorField(error.errorField)
                        setStatus(Status.REJECTED)
                        console.error(error)
                        break
                    case NotImplementedError:
                    default:
                        setStatus(Status.REJECTED)
                        console.error(error)
                        break
                }
            }
        },
        [gameManager, type, games, newGame]
    )

    const _join = useCallback(
        async () => {
            setStatus(Status.PENDING)
            try {
                const game = await gameManager.updateById(null, newGame.gameId, type)
                history.push(`${match.url}/${game.gameId}`)
                // setGames([game, ...games])
                // setStatus(Status.RESOLVED)
                // setNewGame(new Game())
            } catch (error) {
                switch (error?.constructor) {
                    case CancelRequestError: break
                    case UnauthorizedError:
                    case InvalidEntityError:
                        // setErrorField(error.errorField)
                        setStatus(Status.REJECTED)
                        console.error(error)
                        break
                    case NotImplementedError:
                    default:
                        setStatus(Status.REJECTED)
                        console.error(error)
                        break
                }
            }
        },
        [gameManager, type, newGame, match]
    )

    const lang = useLang()

    return (
        <>
            <main
                className="app-page-game-index"
                style={{
                    backgroundImage: `url(${require(`assets/img/${isOffline ? 'background1' : 'background2'}.png`).default})`
                }}
            >
                <Section>
                    <Container>
                        <img
                            src={require('assets/img/logo.png').default}
                            alt="Pokékastagne"
                            className="logo"
                        />
                        <br />
                        <br />
                        <div
                            className="main-content"
                        >
                            {![Status.PENDING, Status.IDLE].includes(status) && games?.length > 0 &&
                                games?.map(game => (
                                    <div
                                        key={game.gameId}
                                        className="one-game"
                                    >
                                        <Link
                                            to={`${match.url}/${game.gameId}`}
                                        >
                                            <div
                                                className="card"
                                            >
                                                <div className="card-content">
                                                    <div>{game.name}</div>
                                                </div>
                                                <footer className="card-footer">
                                                    <p className="card-footer-item">
                                                        <span>
                                                            <FontAwesomeIcon icon={faUsers} /> {lang('playersAlive')}: {game.playersAlive}/{game.players?.length ?? 0}
                                                        </span>
                                                    </p>
                                                    <p className="card-footer-item">
                                                        <span>
                                                            <FontAwesomeIcon icon={faHourglass} /> {lang('startedAt')}: {game.startDate?.toISOString()?.split('T')?.[0]}
                                                        </span>
                                                    </p>
                                                </footer>
                                            </div>
                                        </Link>
                                        <div>
                                            {game.creatorId === me._id &&
                                                <button
                                                    className="button is-danger"
                                                    onClick={() => null}
                                                >
                                                    <span className="icon is-small">
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </span>
                                                </button>
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                            {![Status.PENDING, Status.IDLE].includes(status) && games?.length <= 0 &&
                                <h2 className="has-text-black title is-4">{lang('noResult')}</h2>
                            }

                            {[Status.PENDING, Status.IDLE].includes(status) &&
                                <Loader />
                            }

                            <Columns>
                                <Columns.Column>
                                    <Link
                                        className="button is-large is-navyblue is-fullwidth"
                                        to="/"
                                    >
                                        <span className="icon is-small">
                                            <FontAwesomeIcon icon={faHome} />
                                        </span>
                                        <span>{lang('homepage')}</span>
                                    </Link>
                                </Columns.Column>
                                <Columns.Column>
                                    <Columns>
                                        {!isOffline &&
                                            <Columns.Column>
                                                <button
                                                    className="button is-large is-blue is-fullwidth"
                                                    onClick={() => setModalJoin({ isDisplay: true })}
                                                >
                                                    <span>{lang('join')}</span>
                                                    <span className="icon is-small">
                                                        <FontAwesomeIcon icon={faHandPointUp} />
                                                    </span>
                                                </button>
                                            </Columns.Column>
                                        }
                                        <Columns.Column>
                                            <button
                                                className="button is-large is-blue is-fullwidth"
                                                onClick={() => setModalCreation({ isDisplay: true })}
                                            >
                                                <span>{lang('create')}</span>
                                                <span className="icon is-small">
                                                    <FontAwesomeIcon icon={faPlusSquare} />
                                                </span>
                                            </button>
                                        </Columns.Column>
                                    </Columns>
                                </Columns.Column>
                            </Columns>

                        </div>
                    </Container>
                </Section>
            </main>

            <Modal
                isDisplay={modalCreation.isDisplay}
                title={`${lang('new')} ${lang('game')}`}
                onClickYes={async () => {
                    await _upsert()
                    setModalCreation({ isDisplay: false })
                }}
                onClickNo={() => setModalCreation({ isDisplay: false })}
            >
                <div className="field">
                    <label className="label">{lang('name')}</label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            placeholder={lang('name')}
                            value={newGame.name || ''}
                            onChange={ev => setNewGame({ ...newGame, name: ev.target.value })}
                            required
                        />
                    </div>
                </div>
            </Modal>

            <Modal
                isDisplay={modalJoin.isDisplay}
                title={`${lang('join')} ${lang('game')}`}
                onClickYes={async () => {
                    await _join()
                    setModalJoin({ isDisplay: false })
                }}
                onClickNo={() => setModalJoin({ isDisplay: false })}
            >
                <div className="field">
                    <label className="label">{lang('code')}</label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            placeholder={lang('code')}
                            value={newGame.gameId || ''}
                            onChange={ev => setNewGame({ ...newGame, gameId: ev.target.value })}
                            required
                        />
                    </div>
                </div>
            </Modal>
        </>
    )
}