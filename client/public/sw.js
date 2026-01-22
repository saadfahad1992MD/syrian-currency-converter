// Self-destructing Service Worker - Unregisters itself immediately
// This will fix the white screen issue permanently

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', async (event) => {
  // Clear all caches
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  
  // Unregister this service worker
  self.registration.unregister();
  
  // Reload all clients
  const clients = await self.clients.matchAll();
  clients.forEach(client => client.navigate(client.url));
});
