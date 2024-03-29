// @ts-nocheck
import { BackgroundSyncPlugin } from 'workbox-background-sync'
import { clientsClaim, setCacheNameDetails } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies'

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

//Cache api
registerRoute(
    /(\/api\/game\/online|\/api\/user\/me)/,
    new NetworkFirst({
        cacheName: 'pokekastagne-api',
        plugins: [
            new ExpirationPlugin({ maxEntries: 50 }),
        ],
    })
)

/** {@link | https://developers.google.com/web/tools/workbox/modules/workbox-background-sync} */
registerRoute(
    /\/api\/game\/online\/.....\/(walk|attack|catch|skip)/,
    new NetworkOnly({
        plugins: [new BackgroundSyncPlugin('pokekastagne-queue', {
            maxRetentionTime: 24 * 60
        })]
    }),
    'POST'
)

//Force current sw to be used
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING')
        self.skipWaiting()
})

self.addEventListener('push', ev => {
    const data = ev.data.json()
    console.log('Got push', data)

    //Broadcast message to app
    const channel = new BroadcastChannel('sw-messages-push')
    channel.postMessage({ gameCode: data.gameCode, test: 'coucou' })

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
