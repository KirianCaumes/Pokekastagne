import React, { useCallback, useEffect, useMemo } from 'react'
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

/**
 * Select lobby
 * @param {AppProps} props
 */
export default function IndexGame({ match, me, gameManager }) {
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = React.useState(Status.IDLE)
    /** @type {[boolean, function(boolean):any]} Is offline */
    const [isOffline] = React.useState(match.params?.gametype === 'singleplayer')
    /** @type {[Game[], function(Game[]):any]} Is offline */
    const [games, setGames] = React.useState([])

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
                const game = await gameManager.create({ name: 'teeeest' }, type)
                setGames([game, ...games])
                setStatus(Status.RESOLVED)
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
        [gameManager, type, games]
    )

    const lang = useLang()

    return (
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
                                    key={game._id}
                                    className="one-game"
                                >
                                    <Link
                                        to={`${match.url}/${game._id}`}
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
                            <p className="has-text-white">{lang('noResult')}</p>
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
                                                onClick={() => null}
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
                                            onClick={() => _upsert()}
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
    )
}