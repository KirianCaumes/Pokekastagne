import React from 'react'
import { Loader } from './loader'

/**
 * Loader component
 * @param {object} props 
 */
export const FullLoader = (props) => (
    <div
        className="app-full-loader"
        style={{
            backgroundImage: `url(${require('assets/img/background.png').default})`
        }}
    >
        <Loader />
    </div>
)