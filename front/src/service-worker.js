import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

clientsClaim()

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
        cacheName: 'images',
        plugins: [
            new ExpirationPlugin({ maxEntries: 50 }),
        ],
    })
)

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        // @ts-ignore
        self.skipWaiting()
    }
})
