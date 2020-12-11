import React from 'react'
import ReleaseManager from 'request/managers/releaseManager'
import { Release } from 'request/objects/release'
import ApiManager from 'request/apiManager'// eslint-disable-line

/**
 * @typedef {object} ManagersProps
 * @property {function(object):ApiManager<any>} manager Function to get proper manager for a desired object
 * @property {ReleaseManager} releaseManager Release Manager
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

            /** @type {object} Store managers in an object */
            this.managers = {
                releaseManager,
            }

            /** @type {function(object):ApiManager<any>} Function to get proper manager for a desired object */
            this.manager = obj => {
                switch (obj) {
                    case Release:
                        return releaseManager
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