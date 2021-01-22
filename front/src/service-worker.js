// @ts-nocheck
import { clientsClaim, setCacheNameDetails } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import {NetworkFirst, StaleWhileRevalidate} from 'workbox-strategies'

//Force current sw to be used
clientsClaim()

/** {@link | https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-core#.setCacheNameDetails} */
setCacheNameDetails({
    prefix: 'pokekastagne',
    suffix: 'v1',
    precache: 'install-time',
    runtime: 'run-time'
})

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(
    // Return false to exempt requests from being fulfilled by index.html.
    ({ request, url }) => {
        // If this isn't a navigation, skip.
        if (request.mode !== 'navigate')
            return false

        // If this is a URL that starts with /_, skip.
        if (url.pathname.startsWith('/_'))
            return false

        // If this looks like a URL for a resource, because it contains // a file extension, skip.
        if (url.pathname.match(new RegExp('/[^/?]+\\.[^/]+$')))
            return false

        // Return true to signal that we want to use the handler.
        return true
    },
    createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
)

//Cache image
registerRoute(
    ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
    new StaleWhileRevalidate({
        cacheName: 'pokekastagne-images',
        plugins: [
            new ExpirationPlugin({ maxEntries: 50 }),
        ],
    })
)

//Cache image
registerRoute(
    "https://pokekastagne-test.herokuapp.com/api/user/me",
    new StaleWhileRevalidate({
        cacheName: 'me',
        plugins: [
            new ExpirationPlugin({ maxEntries: 1 }),
        ],
    })
)

// cache online party
registerRoute(
    "/api/game/online",
    new NetworkFirst({
        cacheName: 'onlineParty'
    })
)

//Force current sw to be used
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING')
        self.skipWaiting()
})

self.addEventListener('push', ev => {
    const data = ev.data.json()
    console.log('Got push', data)
    self.registration.showNotification(data.title, {
        ...data,
        body: data.title,
        icon: 'http://pokekastagne.herokuapp.com/icon/favicon-96x96-dunplab-manifest-27617.png',
        data: { url: `/multiplayer/${data.gameCode}` }
    })
})

self.addEventListener('notificationclick', ev => {
    const notification = ev.notification
    const action = ev.action
    console.log('Click notification', ev)

    if (action === 'close') {
        notification.close();
    } else {
        if (notification.data && notification.data.url)
            clients.openWindow(notification.data.url)
        notification.close()
    }
})
