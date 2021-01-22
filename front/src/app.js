import React, { Suspense, useEffect } from 'react'
import { history } from 'helpers/history'
import { Switch, Router, Route, withRouter } from 'react-router-dom'
import { RouteChildrenProps } from 'react-router-dom'// eslint-disable-line
import { connect } from "react-redux"
import { PayloadTest, CommonState } from 'redux/slices/common'// eslint-disable-line
import { setTest } from 'redux/slices/common'
import withManagers from 'helpers/hocs/withManagers'
import { ManagersProps } from 'helpers/hocs/withManagers'// eslint-disable-line
import 'request/pretender'
import { init, signIn, signOut } from 'redux/slices/user'// eslint-disable-line
import { UserState, PayloadInit, PayloadSingIn } from 'redux/slices/user'// eslint-disable-line
import { PrivateRoute, PublicRoute } from 'components/routes'
import { initNotificationService } from "./serviceWorkerRegistration";
import { FullLoader } from 'components/visuals/fullLoader'
// import Index from './pages/index'
// import Login from './pages/login'
// import Register from './pages/register'
// import Howtoplay from './pages/howtoplay'
// import IndexGame from './pages/[game]/index'
// import IdGame from './pages/[game]/[id]'

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

const AppIndex = connect(mapStateToProps, mapDispatchToProps)(withManagers(withRouter(React.lazy(() => import('./pages/index')))))
const AppLogin = connect(mapStateToProps, mapDispatchToProps)(withManagers(withRouter(React.lazy(() => import('./pages/login')))))
const AppRegister = connect(mapStateToProps, mapDispatchToProps)(withManagers(withRouter(React.lazy(() => import('./pages/register')))))
const AppHowtoplay = connect(mapStateToProps, mapDispatchToProps)(withManagers(withRouter(React.lazy(() => import('./pages/howtoplay')))))
const AppIndexGame = connect(mapStateToProps, mapDispatchToProps)(withManagers(withRouter(React.lazy(() => import('./pages/[game]/index')))))
const AppIdGame = connect(mapStateToProps, mapDispatchToProps)(withManagers(withRouter(React.lazy(() => import('./pages/[game]/[id]')))))

// const AppIndex = connect(mapStateToProps, mapDispatchToProps)(withManagers(Index))
// const AppLogin = connect(mapStateToProps, mapDispatchToProps)(withManagers(Login))
// const AppRegister = connect(mapStateToProps, mapDispatchToProps)(withManagers(Register))
// const AppHowtoplay = connect(mapStateToProps, mapDispatchToProps)(withManagers(Howtoplay))
// const AppIndexGame = connect(mapStateToProps, mapDispatchToProps)(withManagers(IndexGame))
// const AppIdGame = connect(mapStateToProps, mapDispatchToProps)(withManagers(IdGame))

/**
 * @param {AppProps} props
 */
function _App({ userManager, isAuthenticated, init, signOut }) {
    /** @type {[boolean, function(boolean):any]} Init */
    const [isInit, setIsInit] = React.useState(!!false)

    useEffect(
        () => {
            (async () => {
                if (isAuthenticated) {
                    initNotificationService()
                    try {
                        const me = await userManager.getMe()
                        init({ me })
                        setIsInit(true)
                    } catch (error) {
                        setIsInit(true)
                        signOut()
                        console.error(error)
                    }
                }
            })()
        },
        [isAuthenticated, userManager, init, signOut]
    )

    return (
        <>
            <Router history={history}>
                <Switch>
                    <PrivateRoute
                        path="/:gametype(singleplayer|multiplayer)/:id"
                        component={() => <Suspense fallback={<FullLoader />}><AppIdGame /></Suspense>}
                        // component={AppIdGame}
                        isAuthenticated={isAuthenticated}
                        isInit={isInit}
                        title="Let's Game!"
                    />
                    <PrivateRoute
                        path="/:gametype(singleplayer|multiplayer)"
                        // component={() => <Suspense fallback={<FullLoader />}><AppIndexGame /></Suspense>}
                        component={AppIndexGame}
                        isAuthenticated={isAuthenticated}
                        isInit={isInit}
                        title="Game"
                    />
                    <PrivateRoute
                        path="/how-to-play"
                        component={() => <Suspense fallback={<FullLoader />}><AppHowtoplay /></Suspense>}
                        // component={AppHowtoplay}
                        isAuthenticated={isAuthenticated}
                        isInit={isInit}
                        title="How to play"
                    />
                    <PrivateRoute
                        path="/"
                        component={() => <Suspense fallback={<FullLoader />}><AppIndex /> </Suspense>}
                        // component={AppIndex}
                        isAuthenticated={isAuthenticated}
                        isInit={isInit}
                        exact
                        title="Home"
                    />

                    <PublicRoute
                        path="/login"
                        component={() => <Suspense fallback={<FullLoader />}><AppLogin /></Suspense>}
                        // component={AppLogin}
                        title="Login"
                    />
                    <PublicRoute
                        path="/register"
                        component={() => <Suspense fallback={<FullLoader />}><AppRegister /></Suspense>}
                        // component={AppRegister}
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
