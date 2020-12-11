import React from 'react'
import useLang from 'helpers/useLang'
import { AppProps } from 'app'// eslint-disable-line

/**
 * @param {AppProps} props
 */
export default function Index({ test, setTest }) {
    const lang = useLang()

    return (
        <p
            onClick={() => setTest({ test: 'abc' })}
        >
            HomePage {lang('mykey')} {test}
        </p>
    )
}