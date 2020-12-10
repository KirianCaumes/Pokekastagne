import React from 'react'
import { history } from 'helpers/history'
import { Switch, Router, Route } from 'react-router-dom'
import Login from './pages/login'
import Index from './pages'

export default function App() {
    return (
        <>
            <p>Hello Pokékastagne</p>
            <Router history={history}>
                <Switch>
                    <Route
                        path="/"
                        component={Index}
                        title="Home"
                    />
                    <Route
                        path="/login"
                        component={Login}
                        title="Home"
                    />
                </Switch>
            </Router>
        </>
    )
}