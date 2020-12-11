import React from 'react'
import { history } from 'helpers/history'
import { Switch, Router, Route } from 'react-router-dom'
import { RouteChildrenProps } from 'react-router-dom'// eslint-disable-line
import { connect } from "react-redux"
import {PayloadTest, CommonState } from 'redux/slices/common'// eslint-disable-line
import { setTest } from 'redux/slices/common'
import Login from 'pages/login'
import Index from 'pages'

/**
 * Global components props
 * @typedef {ReduxProps & RouteChildrenProps} AppProps
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

const _Index = connect(mapStateToProps, mapDispatchToProps)(Index)
const _Login = connect(mapStateToProps, mapDispatchToProps)(Login)

export default function App() {
    return (
        <>
            <p>Hello Pokékastagne</p>
            <Router history={history}>
                <Switch>
                    <Route
                        path="/"
                        component={_Index}
                        title="Home"
                    />
                    <Route
                        path="/login"
                        component={_Login}
                        title="Home"
                    />
                </Switch>
            </Router>
        </>
    )
}