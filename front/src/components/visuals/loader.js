import React from 'react'

/**
 * Loader component
 * @param {object} props 
 * @param {object=} props.color Color of loader
 */
export const Loader = ({ color = '#003a70' }) => (
    <div className="app-loader">
        <div >
            <div style={{ borderColor: color }}></div>
            <div style={{ borderColor: color }}></div>
        </div>
    </div>
)