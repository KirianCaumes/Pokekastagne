import * as React from 'react'

const checkStandalone = () => {
    return (
        // @ts-ignore
        navigator?.standalone ||
        window?.matchMedia('(display-mode: standalone)').matches
    )
}

/**
 * @typedef {object} PwaInfos
 * @property {boolean} isInstallPromptSupported
 * @property {function():Promise<boolean> | null} promptInstall
 * @property {boolean} isStandalone
 */

const initialState = {
    isInstallPromptSupported: false,
    promptInstall: () => null,
    isStandalone: checkStandalone()
}

const usePWA = () => {
    /** @type {[PwaInfos, function(PwaInfos):any]} Modal */
    const [pwaInfos, setPwaInfos] = React.useState(initialState)

    React.useEffect(() => {
        const beforeinstallpromptHandler = e => {
            console.log("beforeinstallprompt", e)
            // Prevent install prompt from showing so we can prompt it later
            e.preventDefault()

            const promptInstall = async () => {
                // @ts-ignore
                const promptRes = await e.prompt()
                if (promptRes.outcome === 'accepted') {
                    setPwaInfos({
                        ...pwaInfos,
                        isStandalone: checkStandalone()
                    })
                    return true
                }
                return false
            }

            setPwaInfos({
                isInstallPromptSupported: true,
                promptInstall,
                isStandalone: checkStandalone()
            })
        }

        const onAppInstalled = () => {
            setTimeout(() => setPwaInfos({ ...pwaInfos, isStandalone: checkStandalone() }), 200)
        }

        const onMatchMedia = () => {
            setPwaInfos({
                ...pwaInfos,
                isStandalone: checkStandalone()
            });
        }

        // Listen on the installation prompt. If this listener is triggered,
        // it means PWA install is possible.
        window.addEventListener('beforeinstallprompt', beforeinstallpromptHandler)

        // It's also possible to know when the user installed the app by
        // listening the app installed event
        window.addEventListener('appinstalled', onAppInstalled)

        // On Chrome, when user opens the previous installed app
        // from the website (via the shortcut in the address bar),
        // we want to check again if the app is in standalone mode.
        window.matchMedia('(display-mode: standalone)').addListener(onMatchMedia)

        return () => {
            // Cleanup event listeners
            window.removeEventListener('beforeinstallprompt', beforeinstallpromptHandler)
            window.removeEventListener('appinstalled', onAppInstalled)
            window.matchMedia('(display-mode: standalone)').removeEventListener("change", onMatchMedia)
        }
    }, [pwaInfos])

    return pwaInfos
}

export default usePWA