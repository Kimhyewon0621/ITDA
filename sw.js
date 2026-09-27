const CACHE='kgd-rental-v1';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(hit=>{
    const net=fetch(e.request).then(res=>{ if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));} return res; }).catch(()=>hit);
    return hit||net;
  }));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=(e.notification.data&&e.notification.data.url)||'#/my';
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{
    for(const c of cs){ c.focus(); c.navigate && c.navigate('./'+url); return; }
    return self.clients.openWindow('./'+url);
  }));
});
// 2단계: 서버(예: Firebase Cloud Messaging)에서 보내는 푸시를 받는 자리
self.addEventListener('push',e=>{
  const d=e.data?e.data.json():{title:'기경대 대여',body:'반납일이 다가왔어요'};
  e.waitUntil(self.registration.showNotification(d.title||'기경대 대여',{body:d.body,icon:'icon-192.png',data:{url:'#/my'}}));
});
