/* Flujo de Caja JDMD · service worker
   - La app (index.html) se pide siempre a la red primero: así recibes cada actualización; si no hay internet, abre la última copia.
   - Librerías y fuentes: copia local, actualizada en segundo plano.
   - Tus datos (Supabase) nunca se guardan aquí. */
const V = 'jdmd-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).catch(() => {})); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  if (/supabase\.co$/.test(u.hostname) || u.pathname.startsWith('/functions/')) return; // datos: siempre en vivo
  if (r.mode === 'navigate' || (u.origin === location.origin && /\/(index\.html)?$/.test(u.pathname))) {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(k => k.put('./index.html', c)); return res; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  if (/^(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(u.hostname) || u.origin === location.origin) {
    e.respondWith(caches.open(V).then(async k => {
      const hit = await k.match(r);
      const net = fetch(r).then(res => { if (res && (res.ok || res.type === 'opaque')) k.put(r, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }));
  }
});
