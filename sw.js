/**
 * RETRO-PC STORE SERVICE WORKER v3.2.0
 * Enhanced PWA implementation with Workbox strategies
 * Includes background sync, push notifications, and advanced caching
 * 
 * Features:
 * - Smart caching strategies
 * - Background sync for offline actions
 * - Push notifications for new products
 * - Performance monitoring
 * - Graceful fallbacks
 */

// Service Worker version - increment for cache invalidation
const CACHE_VERSION = 'retro-pc-store-v3.2.0';
const CACHE_NAME = `${CACHE_VERSION}-main`;
const FALLBACK_CACHE = `${CACHE_VERSION}-fallback`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api5`;

// Cache strategies configuration
const CACHE_STRATEGIES = {
    // Static assets - Cache First
    STATIC: 'cache-first',
    // Dynamic content - Network First
    DYNAMIC: 'network-first',
    // API responses - Stale While Revalidate
    API: 'stale-while-revalidate',
    // Images - Cache First with fallback
    IMAGES: 'cache-first'
};

// Cache durations (in seconds)
const CACHE_DURATIONS = {
    STATIC: 86400 * 30,    // 30 days
    DYNAMIC: 3600,         // 1 hour
    API: 300,              // 5 minutes
    IMAGES: 86400 * 7      // 7 days
};

// Resources to cache immediately on install
const CORE_CACHE_RESOURCES = [
    './',
    'index.html',
    'assets/css/style.css',
    'assets/js/main.js',
    'assets/js/fallback-data.js',
    'assets/im/Intel_8086-2.jpg',
    'assets/im/Intel_8087.jpg',
    'assets/im/Intel_8088-2.jpg',
    'manifest.json',
    'robots.txt',
    // Fonts
    'https://fonts.googleapis.com/css2?family=VT323:wght@400&family=Press+Start+2P:wght@400&display=swap',
    // Critical assets
    'https://fonts.gstatic.com/s/vt323/v17/pxiKyp0ihIEF2isfFJU.woff2',
    'https://fonts.gstatic.com/s/pressstartcp/v12/e3ZV_Ik_wfBBYjpL2xGsb6N3_HkWfKFD.woff2'
];

// Fallback resources for offline functionality
const FALLBACK_RESOURCES = {
    './': 'offline.html',
    'assets/im/': 'assets/im/fallback/offline-placeholder.jpg'
};

// Background sync tags
const SYNC_TAGS = {
    PRODUCT_VIEW: 'product-view-sync',
    USER_ACTION: 'user-action-sync',
    ANALYTICS: 'analytics-sync'
};

/**
 * Enhanced logging with performance tracking
 */
class ServiceWorkerLogger {
    static log(message, data = null) {
        console.log(`[SW v3.2] ${new Date().toISOString()}: ${message}`, data || '');
        
        // Track performance metrics
        if (data && data.duration) {
            self.performance.mark(`sw-${message.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`);
        }
    }

    static error(message, error = null) {
        console.error(`[SW v3.2 ERROR] ${new Date().toISOString()}: ${message}`, error || '');
        
        // Send error to analytics if available
        if (self.gtag) {
            self.gtag('event', 'sw_error', {
                event_category: 'Service Worker',
                event_label: message,
                custom_parameter_1: 'error_tracking'
            });
        }
    }
}

/**
 * Cache management utilities
 */
class CacheManager {
    static async openCache(cacheName) {
        try {
            return await caches.open(cacheName);
        } catch (error) {
            ServiceWorkerLogger.error('Failed to open cache', error);
            throw error;
        }
    }

    static async addToCache(cacheName, resources) {
        try {
            const cache = await this.openCache(cacheName);
            const results = await Promise.allSettled(
                resources.map(resource => cache.add(resource))
            );
            
            const failed = results.filter(result => result.status === 'rejected');
            if (failed.length > 0) {
                ServiceWorkerLogger.error(`Failed to cache ${failed.length} resources`);
            }
            
            ServiceWorkerLogger.log(`Cached ${resources.length - failed.length}/${resources.length} resources`);
            return results;
        } catch (error) {
            ServiceWorkerLogger.error('Failed to add resources to cache', error);
            throw error;
        }
    }

    static async cleanupOldCaches() {
        try {
            const cacheNames = await caches.keys();
            const oldCaches = cacheNames.filter(name => 
                name.startsWith('retro-pc-store-') && !name.includes(CACHE_VERSION)
            );
            
            if (oldCaches.length > 0) {
                await Promise.all(oldCaches.map(name => caches.delete(name)));
                ServiceWorkerLogger.log(`Cleaned up ${oldCaches.length} old caches`);
            }
        } catch (error) {
            ServiceWorkerLogger.error('Failed to cleanup old caches', error);
        }
    }

    static async getCachedResponse(request, cacheName = CACHE_NAME) {
        try {
            const cache = await this.openCache(cacheName);
            return await cache.match(request);
        } catch (error) {
            ServiceWorkerLogger.error('Failed to get cached response', error);
            return null;
        }
    }

    static async putInCache(request, response, cacheName = DYNAMIC_CACHE) {
        try {
            const cache = await this.openCache(cacheName);
            await cache.put(request, response.clone());
        } catch (error) {
            ServiceWorkerLogger.error('Failed to put response in cache', error);
        }
    }
}

/**
 * Network request strategies
 */
class NetworkStrategies {
    // Cache First - good for static assets
    static async cacheFirst(request, cacheName = CACHE_NAME) {
        const cachedResponse = await CacheManager.getCachedResponse(request, cacheName);
        
        if (cachedResponse) {
            ServiceWorkerLogger.log(`Cache hit: ${request.url}`);
            return cachedResponse;
        }

        try {
            const networkResponse = await fetch(request);
            if (networkResponse.ok) {
                await CacheManager.putInCache(request, networkResponse, cacheName);
                ServiceWorkerLogger.log(`Network fetch and cached: ${request.url}`);
            }
            return networkResponse;
        } catch (error) {
            ServiceWorkerLogger.error(`Network fetch failed: ${request.url}`, error);
            return this.getFallbackResponse(request);
        }
    }

    // Network First - good for dynamic content
    static async networkFirst(request, cacheName = DYNAMIC_CACHE) {
        try {
            const networkResponse = await fetch(request);
            if (networkResponse.ok) {
                await CacheManager.putInCache(request, networkResponse, cacheName);
                ServiceWorkerLogger.log(`Network first success: ${request.url}`);
            }
            return networkResponse;
        } catch (error) {
            ServiceWorkerLogger.log(`Network failed, trying cache: ${request.url}`);
            const cachedResponse = await CacheManager.getCachedResponse(request, cacheName);
            
            if (cachedResponse) {
                return cachedResponse;
            }
            
            return this.getFallbackResponse(request);
        }
    }

    // Stale While Revalidate - good for API responses
    static async staleWhileRevalidate(request, cacheName = API_CACHE) {
        const cachedResponse = await CacheManager.getCachedResponse(request, cacheName);
        
        // Always try to update cache in background
        const networkPromise = fetch(request).then(response => {
            if (response.ok) {
                CacheManager.putInCache(request, response, cacheName);
            }
            return response;
        }).catch(error => {
            ServiceWorkerLogger.error(`Background fetch failed: ${request.url}`, error);
        });

        // Return cached version immediately if available
        if (cachedResponse) {
            ServiceWorkerLogger.log(`Stale cache served: ${request.url}`);
            return cachedResponse;
        }

        // Wait for network if no cache
        try {
            return await networkPromise;
        } catch (error) {
            return this.getFallbackResponse(request);
        }
    }

    // Fallback response for offline scenarios
    static async getFallbackResponse(request) {
        const url = new URL(request.url);
        
        // HTML fallback
        if (request.headers.get('accept').includes('text/html')) {
            const fallbackPage = await CacheManager.getCachedResponse('offline.html', FALLBACK_CACHE);
            if (fallbackPage) {
                return fallbackPage;
            }
        }
        
        // Image fallback
        if (request.headers.get('accept').includes('image/')) {
            const fallbackImage = await CacheManager.getCachedResponse(
                'assets/im/fallback/offline-placeholder.jpg', 
                FALLBACK_CACHE
            );
            if (fallbackImage) {
                return fallbackImage;
            }
        }
        
        // Default fallback
        return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

/**
 * Background sync manager
 */
class BackgroundSyncManager {
    static async registerSync(tag, data) {
        try {
            if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
                const registration = await navigator.serviceWorker.ready;
                
                // Store data for background sync
                await this.storeForSync(tag, data);
                
                // Register background sync
                await registration.sync.register(tag);
                ServiceWorkerLogger.log(`Background sync registered: ${tag}`);
            }
        } catch (error) {
            ServiceWorkerLogger.error('Failed to register background sync', error);
        }
    }

    static async storeForSync(tag, data) {
        try {
            const syncData = {
                tag,
                data,
                timestamp: Date.now(),
                attempts: 0
            };
            
            // Store in IndexedDB or localStorage
            localStorage.setItem(`sw-sync-${tag}-${Date.now()}`, JSON.stringify(syncData));
        } catch (error) {
            ServiceWorkerLogger.error('Failed to store sync data', error);
        }
    }

    static async handleBackgroundSync(event) {
        const { tag } = event;
        ServiceWorkerLogger.log(`Handling background sync: ${tag}`);
        
        try {
            switch (tag) {
                case SYNC_TAGS.PRODUCT_VIEW:
                    await this.syncProductViews();
                    break;
                case SYNC_TAGS.USER_ACTION:
                    await this.syncUserActions();
                    break;
                case SYNC_TAGS.ANALYTICS:
                    await this.syncAnalytics();
                    break;
                default:
                    ServiceWorkerLogger.log(`Unknown sync tag: ${tag}`);
            }
        } catch (error) {
            ServiceWorkerLogger.error(`Background sync failed for ${tag}`, error);
            throw error; // Re-throw to trigger retry
        }
    }

    static async syncProductViews() {
        // Implementation for syncing product view data
        ServiceWorkerLogger.log('Syncing product views...');
        // Add your sync logic here
    }

    static async syncUserActions() {
        // Implementation for syncing user actions
        ServiceWorkerLogger.log('Syncing user actions...');
        // Add your sync logic here
    }

    static async syncAnalytics() {
        // Implementation for syncing analytics data
        ServiceWorkerLogger.log('Syncing analytics data...');
        // Add your sync logic here
    }
}

/**
 * Push notification manager
 */
class PushNotificationManager {
    static async handlePushEvent(event) {
        try {
            const data = event.data ? event.data.json() : {};
            
            const options = {
                body: data.body || 'New products available in Retro-PC Store!',
                icon: 'assets/im/icon-192.png',
                badge: 'assets/im/badge-72.png',
                image: data.image || 'assets/im/Intel_8086-2.jpg',
                vibrate: [200, 100, 200],
                data: {
                    url: data.url || './',
                    timestamp: Date.now()
                },
                actions: [
                    {
                        action: 'view',
                        title: 'View Products',
                        icon: 'assets/im/action-view.png'
                    },
                    {
                        action: 'dismiss',
                        title: 'Dismiss',
                        icon: 'assets/im/action-dismiss.png'
                    }
                ],
                requireInteraction: true,
                tag: 'retro-pc-store-notification'
            };

            await self.registration.showNotification(
                data.title || 'Retro-PC Store', 
                options
            );
            
            ServiceWorkerLogger.log('Push notification displayed');
        } catch (error) {
            ServiceWorkerLogger.error('Failed to handle push event', error);
        }
    }

    static async handleNotificationClick(event) {
        const { action, data } = event;
        
        event.notification.close();
        
        try {
            switch (action) {
                case 'view':
                    await clients.openWindow(data.url || './');
                    break;
                case 'dismiss':
                    // Just close the notification
                    break;
                default:
                    await clients.openWindow('./');
            }
            
            ServiceWorkerLogger.log(`Notification action: ${action}`);
        } catch (error) {
            ServiceWorkerLogger.error('Failed to handle notification click', error);
        }
    }
}

/**
 * Service Worker Event Handlers
 */

// Install event - cache core resources
self.addEventListener('install', (event) => {
    ServiceWorkerLogger.log('Service Worker installing...');
    
    event.waitUntil(
        Promise.all([
            CacheManager.addToCache(CACHE_NAME, CORE_CACHE_RESOURCES),
            CacheManager.addToCache(FALLBACK_CACHE, Object.values(FALLBACK_RESOURCES))
        ]).then(() => {
            ServiceWorkerLogger.log('Service Worker installed successfully');
            return self.skipWaiting(); // Activate immediately
        }).catch(error => {
            ServiceWorkerLogger.error('Service Worker installation failed', error);
        })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    ServiceWorkerLogger.log('Service Worker activating...');
    
    event.waitUntil(
        Promise.all([
            CacheManager.cleanupOldCaches(),
            self.clients.claim() // Take control immediately
        ]).then(() => {
            ServiceWorkerLogger.log('Service Worker activated successfully');
        }).catch(error => {
            ServiceWorkerLogger.error('Service Worker activation failed', error);
        })
    );
});

// Fetch event - intelligent caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests and chrome-extension URLs
    if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
        return;
    }
    
    // Determine strategy based on resource type
    let strategy;
    
    if (url.pathname.includes('/assets/im/')) {
        // Images - Cache First
        strategy = () => NetworkStrategies.cacheFirst(request, CACHE_NAME);
    } else if (url.pathname.includes('/assets/')) {
        // Static assets - Cache First
        strategy = () => NetworkStrategies.cacheFirst(request, CACHE_NAME);
    } else if (url.pathname === '/' || url.pathname.endsWith('.html')) {
        // HTML - Network First
        strategy = () => NetworkStrategies.networkFirst(request, DYNAMIC_CACHE);
    } else {
        // Default - Network First
        strategy = () => NetworkStrategies.networkFirst(request, DYNAMIC_CACHE);
    }
    
    event.respondWith(strategy());
});

// Background sync event
self.addEventListener('sync', (event) => {
    event.waitUntil(BackgroundSyncManager.handleBackgroundSync(event));
});

// Push event
self.addEventListener('push', (event) => {
    event.waitUntil(PushNotificationManager.handlePushEvent(event));
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.waitUntil(PushNotificationManager.handleNotificationClick(event));
});

// Message event - communication with main thread
self.addEventListener('message', (event) => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_VERSION });
            break;
        case 'CLEAR_CACHE':
            caches.delete(CACHE_NAME).then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
        case 'BACKGROUND_SYNC':
            BackgroundSyncManager.registerSync(data.tag, data.payload);
            break;
        default:
            ServiceWorkerLogger.log(`Unknown message type: ${type}`);
    }
});

// Error handling
self.addEventListener('error', (event) => {
    ServiceWorkerLogger.error('Service Worker error', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    ServiceWorkerLogger.error('Unhandled promise rejection', event.reason);
});

// Performance monitoring
if ('performance' in self) {
    // Track service worker performance
    self.addEventListener('fetch', (event) => {
        const startTime = performance.now();
        
        event.respondWith(
            event.respondWith.then(response => {
                const duration = performance.now() - startTime;
                
                if (duration > 1000) { // Log slow requests
                    ServiceWorkerLogger.log(`Slow request: ${event.request.url}`, { duration });
                }
                
                return response;
            })
        );
    });
}

ServiceWorkerLogger.log('Service Worker script loaded successfully');