import React from 'react'
import useLang from 'helpers/hooks/useLang'
import { AppProps } from 'app'// eslint-disable-line

/**
 * @param {AppProps} props
 */
export default function Index({ test, setTest, releaseManager }) {
    const lang = useLang()

    return (
        <p
            onClick={() => setTest({ test: 'abc' })}
        >
            HomePage {lang('mykey')} {test}
        </p>
    )
}