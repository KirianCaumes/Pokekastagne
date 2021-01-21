import React, { useCallback, useEffect } from 'react'
import useLang from 'helpers/hooks/useLang'
import { AppProps } from 'app'// eslint-disable-line

// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { Status } from 'static/status'
import { ErrorUser, User } from 'request/objects/user'// eslint-disable-line
import { history } from 'helpers/history'
import { CancelRequestError } from 'request/errors/cancelRequestError'
import { UnauthorizedError } from 'request/errors/unauthorizedError'
import { InvalidEntityError } from 'request/errors/invalidEntityError'
import { NotImplementedError } from 'request/errors/notImplementedError'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { initNotificationService } from "../serviceWorkerRegistration"

/**
 * @param {AppProps} props
 */
export default function Login({ userManager, signIn, isAuthenticated }) {
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = React.useState(Status.IDLE)
    /** @type {[User, function(User):any]} User */
    const [user, setUser] = React.useState(new User())
    /** @type {[ErrorUser, function(ErrorUser):any]} Error user */
    // const [errorField, setErrorField] = React.useState(new ErrorUser())
    /** @type {[string, function(string):any]} Error message */
    const [errorMessage, setErrorMessage] = React.useState(null)

    const lang = useLang()

    const _upsert = useCallback(
        async () => {
            setStatus(Status.PENDING)
            setErrorMessage(null)
            try {
                const token = (await userManager.login(user))?.token
                signIn({ token })
                history.push('/')
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
                        setErrorMessage(error?.message || 'Something bad happened 🤷‍♀️')
                        console.error(error)
                        break
                }
            }
        },
        [user, userManager, signIn]
    )

    useEffect(() => {
        if (isAuthenticated)
            history.push('/')

    }, [isAuthenticated])

    return (
        <main
            className="app-page-login"
            style={{
                backgroundImage: `url(${require('assets/img/background.png').default})`
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
                    <form
                        onSubmit={ev => {
                            ev.preventDefault()
                            _upsert()
                        }}
                    >
                        <Columns>
                            <Columns.Column />
                            <Columns.Column size="half">
                                {!!errorMessage &&
                                    <div className="notification is-danger">
                                        <button
                                            className="delete"
                                            onClick={() => setErrorMessage(null)}
                                        />
                                        {errorMessage}
                                    </div>
                                }
                                <div className="field">
                                    <label className="label">{lang('email')}</label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="email"
                                            placeholder={lang('email')}
                                            disabled={status === Status.PENDING}
                                            onChange={ev => setUser({ ...user, email: ev.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">{lang('password')}</label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="password"
                                            placeholder={lang('password')}
                                            disabled={status === Status.PENDING}
                                            onChange={ev => setUser({ ...user, password: ev.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex-row is-space-between">
                                    <button
                                        className={classnames("button is-link", { 'is-loading': status === Status.PENDING })}
                                    >
                                        <span>{lang('login')}</span>
                                        <span className="icon is-small">
                                            <FontAwesomeIcon icon={faSignInAlt} />
                                        </span>
                                    </button>
                                    <Link
                                        className="flex-col"
                                        to="/register"
                                        // @ts-ignore
                                        disabled={status === Status.PENDING}
                                    >
                                        <span>{lang('register')}</span>
                                    </Link>
                                </div>
                            </Columns.Column>
                            <Columns.Column />
                        </Columns>
                    </form>
                </Container>
            </Section>
        </main>
    )
}
