import Translates from 'assets/lang'
import { TranslateKey } from 'assets/lang'// eslint-disable-line
import useDefaultLang from 'helpers/hooks/useDefaultLang'

/**
 * Hook to get text translated
 * @param {string=} forceLang Lang to be force
 */
export default function useLang(forceLang) {
    const lang = useDefaultLang(forceLang)

    /**
     * Get text by a key
     * @param {TranslateKey} key Key to find
     * @param {string=} txt Text to replace
     */
    const res = (key, txt = '') => Translates[key]?.[lang]?.replace('{{txt}}', txt)

    return res
}