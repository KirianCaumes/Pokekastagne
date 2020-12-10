import React from 'react'
import useLang from 'helpers/useLang'

export default function Index() {
    const lang = useLang()

    return (
        <p>HomePage {lang('mykey')}</p>
    )
}