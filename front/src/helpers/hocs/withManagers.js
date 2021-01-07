import React from 'react'
import ReleaseManager from 'request/managers/releaseManager'
import UserManager from 'request/managers/userManager'
import { Release } from 'request/objects/release'
import { User } from 'request/objects/user'
import ApiManager from 'request/apiManager'// eslint-disable-line

/**
 * @typedef {object} ManagersProps
 * @property {function(object):ApiManager<any>} manager Function to get proper manager for a desired object
 * @property {ReleaseManager} releaseManager Release Manager
 * @property {UserManager} userManager User Manager
 */

/**
 * With managers hoc
 * @param {Object} WrappedComponent Component to wrapp
 */
export default function withManagers(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props)

            // Declare all managers
            const releaseManager = new ReleaseManager()
            const userManager = new UserManager()

            /** @type {object} Store managers in an object */
            this.managers = {
                releaseManager,
                userManager
            }

            /** @type {function(object):ApiManager<any>} Function to get proper manager for a desired object */
            this.manager = obj => {
                switch (obj) {
                    case Release:
                        return releaseManager
                    case User:
                        return userManager
                    default:
                        return null
                }
            }
        }

        render() {
            return <WrappedComponent manager={this.manager} {...this.managers} {...this.props} />
        }
    }
}