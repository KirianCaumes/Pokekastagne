import { ReactComponentElement } from "react" //eslint-disable-line
import React from "react"
import { Redirect, Route } from 'react-router-dom'
import { RouteProps } from 'react-router-dom' //eslint-disable-line
import { ConnectedComponent } from "react-redux" //eslint-disable-line
import { FullLoader } from "./visuals/fullLoader"

/**
 * Set title of the page
 * @param {string=} title 
 */
const setTitle = (title) => document.title = title ? `${title} - ${process.env.REACT_APP_SHORT_NAME}` : process.env.REACT_APP_SHORT_NAME

/**
 * @typedef {object} _PrivateRouteProps
 * @property {boolean} isAuthenticated Is user authentificated
 * @property {boolean} isInit Is app init
 * @property {string | function(object):string} title Page name
 * @property {ReactComponentElement | ConnectedComponent<any, any> | function():JSX.Element} component Component to render
 * 
 * @typedef {_PrivateRouteProps & RouteProps} PrivateRouteProps
 */

/**
 * Component for private route when we need to be authentified
 * @param {PrivateRouteProps} props 
 */
export const PrivateRoute = (props) => {
	setTitle(getTitle(props))
	return (
		<Route
			{...{ ...props, component: undefined }}
			render={routeProps =>
				props.isAuthenticated ?
					props.isInit ?
						<props.component {...routeProps} />
						:
						<FullLoader />
					:
					<Redirect
						to={{
							pathname: '/login',
							state: { from: props.location }
						}}
					/>
			}
		/>
	)
}


/**
 * @typedef {object} _PublicRouteProps
 * @property {string | function(object):string} title Page name
 * @property {ReactComponentElement | ConnectedComponent<any, any> | function():JSX.Element} component Component to render
 * 
 * @typedef {_PublicRouteProps & RouteProps} PublicRouteProps
 */

/**
 * Component for private route when we need to be authentified
 * @param {PublicRouteProps} props 
 */
export const PublicRoute = (props) => {
	setTitle(getTitle(props))
	return (
		<Route {...props} />
	)
}

/**
 * Get title when props.title is a function or string
 * @param {object} props 
 * @returns {string} Title
 */
const getTitle = (props) => typeof props.title === "function" ? props.title(props.computedMatch.params) : props.title