import { clientsClaim, setCacheNameDetails } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

//Force current sw to be used
clientsClaim()

/** {@link | https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-core#.setCacheNameDetails} */
setCacheNameDetails({
    prefix: 'pokekastagne',
    suffix: 'v1',
    precache: 'install-time',
    runtime: 'run-time'
})

// @ts-ignore
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

//Force current sw to be used
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING')
        // @ts-ignore
        self.skipWaiting()
})

self.addEventListener('push', ev => {
    const data = ev.data.json()
    console.log('Got push', data)
    self.registration.showNotification(data.title, {
        body: 'Hello, World!',
        icon: 'http://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png'
    })
})
