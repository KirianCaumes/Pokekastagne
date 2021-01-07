import React, { useEffect } from 'react'
import { history } from 'helpers/history'
import { Switch, Router, Route } from 'react-router-dom'
import { RouteChildrenProps } from 'react-router-dom'// eslint-disable-line
import { connect } from "react-redux"
import { PayloadTest, CommonState } from 'redux/slices/common'// eslint-disable-line
import { setTest } from 'redux/slices/common'
import Login from 'pages/login'
import Index from 'pages'
import withManagers from 'helpers/hocs/withManagers'
import { ManagersProps } from 'helpers/hocs/withManagers'// eslint-disable-line
import Register from 'pages/register'
import Howtoplay from 'pages/howtoplay'
import IndexGame from 'pages/[game]/index'
import 'request/pretender'
import { init, signIn, signOut } from 'redux/slices/user'// eslint-disable-line
import { UserState, PayloadInit, PayloadSingIn } from 'redux/slices/user'// eslint-disable-line
import { PrivateRoute, PublicRoute } from 'components/routes'
import IdGame from 'pages/[game]/[id]'

/**
 * Global components props
 * @typedef {ReduxProps & RouteChildrenProps & ManagersProps} AppProps
 */

/**
 * @typedef {object} ReduxProps
 * @property {function(PayloadTest):void} setTest test
 * @property {function(PayloadSingIn):void} signIn Sign in
 * @property {function(undefined):void} signOut Sign out
 * @property {function(PayloadInit):void} init Init
 * 
 * @property {CommonState["test"]} test Test
 * @property {UserState["isAuthenticated"]} isAuthenticated Is Authenticated
 * @property {UserState["me"]} me Me
 */

const mapDispatchToProps = dispatch => ({
    setTest: ({ test }) => dispatch(setTest({ test })),

    signIn: ({ token }) => dispatch(signIn({ token })),
    signOut: () => dispatch(signOut(undefined)),
    init: ({ me }) => dispatch(init({ me })),
})

const mapStateToProps = state => ({
    test: state.common.test,

    isAuthenticated: state.user.isAuthenticated,
    me: state.user.me,
})

const _Index = connect(mapStateToProps, mapDispatchToProps)(withManagers(Index))
const _Login = connect(mapStateToProps, mapDispatchToProps)(withManagers(Login))
const _Register = connect(mapStateToProps, mapDispatchToProps)(withManagers(Register))
const _Howtoplay = connect(mapStateToProps, mapDispatchToProps)(withManagers(Howtoplay))
const _IndexGame = connect(mapStateToProps, mapDispatchToProps)(withManagers(IndexGame))
const _IdGame = connect(mapStateToProps, mapDispatchToProps)(withManagers(IdGame))

/**
 * @param {AppProps} props
 */
function _App({ userManager, isAuthenticated, init }) {
    /** @type {[boolean, function(boolean):any]} Init */
    const [isInit, setIsInit] = React.useState(!!false)

    useEffect(
        () => {
            (async () => {
                if (isAuthenticated) {
                    try {
                        const me = await userManager.getMe()
                        init({ me })
                        setIsInit(true)
                    } catch (error) {
                        console.error(error)
                    }
                }
            })()
        },
        [isAuthenticated, userManager, init]
    )

    return (
        <>
            <Router history={history}>
                <Switch>
                    <PrivateRoute
                        path="/:gametype(singleplayer|multiplayer)/:id"
                        component={_IdGame}
                        isAuthenticated={isAuthenticated}
                        isInit={isInit}
                        title="Game!"
                    />
                    <PrivateRoute
                        path="/:gametype(singleplayer|multiplayer)"
                        component={_IndexGame}
                        isAuthenticated={isAuthenticated}
                        isInit={isInit}
                        title="Game"
                    />
                    <PrivateRoute
                        path="/how-to-play"
                        component={_Howtoplay}
                        isAuthenticated={isAuthenticated}
                        isInit={isInit}
                        title="How to play"
                    />
                    <PrivateRoute
                        path="/"
                        component={_Index}
                        isAuthenticated={isAuthenticated}
                        isInit={isInit}
                        exact
                        title="Home"
                    />

                    <PublicRoute
                        path="/login"
                        component={_Login}
                        title="Login"
                    />
                    <PublicRoute
                        path="/register"
                        component={_Register}
                        title="Register"
                    />
                    <Route
                        component={() => <h1>Page not found 😟</h1>}
                    />
                </Switch>
            </Router>
        </>
    )
}

const App = connect(mapStateToProps, mapDispatchToProps)(withManagers(_App))

export default App