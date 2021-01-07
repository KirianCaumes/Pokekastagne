import React from 'react'
import { AppProps } from 'app'// eslint-disable-line
// import useLang from 'helpers/hooks/useLang'

/**
 * @param {AppProps} props
 */
export default function IdGame({ test }) {
    // const lang = useLang()

    return (
        <main
            className="app-page-howtoplay"
            style={{
                backgroundImage: `url(${require('assets/img/background.png').default})`
            }}
        >
            game
        </main>
    )
}