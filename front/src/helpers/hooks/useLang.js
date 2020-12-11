import Translates from 'assets/lang'
import { TranslateKey } from 'assets/lang'// eslint-disable-line

/**
 * Hook to get text translated
 * @param {string=} forceLang Lang to be force
 */
export default function useLang(forceLang) {
    const langs = forceLang ? [forceLang] : (window.navigator.languages || ['en'])

    const lang = (() => {
        if (langs.includes('fr'))
            return 'fr'
        else
            return 'en'
    })()

    /**
     * Get text by a key
     * @param {TranslateKey} key Key to find
     * @param {string=} txt Text to replace
     */
    const res = (key, txt = '') => Translates[key]?.[lang]?.replace('{{txt}}', txt)

    return res
}