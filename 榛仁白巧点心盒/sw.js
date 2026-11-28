/* 离线缓存（仅 Pages / http(s) 生效；file:// 双击时不会注册）
   策略：HTML 走网络优先（保证改了立刻生效，离线才回落到缓存），
        其余同源静态资源走「缓存优先 + 后台更新」（命中缓存立即返回，
        同时静默拉一次最新版写回缓存，下次访问即新）。跨源（CDN）一律不拦。 */
const CACHE = 'whimsical-v3'
const CORE = ['./', './index.html']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).catch(() => {}).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

/* 后台静默刷新单个请求的缓存副本（不阻塞响应） */
function revalidate(req) {
  fetch(req).then((r) => {
    if (r && r.ok) {
      const cp = r.clone()
      caches.open(CACHE).then((c) => c.put(req, cp)).catch(() => {})
    }
  }).catch(() => {})
}

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  let url
  try { url = new URL(req.url) } catch (x) { return }
  if (url.origin !== location.origin) return            // CDN / 外部资源不接管

  const isDoc = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').indexOf('text/html') >= 0

  if (isDoc) {
    e.respondWith(
      fetch(req).then((r) => {
        const cp = r.clone()
        caches.open(CACHE).then((c) => c.put(req, cp)).catch(() => {})
        return r
      }).catch(() =>
        caches.match(req).then((m) => m || caches.match('./index.html'))
      )
    )
    return
  }

  e.respondWith(
    caches.match(req).then((m) => {
      if (m) { revalidate(req); return m }
      return fetch(req).then((r) => {
        if (r && r.ok) {
          const cp = r.clone()
          caches.open(CACHE).then((c) => c.put(req, cp)).catch(() => {})
        }
        return r
      })
    })
  )
})
//（注：内容由AI生成）
