import React from 'react'
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

/**
 * Global components props
 * @typedef {ReduxProps & RouteChildrenProps & ManagersProps} AppProps
 */

/**
 * @typedef {object} ReduxProps
 * @property {function(PayloadTest):void} setTest test
 * 
 * @property {CommonState["test"]} test Test
 */

const mapDispatchToProps = dispatch => ({
    setTest: ({ test }) => dispatch(setTest({ test })),
})

const mapStateToProps = state => ({
    test: state.common.test,
})

const _Index = connect(mapStateToProps, mapDispatchToProps)(withManagers(Index))
const _Login = connect(mapStateToProps, mapDispatchToProps)(withManagers(Login))

export default function App() {
    return (
        <>
            <Router history={history}>
                <Switch>
                    <Route
                        path="/login"
                        component={_Login}
                    />
                    <Route
                        path="/"
                        exact
                        component={_Index}
                    />
                    <Route
                        component={() => <h1>Page not found 😟</h1>}
                    />
                </Switch>
            </Router>
        </>
    )
}