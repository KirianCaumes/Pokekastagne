// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
)

export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        // The URL constructor is available in all browsers that support SW.
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href)
        if (publicUrl.origin !== window.location.origin) {
            // Our service worker won't work if PUBLIC_URL is on a different origin
            // from what our page is served on. This might happen if a CDN is used to
            // serve assets see https://github.com/facebook/create-react-app/issues/2374
            return
        }

        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`

            if (isLocalhost) {
                // This is running on localhost. Let's check if a service worker still exists or not.
                checkValidServiceWorker(swUrl, config)

                // Add some additional logging to localhost, pointing developers to the
                // service worker/PWA documentation.
                navigator.serviceWorker.ready.then(() => {
                    console.log(
                        'This web app is being served cache-first by a service ' +
                        'worker. To learn more, visit https://cra.link/PWA'
                    )
                })
            } else {
                // Is not localhost. Just register service worker
                registerValidSW(swUrl, config)
            }
        })

        console.log('Loaded service worker!');
    }
}

function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing
                if (installingWorker == null) {
                    return
                }
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // At this point, the updated precached content has been fetched,
                            // but the previous service worker will still serve the older
                            // content until all client tabs are closed.
                            console.log(
                                'New content is available and will be used when all ' +
                                'tabs for this page are closed. See https://cra.link/PWA.'
                            )

                            // Execute callback
                            if (config && config.onUpdate) {
                                config.onUpdate(registration)
                            }
                        } else {
                            // At this point, everything has been precached.
                            // It's the perfect time to display a
                            // "Content is cached for offline use." message.
                            console.log('Content is cached for offline use.')

                            // Execute callback
                            if (config && config.onSuccess) {
                                config.onSuccess(registration)
                            }
                        }
                    }
                }
            }
        })
        .catch((error) => {
            console.error('Error during service worker registration:', error)
        })
}

function checkValidServiceWorker(swUrl, config) {
    // Check if the service worker can be found. If it can't reload the page.
    fetch(swUrl, {
        headers: { 'Service-Worker': 'script' },
    })
        .then((response) => {
            // Ensure service worker exists, and that we really are getting a JS file.
            const contentType = response.headers.get('content-type')
            if (
                response.status === 404 ||
                (contentType != null && contentType.indexOf('javascript') === -1)
            ) {
                // No service worker found. Probably a different app. Reload the page.
                navigator.serviceWorker.ready.then((registration) => {
                    registration.unregister().then(() => {
                        window.location.reload()
                    })
                })
            } else {
                // Service worker found. Proceed as normal.
                registerValidSW(swUrl, config)
            }
        })
        .catch(() => {
            console.log('No internet connection found. App is running in offline mode.')
        })
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
        .replace(/\-/g, '+') // eslint-disable-line
        .replace(/_/g, '/')

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export function initNotificationService() {
    const VAPID_PUBLIC_KEY = 'BAzQNNztn_Klst3iiBCLdxxf3hS0KhdSDMuupon0mpcx4NwQ8Gv_2DwC7en0w_sadNyaRRxfqNl1mmyOxP9FBQE'
    const LOCAL_STORAGE_KEY = 'POKEKASTAGNE_TOKEN'

    if ('serviceWorker' in navigator) {
        console.log('Registering push')
        navigator.serviceWorker.ready
            .then(function (registration) {
                console.log('Registering push')
                if (!registration.pushManager) {
                    console.warn('Push manager unavailable.')
                    return
                }


                registration.pushManager
                    .getSubscription()
                    .then(function (subscription) {
                        if (subscription === null) {
                            console.log('No subscription detected, make a request.')

                            registration.pushManager
                                .subscribe({
                                    userVisibleOnly: true,
                                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
                                })
                                .then(newSub => {
                                    console.log('fetching')
                                    fetch('/api/user/subscribe', {
                                        method: 'POST',
                                        body: JSON.stringify(newSub),
                                        headers: {
                                            'content-type': 'application/json',
                                            'authorization': `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY)}`
                                        }
                                    }).then(() => {
                                        console.log('Sent push!')
                                    })
                                })
                                .catch(err => {
                                    if (Notification.permission !== 'granted') {
                                        console.log('Permission was not granted.')
                                    } else {
                                        console.error('An error occurred during the subscription process.', err)
                                    }
                                })
                        } else {
                            console.log('Existing subscription detected.')
                        }
                    }).catch(err => {
                        console.error('An error occurred during Service Worker registration.', err)
                    })
            }).catch(err => {
                console.error('Service worker is not ready.', err)
            })
    }
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister()
            })
            .catch((error) => {
                console.error(error.message)
            })
    }
}
