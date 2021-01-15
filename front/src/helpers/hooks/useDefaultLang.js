/**
 * Hook to get default lang
 * @param {string=} forceLang Lang to be force
 */
export default function useDefaultLang(forceLang) {
    const langs = forceLang ? [forceLang] : (window.navigator.languages || ['en'])

    return (() => {
        if (langs.includes('en'))
            return 'en'
        else if (langs.includes('fr'))
            return 'fr'
        else
            return 'en'
    })()
}