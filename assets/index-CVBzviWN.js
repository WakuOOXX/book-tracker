(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(a){if(a.ep)return;a.ep=!0;const r=n(a);fetch(a.href,r)}})();const Be="modulepreload",$e=function(e,t){return new URL(e,t).href},J={},Le=function(t,n,o){let a=Promise.resolve();if(n&&n.length>0){const s=document.getElementsByTagName("link"),d=document.querySelector("meta[property=csp-nonce]"),l=(d==null?void 0:d.nonce)||(d==null?void 0:d.getAttribute("nonce"));a=Promise.allSettled(n.map(i=>{if(i=$e(i,o),i in J)return;J[i]=!0;const u=i.endsWith(".css"),c=u?'[rel="stylesheet"]':"";if(!!o)for(let f=s.length-1;f>=0;f--){const y=s[f];if(y.href===i&&(!u||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${i}"]${c}`))return;const g=document.createElement("link");if(g.rel=u?"stylesheet":Be,u||(g.as="script"),g.crossOrigin="",g.href=i,l&&g.setAttribute("nonce",l),document.head.appendChild(g),u)return new Promise((f,y)=>{g.addEventListener("load",f),g.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${i}`)))})}))}function r(s){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=s,window.dispatchEvent(d),!d.defaultPrevented)throw s}return a.then(s=>{for(const d of s||[])d.status==="rejected"&&r(d.reason);return t().catch(r)})};(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(o){if(o.ep)return;o.ep=!0;const a=t(o);fetch(o.href,a)}})();class Se{constructor(){this.routes=new Map,this.currentRoute=null,this.onNavigate=null,this._handleHashChange=this._handleHashChange.bind(this)}add(t,n){return this.routes.set(t,n),this}start(){window.addEventListener("hashchange",this._handleHashChange),this._handleHashChange()}_handleHashChange(){const t=window.location.hash.slice(1)||"home",{path:n,params:o}=this._match(t),a=this.routes.get(n);a&&(this.currentRoute={path:n,params:o,hash:t},a(o),this.onNavigate&&this.onNavigate(n,o))}_match(t){const n=t.split("/");for(const[o]of this.routes){const a=o.split("/");if(a.length!==n.length)continue;const r={};let s=!0;for(let d=0;d<a.length;d++)if(a[d].startsWith(":"))r[a[d].slice(1)]=n[d];else if(a[d]!==n[d]){s=!1;break}if(s)return{path:o,params:r}}return{path:"home",params:{}}}navigate(t){window.location.hash=t}destroy(){window.removeEventListener("hashchange",this._handleHashChange)}}const h=new Se;class De{constructor(){this._state={books:[],readingLogs:[],filter:"all",searchQuery:"",sortBy:localStorage.getItem("book-sort")||"date-desc",currentBook:null,currentLog:null},this._listeners=new Map,this._idCounter=0}get state(){return this._state}setState(t,n){this._state[t]=n,this._notify(t,n)}on(t,n){return this._listeners.has(t)||this._listeners.set(t,new Set),this._listeners.get(t).add(n),()=>this._listeners.get(t).delete(n)}_notify(t,n){const o=this._listeners.get(t);o&&o.forEach(a=>a(n))}}const v=new De,R=(e,t)=>t.some(n=>e instanceof n);let V,Y;function Ce(){return V||(V=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ae(){return Y||(Y=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const N=new WeakMap,O=new WeakMap,C=new WeakMap;function _e(e){const t=new Promise((n,o)=>{const a=()=>{e.removeEventListener("success",r),e.removeEventListener("error",s)},r=()=>{n(w(e.result)),a()},s=()=>{o(e.error),a()};e.addEventListener("success",r),e.addEventListener("error",s)});return C.set(t,e),t}function Oe(e){if(N.has(e))return;const t=new Promise((n,o)=>{const a=()=>{e.removeEventListener("complete",r),e.removeEventListener("error",s),e.removeEventListener("abort",s)},r=()=>{n(),a()},s=()=>{o(e.error||new DOMException("AbortError","AbortError")),a()};e.addEventListener("complete",r),e.addEventListener("error",s),e.addEventListener("abort",s)});N.set(e,t)}let T={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return N.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return w(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function re(e){T=e(T)}function je(e){return Ae().includes(e)?function(...t){return e.apply(S(this),t),w(this.request)}:function(...t){return w(e.apply(S(this),t))}}function Pe(e){return typeof e=="function"?je(e):(e instanceof IDBTransaction&&Oe(e),R(e,Ce())?new Proxy(e,T):e)}function w(e){if(e instanceof IDBRequest)return _e(e);if(O.has(e))return O.get(e);const t=Pe(e);return t!==e&&(O.set(e,t),C.set(t,e)),t}const S=e=>C.get(e);function se(e,t,{blocked:n,upgrade:o,blocking:a,terminated:r}={}){const s=indexedDB.open(e,t),d=w(s);return o&&s.addEventListener("upgradeneeded",l=>{o(w(s.result),l.oldVersion,l.newVersion,w(s.transaction),l)}),n&&s.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),d.then(l=>{r&&l.addEventListener("close",()=>r()),a&&l.addEventListener("versionchange",i=>a(i.oldVersion,i.newVersion,i))}).catch(()=>{}),d}function Re(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",o=>t(o.oldVersion,o)),w(n).then(()=>{})}const Ne=["get","getKey","getAll","getAllKeys","count"],Te=["put","add","delete","clear"],j=new Map;function Q(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(j.get(t))return j.get(t);const n=t.replace(/FromIndex$/,""),o=t!==n,a=Te.includes(n);if(!(n in(o?IDBIndex:IDBObjectStore).prototype)||!(a||Ne.includes(n)))return;const r=async function(s,...d){const l=this.transaction(s,a?"readwrite":"readonly");let i=l.store;return o&&(i=i.index(d.shift())),(await Promise.all([i[n](...d),a&&l.done]))[0]};return j.set(t,r),r}re(e=>({...e,get:(t,n,o)=>Q(t,n)||e.get(t,n,o),has:(t,n)=>!!Q(t,n)||e.has(t,n)}));const Me=["continue","continuePrimaryKey","advance"],G={},M=new WeakMap,ie=new WeakMap,Ke={get(e,t){if(!Me.includes(t))return e[t];let n=G[t];return n||(n=G[t]=function(...o){M.set(this,ie.get(this)[t](...o))}),n}};async function*Fe(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const n=new Proxy(t,Ke);for(ie.set(n,t),C.set(n,S(t));t;)yield n,t=await(M.get(n)||t.continue()),M.delete(n)}function Z(e,t){return t===Symbol.asyncIterator&&R(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&R(e,[IDBIndex,IDBObjectStore])}re(e=>({...e,get(t,n,o){return Z(t,n)?Fe:e.get(t,n,o)},has(t,n){return Z(t,n)||e.has(t,n)}}));const qe=Object.freeze(Object.defineProperty({__proto__:null,deleteDB:Re,openDB:se,unwrap:S,wrap:w},Symbol.toStringTag,{value:"Module"})),We="book-tracker-db",He=1;let P=null;function b(){return P||(P=se(We,He,{upgrade(e){if(!e.objectStoreNames.contains("books")){const t=e.createObjectStore("books",{keyPath:"id",autoIncrement:!0});t.createIndex("title","title"),t.createIndex("author","author"),t.createIndex("category","category"),t.createIndex("status","status"),t.createIndex("createdAt","createdAt")}if(!e.objectStoreNames.contains("reading_logs")){const t=e.createObjectStore("reading_logs",{keyPath:"id",autoIncrement:!0});t.createIndex("bookId","bookId"),t.createIndex("round","round"),t.createIndex("startDate","startDate"),t.createIndex("endDate","endDate")}}})),P}async function $(){return(await b()).getAll("books")}async function D(e){return(await b()).get("books",e)}async function le(e){const t=await b(),n=new Date().toISOString(),o={...e,createdAt:n,updatedAt:n},a=await t.add("books",o);return{...o,id:a}}async function de(e,t){const n=await b(),o=await n.get("books",e);if(!o)throw new Error(`Book ${e} not found`);const a={...o,...t,id:e,updatedAt:new Date().toISOString()};return await n.put("books",a),a}async function ce(e){const t=await b();await t.delete("books",e);const n=await B(e),o=t.transaction("reading_logs","readwrite");await Promise.all(n.map(a=>o.store.delete(a.id))),await o.done}async function ze(e){const t=await b(),n=t.transaction("books","readwrite");await Promise.all(e.map(o=>n.store.delete(o))),await n.done;for(const o of e){const a=await B(o),r=t.transaction("reading_logs","readwrite");await Promise.all(a.map(s=>r.store.delete(s.id))),await r.done}}async function Ue(e){const t=await $();if(!e)return t;const n=e.toLowerCase();return t.filter(o=>o.title&&o.title.toLowerCase().includes(n)||o.author&&o.author.toLowerCase().includes(n)||o.tags&&o.tags.some(a=>a.toLowerCase().includes(n)))}async function Je(e){return(await b()).getAllFromIndex("books","status",e)}async function B(e){return(await(await b()).getAllFromIndex("reading_logs","bookId",e)).sort((t,n)=>n.round-t.round)}async function Ve(e){return(await b()).get("reading_logs",e)}async function ue(e){const t=await b(),n=new Date().toISOString(),o={...e,createdAt:n,updatedAt:n},a=await t.add("reading_logs",o);return{...o,id:a}}async function Ye(e,t){const n=await b(),o=await n.get("reading_logs",e);if(!o)throw new Error(`Log ${e} not found`);const a={...o,...t,id:e,updatedAt:new Date().toISOString()};return await n.put("reading_logs",a),a}async function ge(e){await(await b()).delete("reading_logs",e)}async function Qe(e){const t=await B(e);return t.length===0?0:Math.max(...t.map(n=>n.round||0))}async function me(){const e=await $(),t=await(await b()).getAll("reading_logs");return{version:1,exportedAt:new Date().toISOString(),books:e,readingLogs:t}}async function pe(e,t="merge"){if(!e.books||!e.readingLogs)throw new Error("Invalid data format");const n=await b();if(t==="overwrite"){const r=n.transaction("books","readwrite"),s=await r.store.getAll();await Promise.all(s.map(i=>r.store.delete(i.id))),await r.done;const d=n.transaction("reading_logs","readwrite"),l=await d.store.getAll();await Promise.all(l.map(i=>d.store.delete(i.id))),await d.done}const o=n.transaction("books","readwrite");for(const r of e.books)t==="merge"?r.id&&await n.get("books",r.id)||await o.store.add(r):await o.store.add(r);await o.done;const a=n.transaction("reading_logs","readwrite");for(const r of e.readingLogs)t==="merge"?r.id&&await n.get("reading_logs",r.id)||await a.store.add(r):await a.store.add(r);await a.done}async function Ge(e){const t=(await Ze("reading_logs")).filter(n=>{const o=n.endDate||n.startDate;return o&&o.startsWith(String(e))});return{total:t.length,done:t.filter(n=>n.status==="done").length}}async function Ze(e){return(await b()).getAll(e)}const Xe=Object.freeze(Object.defineProperty({__proto__:null,addBook:le,addReadingLog:ue,deleteBook:ce,deleteBooks:ze,deleteReadingLog:ge,exportAllData:me,getAllBooks:$,getBook:D,getBooksByStatus:Je,getMaxRound:Qe,getReadingLog:Ve,getReadingLogsByBook:B,getYearlyStats:Ge,importAllData:pe,searchBooks:Ue,updateBook:de,updateReadingLog:Ye},Symbol.toStringTag,{value:"Module"})),fe=[{hash:"home",label:"书架",icon:"📚"},{hash:"stats",label:"统计",icon:"📊"},{hash:"settings",label:"设置",icon:"⚙️"}];function he(e,t){return e==="home"?t==="home"||t===""||(t==null?void 0:t.startsWith("book")):t===e}function be(){var e;const t=((e=h.currentRoute)==null?void 0:e.path)||"home";return`
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-3xl mx-auto px-4">
        <div class="flex items-center justify-between h-14">
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-bold text-indigo-600 select-none">📖 读书笔记</h1>
          </div>
          <!-- Desktop nav -->
          <nav class="hidden md:flex gap-1">
            ${fe.map(n=>`<button
                class="nav-btn px-3 py-1.5 rounded-lg text-sm transition-all select-none ${he(n.hash,t)?"bg-indigo-100 text-indigo-700 font-medium shadow-sm":"text-gray-500 hover:bg-gray-100"}"
                data-nav="${n.hash}"
              >${n.icon} ${n.label}</button>`).join("")}
          </nav>
        </div>
      </div>
    </header>
  `}function ye(){var e;const t=((e=h.currentRoute)==null?void 0:e.path)||"home";return`
    <nav id="mobile-nav" class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 safe-area-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div class="flex items-center justify-around h-14 px-2">
        ${fe.map(n=>{const o=he(n.hash,t);return`<button
            class="nav-btn flex flex-col items-center justify-center flex-1 h-full transition-all select-none py-1 relative"
            data-nav="${n.hash}"
          >
            <span class="text-xl leading-none mb-0.5">${n.icon}</span>
            <span class="text-[10px] font-medium ${o?"text-indigo-600":"text-gray-400"}">${n.label}</span>
            ${o?'<span class="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-indigo-600 rounded-full"></span>':""}
          </button>`}).join("")}
      </div>
    </nav>
  `}function ve(){document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{h.navigate(e.dataset.nav)})})}h.onNavigate=()=>{const e=document.querySelector("#app-top-header"),t=document.querySelector("#app-bottom-nav");e&&(e.innerHTML=be()),t&&(t.innerHTML=ye()),ve()};function X(e){if(!e)return"";const t=new Date(e);return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`}function xe(){return new Date().getFullYear()}function F(e){return{wish:"想读",reading:"在读",done:"已读"}[e]||e}function et(e){return{wish:"bg-amber-100 text-amber-800",reading:"bg-blue-100 text-blue-800",done:"bg-green-100 text-green-800"}[e]||"bg-gray-100 text-gray-800"}function q(e){return e?"★".repeat(e)+"☆".repeat(5-e):""}const tt=[{category:"小说",keywords:["小说","长篇","短篇","故事集","三部曲","文集","选集","全集"]},{category:"技术",keywords:["编程","技术","算法","架构","设计模式","代码","程序","软件","计算机","AI","人工智能","数据","网络","安全","数据库","Python","Java","JavaScript","前端","后端","Go","Rust","C++","Linux","机器学习","深度学习","云计算","区块链"]},{category:"历史",keywords:["历史","史记","王朝","战争","文明","帝国","古代","近代","革命","史","考古","传记","回忆录","年谱"]},{category:"哲学",keywords:["哲学","思想","逻辑","存在","本质","伦理","形而上学","认识论","方法论","辩证法"]},{category:"科学",keywords:["科学","物理","化学","生物","数学","天文","地理","自然","物种","进化","基因","量子","宇宙"]},{category:"艺术",keywords:["艺术","设计","摄影","绘画","音乐","电影","美学","创意","视觉","色彩","建筑","雕塑","书法"]},{category:"生活",keywords:["生活","心理","成长","理财","健康","养生","美食","旅行","情感","社交","沟通","管理","职场","励志","自我","习惯","幸福","冥想"]},{category:"经济",keywords:["经济","商业","管理","营销","投资","金融","市场","战略","创业","财务","会计","贸易","股票","基金"]},{category:"教育",keywords:["教育","学习","教学","课程","考试","培训","教材","教辅","词典","词汇","语法"]}];function nt(e,t){const n=((e||"")+" "+(t||"")).toLowerCase();for(const o of tt)if(o.keywords.some(a=>n.includes(a)))return o.category;return"其他"}function I(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}const ot=[{value:"date-desc",label:"最新添加"},{value:"date-asc",label:"最早添加"},{value:"title-asc",label:"书名 A-Z"},{value:"title-desc",label:"书名 Z-A"},{value:"rating-desc",label:"评分最高"},{value:"rating-asc",label:"评分最低"}];function at(e,t){const n=[...e];switch(t){case"date-desc":return n.sort((o,a)=>new Date(a.createdAt||0)-new Date(o.createdAt||0));case"date-asc":return n.sort((o,a)=>new Date(o.createdAt||0)-new Date(a.createdAt||0));case"title-asc":return n.sort((o,a)=>(o.title||"").localeCompare(a.title||"","zh-CN"));case"title-desc":return n.sort((o,a)=>(a.title||"").localeCompare(o.title||"","zh-CN"));case"rating-desc":return n.sort((o,a)=>(a.rating||0)-(o.rating||0));case"rating-asc":return n.sort((o,a)=>(o.rating||0)-(a.rating||0));default:return n}}function we(){const e=v.state.filter,t=v.state.searchQuery,n=v.state.sortBy||"date-desc";localStorage.getItem("book-sort");const o=n;let a=v.state.books.filter(r=>!(e!=="all"&&r.status!==e||t&&!`${r.title} ${r.author}`.toLowerCase().includes(t.toLowerCase())));return a=at(a,o),`
    <div class="page-enter max-w-3xl mx-auto px-4 py-4">
      <!-- Search & Filter Bar -->
      <div class="flex gap-2 mb-2">
        <input type="text" id="search-input" placeholder="搜索书名、作者..."
          class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          value="${L(t)}" />
        <select id="status-filter"
          class="px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%3E%3Cpath%20d%3D%22M3%204.5l3%203%203-3%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center] pr-8">
          <option value="all" ${e==="all"?"selected":""}>全部</option>
          <option value="wish" ${e==="wish"?"selected":""}>想读</option>
          <option value="reading" ${e==="reading"?"selected":""}>在读</option>
          <option value="done" ${e==="done"?"selected":""}>已读</option>
        </select>
      </div>

      <!-- Sort & Count Row -->
      <div class="flex items-center justify-between mb-3">
        <p class="text-sm text-gray-500">共 ${a.length} 本</p>
        <div class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M3 12h18M3 20h18"/>
          </svg>
          <select id="sort-select"
            class="text-xs border-0 bg-transparent text-gray-500 focus:outline-none focus:ring-0 appearance-none pr-4 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%2210%22%3E%3Cpath%20d%3D%22M2%203.5l3%203%203-3%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0_center]">
            ${ot.map(r=>`<option value="${r.value}" ${o===r.value?"selected":""}>${r.label}</option>`).join("")}
          </select>
        </div>
      </div>

      <!-- Book Grid -->
      ${a.length===0?`
        <div class="text-center py-16 text-gray-400">
          <p class="text-5xl mb-4">📖</p>
          <p class="text-lg mb-2">${t?"没有匹配的书籍":"还没有书记录"}</p>
          <p class="text-sm">${t?"试试换个关键词搜索":"点击右下角 + 按钮添加"}</p>
        </div>
      `:`
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          ${a.map(r=>rt(r)).join("")}
        </div>
      `}

      <!-- FAB -->
      <button id="add-book-btn" class="fab-btn fixed bottom-20 md:bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-indigo-700 active:scale-90 transition-transform z-50 select-none">
        +
      </button>
    </div>
  `}function rt(e){return`
    <div class="book-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer active:scale-[0.97] transition-transform select-none"
         data-book-id="${e.id}">
      <div class="aspect-[3/4] bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
        ${e.cover?`<img src="${e.cover}" alt="${L(e.title)}" class="w-full h-full object-cover" />`:'<span class="text-4xl">📕</span>'}
        <span class="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full ${et(e.status)} shadow-sm">${F(e.status)}</span>
      </div>
      <div class="p-2.5">
        <p class="text-sm font-medium text-gray-900 truncate leading-tight">${L(e.title)}</p>
        <p class="text-xs text-gray-500 truncate mt-0.5">${L(e.author||"")}</p>
        ${e.rating?`<p class="text-xs text-amber-500 mt-1">${q(e.rating)}</p>`:""}
      </div>
    </div>
  `}function Ee(){const e=document.getElementById("search-input"),t=document.getElementById("status-filter"),n=document.getElementById("sort-select");let o;e&&e.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(()=>{v.setState("searchQuery",e.value)},300)}),t&&t.addEventListener("change",()=>{v.setState("filter",t.value)}),n&&n.addEventListener("change",()=>{localStorage.setItem("book-sort",n.value),v.setState("sortBy",n.value)}),document.querySelectorAll("[data-book-id]").forEach(r=>{r.addEventListener("click",()=>{r.style.transform="scale(0.95)",setTimeout(()=>{h.navigate(`book/${r.dataset.bookId}`)},100)})});const a=document.getElementById("add-book-btn");a&&a.addEventListener("click",()=>{var r;(r=document.getElementById("add-book-btn"))==null||r.classList.add("scale-90"),setTimeout(()=>{h.navigate("book/new")},100)})}function L(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}const st="modulepreload",it=function(e,t){return new URL(e,t).href},ee={},W=function(e,t,n){let o=Promise.resolve();if(t&&t.length>0){const r=document.getElementsByTagName("link"),s=document.querySelector("meta[property=csp-nonce]"),d=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));o=Promise.allSettled(t.map(l=>{if(l=it(l,n),l in ee)return;ee[l]=!0;const i=l.endsWith(".css"),u=i?'[rel="stylesheet"]':"";if(n)for(let m=r.length-1;m>=0;m--){const g=r[m];if(g.href===l&&(!i||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${u}`))return;const c=document.createElement("link");if(c.rel=i?"stylesheet":st,i||(c.as="script"),c.crossOrigin="",c.href=l,d&&c.setAttribute("nonce",d),document.head.appendChild(c),i)return new Promise((m,g)=>{c.addEventListener("load",m),c.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${l}`)))})}))}function a(r){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=r,window.dispatchEvent(s),!s.defaultPrevented)throw r}return o.then(r=>{for(const s of r||[])s.status==="rejected"&&a(s.reason);return e().catch(a)})};function lt(){const e=E||[],t=xe(),n=e.filter(l=>l.status==="done"),o=n.length,a=n.filter(l=>l.rating).length?(n.filter(l=>l.rating).reduce((l,i)=>l+i.rating,0)/n.filter(l=>l.rating).length).toFixed(1):"—",r={};e.forEach(l=>{r[l.category||"其他"]=(r[l.category||"其他"]||0)+1});const s=Object.entries(r).sort((l,i)=>i[1]-l[1]),d=Array(12).fill(0);return n.forEach(l=>{(K[l.id]||[]).filter(i=>i.status==="done"&&i.endDate).forEach(i=>{const u=new Date(i.endDate).getMonth();new Date(i.endDate).getFullYear()===t&&d[u]++})}),e.filter(l=>l.status==="wish").length,e.filter(l=>l.status==="reading").length,`
    <div class="page-enter max-w-3xl mx-auto px-4 py-4">
      <h2 class="text-lg font-bold mb-4">📊 ${t}年阅读统计</h2>

      <!-- Stats Cards -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p class="text-2xl font-bold text-indigo-600">${o}</p>
          <p class="text-xs text-gray-500 mt-1">本年读完</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p class="text-2xl font-bold text-amber-600">${a}</p>
          <p class="text-xs text-gray-500 mt-1">平均评分</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p class="text-2xl font-bold text-green-600">${e.length}</p>
          <p class="text-xs text-gray-500 mt-1">总藏书</p>
        </div>
      </div>

      <!-- Monthly Chart -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">月度阅读趋势</h3>
        <canvas id="monthly-chart" height="200"></canvas>
      </div>

      <!-- Category & Status Distribution -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">分类分布</h3>
          <canvas id="category-chart" height="180"></canvas>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">阅读状态</h3>
          <canvas id="status-chart" height="180"></canvas>
        </div>
      </div>

      <!-- Category List -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">分类详情</h3>
        <div class="space-y-2">
          ${s.map(([l,i])=>`
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">${l}</span>
              <div class="flex items-center gap-2">
                <div class="w-32 bg-gray-100 rounded-full h-2">
                  <div class="bg-indigo-500 h-2 rounded-full" style="width: ${(i/e.length*100).toFixed(0)}%"></div>
                </div>
                <span class="text-xs text-gray-500 w-6 text-right">${i}</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `}let E=null,K={};async function dt(){E=await $();const e=Array(12).fill(0),t=E.filter(l=>l.status==="done"),n=xe(),o=[];for(const l of E){const i=await B(l.id);K[l.id]=i,o.push(...i)}t.forEach(l=>{(K[l.id]||[]).filter(i=>i.status==="done"&&i.endDate).forEach(i=>{const u=new Date(i.endDate).getMonth();new Date(i.endDate).getFullYear()===n&&e[u]++})});const a=(await W(async()=>{const{default:l}=await Le(()=>import("./chart-CnQqxsCx-Vwy4aaRx.js"),[],import.meta.url);return{default:l}},[],import.meta.url)).default,r=document.getElementById("monthly-chart");r&&new a(r,{type:"line",data:{labels:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],datasets:[{label:"读完数",data:e,borderColor:"#4f46e5",backgroundColor:"rgba(79,70,229,0.1)",fill:!0,tension:.3,pointRadius:3}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,ticks:{stepSize:1}}}}});const s=document.getElementById("category-chart");if(s){const l={};E.forEach(c=>{l[c.category||"其他"]=(l[c.category||"其他"]||0)+1});const i=Object.entries(l),u=["#4f46e5","#f59e0b","#10b981","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316","#6366f1"];new a(s,{type:"doughnut",data:{labels:i.map(c=>c[0]),datasets:[{data:i.map(c=>c[1]),backgroundColor:u.slice(0,i.length)}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom",labels:{boxWidth:10,padding:8,font:{size:10}}}}}})}const d=document.getElementById("status-chart");if(d){const l=E.filter(c=>c.status==="wish").length,i=E.filter(c=>c.status==="reading").length,u=E.filter(c=>c.status==="done").length;new a(d,{type:"doughnut",data:{labels:["想读","在读","已读"],datasets:[{data:[l,i,u],backgroundColor:["#f59e0b","#3b82f6","#10b981"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom",labels:{boxWidth:10,padding:8,font:{size:10}}}}}})}}function p(e,t="info",n=3e3){const o={info:"bg-blue-500",success:"bg-green-500",warning:"bg-amber-500",error:"bg-red-500"},a=document.createElement("div");a.className=`toast-enter fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white text-sm shadow-lg ${o[t]||o.info} max-w-xs`,a.textContent=e,document.body.appendChild(a),setTimeout(()=>{a.style.opacity="0",a.style.transition="opacity 0.3s",setTimeout(()=>a.remove(),300)},n)}function H(){try{const e=localStorage.getItem("ocr-config");return e?JSON.parse(e):null}catch{return null}}async function ct(e){const t=H();if(!t||!t.apiKey||!t.secretKey)throw new Error("请先在设置中配置 OCR API");t.provider;const n=await fetch("https://ocr.cn-shanghai.aliyuncs.com/",{method:"POST",headers:{"Content-Type":"application/json",Authorization:t.apiKey,"x-ocr-secret":t.secretKey},body:JSON.stringify({image:e,type:"General"})});if(!n.ok)throw new Error(`阿里云 OCR 请求失败: ${n.status}`);const o=await n.json();return ut(o)}function ut(e){var t;const n=((t=e==null?void 0:e.data)==null?void 0:t.content)||(e==null?void 0:e.content)||[],o=Array.isArray(n)?n.join(`
`):typeof n=="string"?n:"";return Ie(o)}async function gt(e){const t=H();if(!t||!t.apiKey||!t.secretKey)throw new Error("请先在设置中配置 OCR API");const n=await fetch(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${t.apiKey}&client_secret=${t.secretKey}`,{method:"POST"});if(!n.ok)throw new Error("百度 token 获取失败");const o=await n.json(),a=o.access_token;if(!a)throw new Error("百度 token 无效: "+JSON.stringify(o));const r=new URLSearchParams;r.append("image",e),r.append("detect_direction","true");const s=await fetch(`https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${a}`,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:r.toString()});if(!s.ok){const l=await s.text();throw new Error(`百度 OCR 请求失败: ${s.status} - ${l}`)}const d=await s.json();return mt(d)}function mt(e){if(e.error_msg)throw new Error(`百度 OCR 错误: ${e.error_msg}`);const t=(e.words_result||[]).map(n=>n.words).filter(Boolean).join(`
`);return Ie(t)}function Ie(e){if(!e||!e.trim())return null;const t=e.split(`
`).filter(s=>s.trim()),n=e.trim(),o=[];for(const s of t){const d=s.trim();if(d.length<2)continue;let l="",i="";const u=d.match(/《([^》]+)》\s*(著|编著|主编|编)?\s*[：: ]?\s*(.+)?/);if(u){l=u[1].trim(),i=(u[3]||"").trim(),o.push({title:l,author:i});continue}const c=d.match(/^(.+?)\s*[／/｜|—–—-]\s*(.+)$/);if(c&&(l=c[1].trim(),i=c[2].trim(),l.length<50&&!l.includes("第")&&!l.includes("页"))){o.push({title:l,author:i});continue}const m=d.match(/^(.+?)\s+(著|编著|主编|编|译|著者|作者)[：: ]\s*(.+)$/);if(m){l=m[1].trim(),i=m[3].trim(),o.push({title:l,author:i});continue}const g=d.match(/(?:ISBN[：: ]*)?((?:\d[-\s]?){10,13})/);if(g){g[1].replace(/[-\s]/g,"");continue}d.length>=2&&d.length<=50&&!d.startsWith("第")&&!d.startsWith("页")&&!/^\d+$/.test(d)&&!d.includes("http")&&o.push({title:d,author:""})}const a=new Set,r=o.filter(s=>{const d=s.title;return a.has(d)?!1:(a.add(d),!0)});return r.length===0?n.length<=60?{title:n,author:""}:null:r}async function pt(e){const t=H();if(!t||!t.apiKey||!t.secretKey)throw new Error("请先在设置页面配置 OCR API Key");let n;return t.provider==="baidu"?n=await gt(e):n=await ct(e),n&&!Array.isArray(n)?[n]:n||[]}function ft(e){return new Promise((t,n)=>{const o=new FileReader;o.onload=()=>{const a=o.result.split(",")[1]||o.result;t(a)},o.onerror=()=>n(new Error("图片读取失败")),o.readAsDataURL(e)})}function te(e,t=1024,n=.85){return new Promise(o=>{const a=new Image;a.onload=()=>{const r=document.createElement("canvas");let s=a.width,d=a.height;s>t&&(d=d*t/s,s=t),r.width=s,r.height=d,r.getContext("2d").drawImage(a,0,0,s,d),o(r.toDataURL("image/jpeg",n).split(",")[1])},a.src="data:image/jpeg;base64,"+e})}function ne(e){return e!=null&&e.id&&parseInt(e.id)?'<div class="page-enter max-w-3xl mx-auto px-4 py-4"><p class="text-center text-gray-400">加载中...</p></div>':`
    <div class="page-enter max-w-3xl mx-auto px-4 py-4">
      <div class="flex items-center gap-3 mb-4">
        <button id="form-back-btn" class="text-gray-500 hover:text-gray-700 text-xl">&larr;</button>
        <h2 class="text-lg font-bold">添加书籍</h2>
      </div>

      <!-- Image Input -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">📷 图片识别</h3>
        <div class="flex gap-2">
          <button id="ocr-camera" class="flex-1 py-3 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200">
            📸 拍照
          </button>
          <button id="ocr-gallery" class="flex-1 py-3 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200">
            🖼️ 相册
          </button>
          <button id="ocr-paste" class="flex-1 py-3 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200">
            📋 粘贴
          </button>
        </div>
        <div id="ocr-preview" class="mt-3 hidden">
          <p id="ocr-status" class="text-xs text-gray-500 mb-2">识别中...</p>
          <div id="ocr-results" class="space-y-2"></div>
        </div>
      </div>

      <!-- Book Form -->
      <form id="book-form" class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <input type="hidden" id="field-mode" value="single" />
        <div class="space-y-3">
          <div>
            <label class="text-xs font-medium text-gray-600">书名 *</label>
            <input id="field-title" required
              class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">作者 *</label>
            <input id="field-author" required
              class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">ISBN（可选）</label>
            <input id="field-isbn"
              class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">分类</label>
            <select id="field-category"
              class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="小说">小说</option>
              <option value="技术">技术</option>
              <option value="历史">历史</option>
              <option value="哲学">哲学</option>
              <option value="科学">科学</option>
              <option value="艺术">艺术</option>
              <option value="生活">生活</option>
              <option value="经济">经济</option>
              <option value="教育">教育</option>
              <option value="其他" selected>其他</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">阅读状态</label>
            <select id="field-status"
              class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="wish">想读</option>
              <option value="reading" selected>在读</option>
              <option value="done">已读</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">总页数（可选）</label>
            <input id="field-pages" type="number" min="0"
              class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">评分（1-5，可选）</label>
            <div id="rating-stars" class="flex gap-1 mt-1">
              ${[1,2,3,4,5].map(t=>`<button type="button" class="rating-star text-2xl text-gray-300 hover:text-amber-400" data-rating="${t}">★</button>`).join("")}
            </div>
            <input type="hidden" id="field-rating" value="0" />
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">评价 / 笔记（可选）</label>
            <textarea id="field-review" rows="3"
              class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"></textarea>
          </div>
        </div>
        <button type="submit" class="w-full mt-4 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          保存
        </button>
      </form>
    </div>
  `}function oe(e){const t=e!=null&&e.id?parseInt(e.id):null,n=!!t,o=document.getElementById("form-back-btn");o&&o.addEventListener("click",()=>window.history.back()),document.querySelectorAll(".rating-star").forEach(i=>{i.addEventListener("click",()=>{const u=parseInt(i.dataset.rating);document.getElementById("field-rating").value=u,document.querySelectorAll(".rating-star").forEach((c,m)=>{c.classList.toggle("text-amber-400",m<u),c.classList.toggle("text-gray-300",m>=u)})})});const a=document.getElementById("ocr-camera");a&&a.addEventListener("click",async()=>{try{const i=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}),u=document.createElement("video");u.srcObject=i,u.setAttribute("playsinline",""),u.setAttribute("autoplay",""),u.style.cssText="position:fixed;top:-9999px;left:-9999px;width:1px;height:1px",document.body.appendChild(u),await new Promise(g=>{u.onloadedmetadata=g});const c=document.getElementById("ocr-preview"),m=document.getElementById("ocr-status");c.classList.remove("hidden"),m.textContent="📸 请对准书籍拍照...",a.textContent="📷 拍照",a.onclick=()=>{const g=document.createElement("canvas");g.width=u.videoWidth,g.height=u.videoHeight,g.getContext("2d").drawImage(u,0,0),g.toBlob(async f=>{i.getTracks().forEach(y=>y.stop()),u.remove(),m.textContent="🔄 识别中...",a.textContent="📸 拍照",a.onclick=null,await d(f)},"image/jpeg",.85)}}catch(i){i.name==="NotAllowedError"?p("请允许使用摄像头权限","warning"):i.name==="NotFoundError"?p("未检测到摄像头","warning"):p("拍照启动失败: "+i.message,"error")}});const r=document.getElementById("ocr-gallery");r&&r.addEventListener("click",()=>{const i=document.createElement("input");i.type="file",i.accept="image/*",i.multiple=!0,i.onchange=async u=>{const c=Array.from(u.target.files);if(c.length===0)return;const m=document.getElementById("ocr-preview"),g=document.getElementById("ocr-status");m.classList.remove("hidden");for(let f=0;f<c.length;f++)g.textContent=`🔄 正在识别第 ${f+1}/${c.length} 张...`,await d(c[f],f>0);g.textContent="✅ 识别完成"},i.click()});const s=document.getElementById("ocr-paste");s&&s.addEventListener("click",async()=>{try{const i=await navigator.clipboard.read();let u=!1;for(const c of i){const m=c.types.find(g=>g.startsWith("image/"));if(m){const g=await c.getType(m),f=document.getElementById("ocr-preview"),y=document.getElementById("ocr-status");f.classList.remove("hidden"),y.textContent="🔄 识别中...",await d(g),y.textContent="✅ 识别完成",u=!0;break}}u||p("剪贴板中没有图片，请先截图再粘贴","warning")}catch(i){i.name==="NotAllowedError"?p("请允许剪贴板读取权限","warning"):p("粘贴读取失败: "+i.message,"error")}});async function d(i,u=!1){try{const c=await ft(i),m=await te(c),g=await pt(m);if(!g||g.length===0){p("未识别出书籍信息，请手动输入","warning");return}const f=document.getElementById("ocr-results");u||(f.innerHTML="");let y="";for(const x of g){if(!x.title)continue;const U=x.title?nt(x.title,x.author):"其他";y||(y=x.title,document.getElementById("field-title").value=x.title||"",document.getElementById("field-author").value=x.author||"",document.getElementById("field-category").value=U);const _=document.createElement("div");_.className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm",_.innerHTML=`
          <div>
            <span class="font-medium">${I(x.title)}</span>
            ${x.author?`<span class="text-gray-500 ml-2">${I(x.author)}</span>`:""}
            <span class="text-xs text-indigo-500 ml-2">${U}</span>
          </div>
          <span class="text-green-500 text-xs">✅ 已识别</span>
        `,f.appendChild(_)}const A=document.createElement("img");A.src="data:image/jpeg;base64,"+await te(c,200,.6),A.className="w-full rounded-lg mt-2 max-h-32 object-contain bg-gray-50",f.appendChild(A)}catch(c){throw p("OCR 识别失败: "+c.message,"error"),c}}const l=document.getElementById("book-form");l&&l.addEventListener("submit",async i=>{i.preventDefault();const u=document.getElementById("field-title").value.trim(),c=document.getElementById("field-author").value.trim();if(!u||!c){p("请填写书名和作者","warning");return}const m={title:u,author:c,isbn:document.getElementById("field-isbn").value.trim(),category:document.getElementById("field-category").value,status:document.getElementById("field-status").value,totalPages:parseInt(document.getElementById("field-pages").value)||0,rating:parseInt(document.getElementById("field-rating").value)||0,review:document.getElementById("field-review").value.trim(),pagesRead:0,tags:[]};try{if(n)await de(t,m),p("更新成功","success"),h.navigate(`book/${t}`);else{const g=await le(m);if(m.status!=="wish"){const{addReadingLog:f}=await W(async()=>{const{addReadingLog:y}=await Promise.resolve().then(()=>Xe);return{addReadingLog:y}},void 0,import.meta.url);await f({bookId:g.id,round:1,status:m.status,startDate:new Date().toISOString(),endDate:m.status==="done"?new Date().toISOString():null,progress:0,rating:m.rating,review:m.review,notes:""})}p("添加成功","success")}h.navigate("home")}catch(g){p("保存失败: "+g.message,"error")}})}async function ht(e){const t=await D(e);if(!t){p("书籍不存在","error"),h.navigate("home");return}document.getElementById("field-title").value=t.title||"",document.getElementById("field-author").value=t.author||"",document.getElementById("field-isbn").value=t.isbn||"",document.getElementById("field-category").value=t.category||"其他",document.getElementById("field-status").value=t.status||"wish",document.getElementById("field-pages").value=t.totalPages||"",t.rating&&(document.getElementById("field-rating").value=t.rating,document.querySelectorAll(".rating-star").forEach((n,o)=>{n.classList.toggle("text-amber-400",o<t.rating),n.classList.toggle("text-gray-300",o>=t.rating)})),document.getElementById("field-review").value=t.review||""}function bt(e){return'<div class="page-enter max-w-3xl mx-auto px-4 py-4"><p class="text-center text-gray-400">加载中...</p></div>'}async function yt(e){const t=e!=null&&e.id?parseInt(e.id):null;if(!t){p("无效的书籍ID","error"),h.navigate("home");return}const n=await D(t);if(!n){p("书籍不存在","error"),h.navigate("home");return}const o=await B(t);document.querySelector("#page-content")||document.querySelector("#app-content");const a=()=>{const r=document.querySelector("#app-content");r&&(r.innerHTML=`
      <div class="page-enter max-w-3xl mx-auto px-4 py-4">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-4">
          <button id="detail-back-btn" class="text-gray-500 hover:text-gray-700 text-xl">&larr;</button>
          <h2 class="text-lg font-bold truncate">${I(n.title)}</h2>
        </div>

        <!-- Book Info Card -->
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <div class="flex gap-4">
            <div class="w-20 h-28 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
              ${n.cover?`<img src="${n.cover}" class="w-full h-full object-cover rounded-lg" />`:'<span class="text-3xl">📕</span>'}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900">${I(n.title)}</h3>
              <p class="text-sm text-gray-500">${I(n.author)}</p>
              <div class="flex flex-wrap gap-1.5 mt-2">
                <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">${n.category||"其他"}</span>
                <span class="text-xs px-2 py-0.5 rounded-full ${ke(n.status)}">${F(n.status)}</span>
              </div>
              ${n.rating?`<p class="text-amber-500 mt-1">${q(n.rating)}</p>`:""}
              ${n.isbn?`<p class="text-xs text-gray-400 mt-1">ISBN: ${I(n.isbn)}</p>`:""}
              ${n.totalPages?`<p class="text-xs text-gray-400 mt-1">共 ${n.totalPages} 页</p>`:""}
            </div>
          </div>
          ${n.review?`<p class="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">${I(n.review)}</p>`:""}
        </div>

        <!-- Actions -->
        <div class="flex gap-2 mb-4">
          <button id="new-reading-btn" class="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            + 新增一刷
          </button>
          <button id="edit-book-btn" class="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">
            编辑
          </button>
          <button id="delete-book-btn" class="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100">
            删除
          </button>
        </div>

        <!-- Reading Logs -->
        <h3 class="text-sm font-semibold text-gray-700 mb-3">
          阅读记录（共 ${o.length} 刷）
        </h3>

        ${o.length===0?`
          <div class="text-center py-8 text-gray-400">
            <p>还没有阅读记录</p>
          </div>
        `:`
          <div class="space-y-2">
            ${o.map(s=>vt(s)).join("")}
          </div>
        `}
      </div>
    `)};a(),window._detailRefresh=async()=>{const r=await D(t);r&&Object.assign(n,r);const s=await B(t);o.length=0,o.push(...s),a(),ae(t,n,o)},ae(t,n,o)}function ae(e,t,n){var o,a,r,s;(o=document.getElementById("detail-back-btn"))==null||o.addEventListener("click",()=>h.navigate("home")),(a=document.getElementById("new-reading-btn"))==null||a.addEventListener("click",()=>{xt(e,n)}),(r=document.getElementById("edit-book-btn"))==null||r.addEventListener("click",()=>{h.navigate(`book/${e}/edit`)}),(s=document.getElementById("delete-book-btn"))==null||s.addEventListener("click",async()=>{confirm(`确定删除《${t.title}》及其所有阅读记录吗？`)&&(await ce(e),p("已删除","success"),h.navigate("home"))}),document.querySelectorAll("[data-delete-log]").forEach(d=>{d.addEventListener("click",async()=>{const l=parseInt(d.dataset.deleteLog);confirm("确定删除这条阅读记录吗？")&&(await ge(l),p("记录已删除","success"),window._detailRefresh&&window._detailRefresh())})})}function vt(e){return`
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-semibold text-indigo-600">第 ${e.round} 刷</span>
        <span class="text-xs px-2 py-0.5 rounded-full ${ke(e.status)}">${F(e.status)}</span>
      </div>
      <div class="flex items-center gap-3 text-xs text-gray-500">
        ${e.startDate?`<span>开始: ${X(e.startDate)}</span>`:""}
        ${e.endDate?`<span>读完: ${X(e.endDate)}</span>`:""}
        ${e.progress?`<span>进度: ${e.progress}%</span>`:""}
      </div>
      ${e.rating?`<p class="text-amber-500 text-sm mt-1">${q(e.rating)}</p>`:""}
      ${e.review?`<p class="text-xs text-gray-600 mt-1">${I(e.review)}</p>`:""}
      <button data-delete-log="${e.id}" class="mt-2 text-xs text-red-500 hover:text-red-700">删除</button>
    </div>
  `}function xt(e,t){var n,o,a;const r=(t.length>0?Math.max(...t.map(d=>d.round||0)):0)+1,s=document.createElement("div");s.className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center",s.innerHTML=`
    <div class="bg-white rounded-t-2xl sm:rounded-2xl p-5 w-full max-w-md max-h-[80vh] overflow-auto">
      <h3 class="font-semibold text-gray-900 mb-3">第 ${r} 刷</h3>
      <form id="new-log-form" class="space-y-3">
        <div>
          <label class="text-xs font-medium text-gray-600">状态</label>
          <select id="log-status" class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="reading">在读</option>
            <option value="done">已读完</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600">开始日期</label>
          <input type="date" id="log-start" class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div id="end-date-group">
          <label class="text-xs font-medium text-gray-600">读完日期</label>
          <input type="date" id="log-end" class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600">评分（1-5，可选）</label>
          <select id="log-rating" class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="0">不评分</option>
            ${[1,2,3,4,5].map(d=>`<option value="${d}">${"★".repeat(d)}${"☆".repeat(5-d)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600">评价（可选）</label>
          <textarea id="log-review" rows="2" class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"></textarea>
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600">阅读进度（可选，如 50%）</label>
          <input type="number" id="log-progress" min="0" max="100" placeholder="50" class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <button type="submit" class="w-full py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">保存</button>
        <button type="button" id="log-form-cancel" class="w-full py-2 text-gray-500 text-sm">取消</button>
      </form>
    </div>
  `,document.body.appendChild(s),(n=document.getElementById("log-status"))==null||n.addEventListener("change",d=>{document.getElementById("end-date-group").style.display=d.target.value==="done"?"block":"none"}),document.getElementById("end-date-group").style.display="none",document.getElementById("log-start").value=new Date().toISOString().split("T")[0],(o=document.getElementById("log-form-cancel"))==null||o.addEventListener("click",()=>s.remove()),s.addEventListener("click",d=>{d.target===s&&s.remove()}),(a=document.getElementById("new-log-form"))==null||a.addEventListener("submit",async d=>{d.preventDefault();const l={bookId:e,round:r,status:document.getElementById("log-status").value,startDate:document.getElementById("log-start").value?new Date(document.getElementById("log-start").value).toISOString():new Date().toISOString(),endDate:document.getElementById("log-status").value==="done"&&document.getElementById("log-end").value?new Date(document.getElementById("log-end").value).toISOString():null,rating:parseInt(document.getElementById("log-rating").value)||0,review:document.getElementById("log-review").value.trim(),progress:parseInt(document.getElementById("log-progress").value)||0,notes:""};try{await ue(l),p("添加成功","success"),s.remove(),window._detailRefresh&&window._detailRefresh()}catch(i){p("保存失败: "+i.message,"error")}})}function ke(e){return{wish:"bg-amber-100 text-amber-800",reading:"bg-blue-100 text-blue-800",done:"bg-green-100 text-green-800"}[e]||"bg-gray-100 text-gray-800"}function wt(){return`
    <div class="page-enter max-w-3xl mx-auto px-4 py-4">
      <h2 class="text-lg font-bold mb-4">⚙️ 设置</h2>

      <!-- OCR API Config -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">📸 OCR 配置</h3>
        <div class="space-y-3">
          <div>
            <label class="text-xs font-medium text-gray-600">服务商</label>
            <select id="ocr-provider" class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              <option value="aliyun">阿里云文字识别</option>
              <option value="baidu">百度通用文字识别</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">API Key / AppKey</label>
            <input id="ocr-api-key" type="text" placeholder="请输入 API Key"
              class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Secret Key</label>
            <input id="ocr-secret-key" type="password" placeholder="请输入 Secret Key"
              class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <button id="save-ocr-config" class="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            保存配置
          </button>
        </div>
      </div>

      <!-- Data Management -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">💾 数据管理</h3>
        <div class="space-y-2">
          <button id="export-data-btn" class="w-full py-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 border border-green-200">
            📥 导出数据（JSON）
          </button>
          <label class="block w-full py-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 border border-blue-200 cursor-pointer text-center">
            📤 导入数据（JSON）
            <input type="file" id="import-data-input" accept=".json" class="hidden" />
          </label>
        </div>
      </div>

      <!-- Clear Data -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-red-100 mb-4">
        <h3 class="text-sm font-semibold text-red-700 mb-3">⚠️ 危险操作</h3>
        <button id="clear-data-btn" class="w-full py-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 border border-red-200">
          🗑️ 清除所有数据
        </button>
        <p class="text-xs text-gray-400 mt-2">建议先导出备份再清除，此操作不可恢复</p>
      </div>

      <!-- About -->
      <div class="text-center text-xs text-gray-400 py-4">
        <p>📖 读书笔记 v1.2</p>
        <p>数据仅存储在本地浏览器</p>
      </div>
    </div>
  `}function Et(){var e,t,n,o;const a=localStorage.getItem("ocr-config");if(a)try{const r=JSON.parse(a);document.getElementById("ocr-provider").value=r.provider||"aliyun",document.getElementById("ocr-api-key").value=r.apiKey||"",document.getElementById("ocr-secret-key").value=r.secretKey||""}catch{}(e=document.getElementById("save-ocr-config"))==null||e.addEventListener("click",()=>{const r={provider:document.getElementById("ocr-provider").value,apiKey:document.getElementById("ocr-api-key").value.trim(),secretKey:document.getElementById("ocr-secret-key").value.trim()};if(!r.apiKey||!r.secretKey){p("请填写 API Key 和 Secret Key","warning");return}localStorage.setItem("ocr-config",JSON.stringify(r)),p("配置已保存","success")}),(t=document.getElementById("export-data-btn"))==null||t.addEventListener("click",async()=>{try{const r=await me(),s=new Blob([JSON.stringify(r,null,2)],{type:"application/json"}),d=URL.createObjectURL(s),l=document.createElement("a");l.href=d,l.download="book-tracker-backup-"+new Date().toISOString().split("T")[0]+".json",l.click(),URL.revokeObjectURL(d),p("数据已导出","success")}catch(r){p("导出失败: "+r.message,"error")}}),(n=document.getElementById("import-data-input"))==null||n.addEventListener("change",async r=>{const s=r.target.files[0];if(s){try{const d=await s.text(),l=JSON.parse(d),i=confirm(`确定要导入吗？
取消 = 合并（跳过已存在的记录）
确定 = 覆盖（清除现有数据后再导入）`)?"overwrite":"merge";await pe(l,i),p("数据已"+(i==="overwrite"?"覆盖":"合并")+"导入，请刷新页面","success")}catch(d){p("导入失败: "+d.message,"error")}r.target.value=""}}),(o=document.getElementById("clear-data-btn"))==null||o.addEventListener("click",async()=>{if(!(prompt("输入 DELETE 确认清除所有数据：")!=="DELETE"||!confirm("最后一次确认！清除后数据无法恢复！")))try{const{openDB:r}=await W(async()=>{const{openDB:c}=await Promise.resolve().then(()=>qe);return{openDB:c}},void 0,import.meta.url),s=await r("book-tracker-db",1),d=s.transaction("books","readwrite"),l=await d.store.getAll();await Promise.all(l.map(c=>d.store.delete(c.id))),await d.done;const i=s.transaction("reading_logs","readwrite"),u=await i.store.getAll();await Promise.all(u.map(c=>i.store.delete(c.id))),await i.done,p("所有数据已清除","success"),location.reload()}catch(r){p("清除失败: "+r.message,"error")}})}const It=document.getElementById("app");It.innerHTML=`
  <div id="app-shell" class="min-h-screen flex flex-col">
    <div id="app-top-header">${be()}</div>
    <main id="app-content" class="flex-1 pb-16 md:pb-0"></main>
    <div id="app-bottom-nav">${ye()}</div>
  </div>
`;ve();function k(e){const t=document.getElementById("app-content");t&&(t.innerHTML=e)}function z(){k(we()),Ee()}v.on("filter",()=>{var e;((e=h.currentRoute)==null?void 0:e.path)==="home"&&z()});v.on("searchQuery",()=>{var e;((e=h.currentRoute)==null?void 0:e.path)==="home"&&z()});v.on("sortBy",()=>{var e;((e=h.currentRoute)==null?void 0:e.path)==="home"&&z()});async function kt(){try{const e=await $();v.setState("books",e)}catch(e){console.error("Failed to load data:",e)}}h.add("home",async()=>{await kt(),k(we()),Ee()}).add("stats",async()=>{k(lt()),await dt()}).add("book/new",async()=>{k(ne({})),oe({})}).add("book/:id/edit",async e=>{const t=parseInt(e.id);k(ne({id:t})),oe({id:t}),t&&await ht(t)}).add("book/:id",async e=>{k(bt()),await yt(e)}).add("settings",async()=>{k(wt()),Et()});document.addEventListener("paste",e=>{var t,n,o,a;if(((t=h.currentRoute)==null?void 0:t.path)==="book/new"||(o=(n=h.currentRoute)==null?void 0:n.path)!=null&&o.startsWith("book/")){const r=(a=e.clipboardData)==null?void 0:a.items;if(r){for(const s of r)if(s.type.startsWith("image/")){p("截图粘贴将在 Phase 4 实现","info");break}}}});h.start();
