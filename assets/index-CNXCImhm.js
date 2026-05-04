(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function n(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(a){if(a.ep)return;a.ep=!0;const r=n(a);fetch(a.href,r)}})();class ke{constructor(){this.routes=new Map,this.currentRoute=null,this.onNavigate=null,this._handleHashChange=this._handleHashChange.bind(this)}add(t,n){return this.routes.set(t,n),this}start(){window.addEventListener("hashchange",this._handleHashChange),this._handleHashChange()}_handleHashChange(){const t=window.location.hash.slice(1)||"home",{path:n,params:o}=this._match(t),a=this.routes.get(n);a&&(this.currentRoute={path:n,params:o,hash:t},a(o),this.onNavigate&&this.onNavigate(n,o))}_match(t){const n=t.split("/");for(const[o]of this.routes){const a=o.split("/");if(a.length!==n.length)continue;const r={};let d=!0;for(let i=0;i<a.length;i++)if(a[i].startsWith(":"))r[a[i].slice(1)]=n[i];else if(a[i]!==n[i]){d=!1;break}if(d)return{path:o,params:r}}return{path:"home",params:{}}}navigate(t){window.location.hash=t}destroy(){window.removeEventListener("hashchange",this._handleHashChange)}}const b=new ke;class Be{constructor(){this._state={books:[],readingLogs:[],filter:"all",searchQuery:"",sortBy:localStorage.getItem("book-sort")||"date-desc",currentBook:null,currentLog:null},this._listeners=new Map,this._idCounter=0}get state(){return this._state}setState(t,n){this._state[t]=n,this._notify(t,n)}on(t,n){return this._listeners.has(t)||this._listeners.set(t,new Set),this._listeners.get(t).add(n),()=>this._listeners.get(t).delete(n)}_notify(t,n){const o=this._listeners.get(t);o&&o.forEach(a=>a(n))}}const x=new Be,j=(e,t)=>t.some(n=>e instanceof n);let J,U;function De(){return J||(J=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function $e(){return U||(U=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const T=new WeakMap,R=new WeakMap,C=new WeakMap;function Le(e){const t=new Promise((n,o)=>{const a=()=>{e.removeEventListener("success",r),e.removeEventListener("error",d)},r=()=>{n(w(e.result)),a()},d=()=>{o(e.error),a()};e.addEventListener("success",r),e.addEventListener("error",d)});return C.set(t,e),t}function Se(e){if(T.has(e))return;const t=new Promise((n,o)=>{const a=()=>{e.removeEventListener("complete",r),e.removeEventListener("error",d),e.removeEventListener("abort",d)},r=()=>{n(),a()},d=()=>{o(e.error||new DOMException("AbortError","AbortError")),a()};e.addEventListener("complete",r),e.addEventListener("error",d),e.addEventListener("abort",d)});T.set(e,t)}let M={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return T.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return w(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function ae(e){M=e(M)}function Ce(e){return $e().includes(e)?function(...t){return e.apply(L(this),t),w(this.request)}:function(...t){return w(e.apply(L(this),t))}}function _e(e){return typeof e=="function"?Ce(e):(e instanceof IDBTransaction&&Se(e),j(e,De())?new Proxy(e,M):e)}function w(e){if(e instanceof IDBRequest)return Le(e);if(R.has(e))return R.get(e);const t=_e(e);return t!==e&&(R.set(e,t),C.set(t,e)),t}const L=e=>C.get(e);function re(e,t,{blocked:n,upgrade:o,blocking:a,terminated:r}={}){const d=indexedDB.open(e,t),i=w(d);return o&&d.addEventListener("upgradeneeded",s=>{o(w(d.result),s.oldVersion,s.newVersion,w(d.transaction),s)}),n&&d.addEventListener("blocked",s=>n(s.oldVersion,s.newVersion,s)),i.then(s=>{r&&s.addEventListener("close",()=>r()),a&&s.addEventListener("versionchange",l=>a(l.oldVersion,l.newVersion,l))}).catch(()=>{}),i}function Ae(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",o=>t(o.oldVersion,o)),w(n).then(()=>{})}const Re=["get","getKey","getAll","getAllKeys","count"],Pe=["put","add","delete","clear"],P=new Map;function Y(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(P.get(t))return P.get(t);const n=t.replace(/FromIndex$/,""),o=t!==n,a=Pe.includes(n);if(!(n in(o?IDBIndex:IDBObjectStore).prototype)||!(a||Re.includes(n)))return;const r=async function(d,...i){const s=this.transaction(d,a?"readwrite":"readonly");let l=s.store;return o&&(l=l.index(i.shift())),(await Promise.all([l[n](...i),a&&s.done]))[0]};return P.set(t,r),r}ae(e=>({...e,get:(t,n,o)=>Y(t,n)||e.get(t,n,o),has:(t,n)=>!!Y(t,n)||e.has(t,n)}));const Oe=["continue","continuePrimaryKey","advance"],G={},N=new WeakMap,se=new WeakMap,je={get(e,t){if(!Oe.includes(t))return e[t];let n=G[t];return n||(n=G[t]=function(...o){N.set(this,se.get(this)[t](...o))}),n}};async function*Te(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const n=new Proxy(t,je);for(se.set(n,t),C.set(n,L(t));t;)yield n,t=await(N.get(n)||t.continue()),N.delete(n)}function Q(e,t){return t===Symbol.asyncIterator&&j(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&j(e,[IDBIndex,IDBObjectStore])}ae(e=>({...e,get(t,n,o){return Q(t,n)?Te:e.get(t,n,o)},has(t,n){return Q(t,n)||e.has(t,n)}}));const Me=Object.freeze(Object.defineProperty({__proto__:null,deleteDB:Ae,openDB:re,unwrap:L,wrap:w},Symbol.toStringTag,{value:"Module"})),Ne="book-tracker-db",Fe=1;let O=null;function h(){return O||(O=re(Ne,Fe,{upgrade(e){if(!e.objectStoreNames.contains("books")){const t=e.createObjectStore("books",{keyPath:"id",autoIncrement:!0});t.createIndex("title","title"),t.createIndex("author","author"),t.createIndex("category","category"),t.createIndex("status","status"),t.createIndex("createdAt","createdAt")}if(!e.objectStoreNames.contains("reading_logs")){const t=e.createObjectStore("reading_logs",{keyPath:"id",autoIncrement:!0});t.createIndex("bookId","bookId"),t.createIndex("round","round"),t.createIndex("startDate","startDate"),t.createIndex("endDate","endDate")}}})),O}async function D(){return(await h()).getAll("books")}async function S(e){return(await h()).get("books",e)}async function ie(e){const t=await h(),n=new Date().toISOString(),o={...e,createdAt:n,updatedAt:n},a=await t.add("books",o);return{...o,id:a}}async function le(e,t){const n=await h(),o=await n.get("books",e);if(!o)throw new Error(`Book ${e} not found`);const a={...o,...t,id:e,updatedAt:new Date().toISOString()};return await n.put("books",a),a}async function de(e){const t=await h();await t.delete("books",e);const n=await B(e),o=t.transaction("reading_logs","readwrite");await Promise.all(n.map(a=>o.store.delete(a.id))),await o.done}async function Ke(e){const t=await h(),n=t.transaction("books","readwrite");await Promise.all(e.map(o=>n.store.delete(o))),await n.done;for(const o of e){const a=await B(o),r=t.transaction("reading_logs","readwrite");await Promise.all(a.map(d=>r.store.delete(d.id))),await r.done}}async function He(e){const t=await D();if(!e)return t;const n=e.toLowerCase();return t.filter(o=>o.title&&o.title.toLowerCase().includes(n)||o.author&&o.author.toLowerCase().includes(n)||o.tags&&o.tags.some(a=>a.toLowerCase().includes(n)))}async function qe(e){return(await h()).getAllFromIndex("books","status",e)}async function B(e){return(await(await h()).getAllFromIndex("reading_logs","bookId",e)).sort((o,a)=>a.round-o.round)}async function ze(e){return(await h()).get("reading_logs",e)}async function ce(e){const t=await h(),n=new Date().toISOString(),o={...e,createdAt:n,updatedAt:n},a=await t.add("reading_logs",o);return{...o,id:a}}async function We(e,t){const n=await h(),o=await n.get("reading_logs",e);if(!o)throw new Error(`Log ${e} not found`);const a={...o,...t,id:e,updatedAt:new Date().toISOString()};return await n.put("reading_logs",a),a}async function ue(e){await(await h()).delete("reading_logs",e)}async function Ve(e){const t=await B(e);return t.length===0?0:Math.max(...t.map(n=>n.round||0))}async function ge(){const e=await D(),n=await(await h()).getAll("reading_logs");return{version:1,exportedAt:new Date().toISOString(),books:e,readingLogs:n}}async function me(e,t="merge"){if(!e.books||!e.readingLogs)throw new Error("Invalid data format");const n=await h();if(t==="overwrite"){const r=n.transaction("books","readwrite"),d=await r.store.getAll();await Promise.all(d.map(l=>r.store.delete(l.id))),await r.done;const i=n.transaction("reading_logs","readwrite"),s=await i.store.getAll();await Promise.all(s.map(l=>i.store.delete(l.id))),await i.done}const o=n.transaction("books","readwrite");for(const r of e.books)t==="merge"?r.id&&await n.get("books",r.id)||await o.store.add(r):await o.store.add(r);await o.done;const a=n.transaction("reading_logs","readwrite");for(const r of e.readingLogs)t==="merge"?r.id&&await n.get("reading_logs",r.id)||await a.store.add(r):await a.store.add(r);await a.done}async function Je(e){const n=(await Ue("reading_logs")).filter(o=>{const a=o.endDate||o.startDate;return a&&a.startsWith(String(e))});return{total:n.length,done:n.filter(o=>o.status==="done").length}}async function Ue(e){return(await h()).getAll(e)}const Ye=Object.freeze(Object.defineProperty({__proto__:null,addBook:ie,addReadingLog:ce,deleteBook:de,deleteBooks:Ke,deleteReadingLog:ue,exportAllData:ge,getAllBooks:D,getBook:S,getBooksByStatus:qe,getMaxRound:Ve,getReadingLog:ze,getReadingLogsByBook:B,getYearlyStats:Je,importAllData:me,searchBooks:He,updateBook:le,updateReadingLog:We},Symbol.toStringTag,{value:"Module"})),fe=[{hash:"home",label:"书架",icon:"📚"},{hash:"stats",label:"统计",icon:"📊"},{hash:"settings",label:"设置",icon:"⚙️"}];function pe(e,t){return e==="home"?t==="home"||t===""||(t==null?void 0:t.startsWith("book")):t===e}function be(e){var n;const t=e||((n=b.currentRoute)==null?void 0:n.path)||"home";return`
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-3xl mx-auto px-4">
        <div class="flex items-center justify-between h-14">
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-bold text-indigo-600 select-none">📖 读书笔记</h1>
          </div>
          <!-- Desktop nav -->
          <nav class="hidden md:flex gap-1">
            ${fe.map(o=>{const a=pe(o.hash,t);return`<button
                class="nav-btn px-3 py-1.5 rounded-lg text-sm transition-all select-none relative ${a?"bg-indigo-100 text-indigo-700 font-medium shadow-sm":"text-gray-500 hover:bg-gray-100"}"
                data-nav="${o.hash}"
              >${o.icon} ${o.label}${a?'<span class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-600 rounded-full"></span>':""}</button>`}).join("")}
          </nav>
        </div>
      </div>
    </header>
  `}function he(e){var n;const t=e||((n=b.currentRoute)==null?void 0:n.path)||"home";return`
    <nav id="mobile-nav" class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 safe-area-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div class="flex flex-nowrap items-stretch justify-around h-14 px-1 overflow-visible">
        ${fe.map(o=>{const a=pe(o.hash,t);return`<button
            class="nav-btn flex flex-col items-center justify-center flex-1 flex-shrink-0 min-w-0 h-full transition-all select-none py-1 relative"
            data-nav="${o.hash}"
          >
            <span class="text-xl leading-none mb-0.5">${o.icon}</span>
            <span class="text-[10px] font-medium whitespace-nowrap ${a?"text-indigo-600":"text-gray-400"}">${o.label}</span>
            ${a?'<span class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-600 rounded-full"></span>':""}
          </button>`}).join("")}
      </div>
    </nav>
  `}function ye(){document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{b.navigate(e.dataset.nav)})})}b.onNavigate=e=>{const t=document.querySelector("#app-top-header"),n=document.querySelector("#app-bottom-nav");t&&(t.innerHTML=be(e)),n&&(n.innerHTML=he(e)),ye()};function Z(e){if(!e)return"";const t=new Date(e);return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`}function xe(){return new Date().getFullYear()}function K(e){return{wish:"想读",reading:"在读",done:"已读"}[e]||e}function Ge(e){return{wish:"bg-amber-100 text-amber-800",reading:"bg-blue-100 text-blue-800",done:"bg-green-100 text-green-800"}[e]||"bg-gray-100 text-gray-800"}function H(e){return e?"★".repeat(e)+"☆".repeat(5-e):""}const Qe=[{category:"小说",keywords:["小说","长篇","短篇","故事集","三部曲","文集","选集","全集"]},{category:"技术",keywords:["编程","技术","算法","架构","设计模式","代码","程序","软件","计算机","AI","人工智能","数据","网络","安全","数据库","Python","Java","JavaScript","前端","后端","Go","Rust","C++","Linux","机器学习","深度学习","云计算","区块链"]},{category:"历史",keywords:["历史","史记","王朝","战争","文明","帝国","古代","近代","革命","史","考古","传记","回忆录","年谱"]},{category:"哲学",keywords:["哲学","思想","逻辑","存在","本质","伦理","形而上学","认识论","方法论","辩证法"]},{category:"科学",keywords:["科学","物理","化学","生物","数学","天文","地理","自然","物种","进化","基因","量子","宇宙"]},{category:"艺术",keywords:["艺术","设计","摄影","绘画","音乐","电影","美学","创意","视觉","色彩","建筑","雕塑","书法"]},{category:"生活",keywords:["生活","心理","成长","理财","健康","养生","美食","旅行","情感","社交","沟通","管理","职场","励志","自我","习惯","幸福","冥想"]},{category:"经济",keywords:["经济","商业","管理","营销","投资","金融","市场","战略","创业","财务","会计","贸易","股票","基金"]},{category:"教育",keywords:["教育","学习","教学","课程","考试","培训","教材","教辅","词典","词汇","语法"]}];function Ze(e,t){const n=((e||"")+" "+(t||"")).toLowerCase();for(const o of Qe)if(o.keywords.some(a=>n.includes(a)))return o.category;return"其他"}function I(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}const Xe=[{value:"date-desc",label:"最新添加"},{value:"date-asc",label:"最早添加"},{value:"title-asc",label:"书名 A-Z"},{value:"title-desc",label:"书名 Z-A"},{value:"rating-desc",label:"评分最高"},{value:"rating-asc",label:"评分最低"}];function et(e,t){const n=[...e];switch(t){case"date-desc":return n.sort((o,a)=>new Date(a.createdAt||0)-new Date(o.createdAt||0));case"date-asc":return n.sort((o,a)=>new Date(o.createdAt||0)-new Date(a.createdAt||0));case"title-asc":return n.sort((o,a)=>(o.title||"").localeCompare(a.title||"","zh-CN"));case"title-desc":return n.sort((o,a)=>(a.title||"").localeCompare(o.title||"","zh-CN"));case"rating-desc":return n.sort((o,a)=>(a.rating||0)-(o.rating||0));case"rating-asc":return n.sort((o,a)=>(o.rating||0)-(a.rating||0));default:return n}}function ve(){const e=x.state.filter,t=x.state.searchQuery,n=x.state.sortBy||"date-desc";localStorage.getItem("book-sort");const o=n;let a=x.state.books.filter(r=>!(e!=="all"&&r.status!==e||t&&!`${r.title} ${r.author}`.toLowerCase().includes(t.toLowerCase())));return a=et(a,o),`
    <div class="page-enter max-w-3xl mx-auto px-4 py-4">
      <!-- Search & Filter Bar -->
      <div class="flex gap-2 mb-2">
        <input type="text" id="search-input" placeholder="搜索书名、作者..."
          class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          value="${$(t)}" />
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
            ${Xe.map(r=>`<option value="${r.value}" ${o===r.value?"selected":""}>${r.label}</option>`).join("")}
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
          ${a.map(r=>tt(r)).join("")}
        </div>
      `}

      <!-- FAB -->
      <button id="add-book-btn" class="fab-btn fixed bottom-24 md:bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-indigo-700 active:scale-90 transition-transform z-[60] select-none">
        +
      </button>
    </div>
  `}function tt(e){return`
    <div class="book-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer active:scale-[0.97] transition-transform select-none"
         data-book-id="${e.id}">
      <div class="aspect-[3/4] bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
        ${e.cover?`<img src="${e.cover}" alt="${$(e.title)}" class="w-full h-full object-cover" />`:'<span class="text-4xl">📕</span>'}
        <span class="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full ${Ge(e.status)} shadow-sm">${K(e.status)}</span>
      </div>
      <div class="p-2.5">
        <p class="text-sm font-medium text-gray-900 truncate leading-tight">${$(e.title)}</p>
        <p class="text-xs text-gray-500 truncate mt-0.5">${$(e.author||"")}</p>
        ${e.rating?`<p class="text-xs text-amber-500 mt-1">${H(e.rating)}</p>`:""}
      </div>
    </div>
  `}function we(){const e=document.getElementById("search-input"),t=document.getElementById("status-filter"),n=document.getElementById("sort-select");let o;e&&e.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(()=>{x.setState("searchQuery",e.value)},300)}),t&&t.addEventListener("change",()=>{x.setState("filter",t.value)}),n&&n.addEventListener("change",()=>{localStorage.setItem("book-sort",n.value),x.setState("sortBy",n.value)}),document.querySelectorAll("[data-book-id]").forEach(r=>{r.addEventListener("click",()=>{r.style.transform="scale(0.95)",setTimeout(()=>{b.navigate(`book/${r.dataset.bookId}`)},100)})});const a=document.getElementById("add-book-btn");a&&a.addEventListener("click",()=>{var r;(r=document.getElementById("add-book-btn"))==null||r.classList.add("scale-90"),setTimeout(()=>{b.navigate("book/new")},100)})}function $(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}const nt="modulepreload",ot=function(e,t){return new URL(e,t).href},X={},q=function(t,n,o){let a=Promise.resolve();if(n&&n.length>0){const d=document.getElementsByTagName("link"),i=document.querySelector("meta[property=csp-nonce]"),s=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));a=Promise.allSettled(n.map(l=>{if(l=ot(l,o),l in X)return;X[l]=!0;const c=l.endsWith(".css"),u=c?'[rel="stylesheet"]':"";if(!!o)for(let p=d.length-1;p>=0;p--){const y=d[p];if(y.href===l&&(!c||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${u}`))return;const g=document.createElement("link");if(g.rel=c?"stylesheet":nt,c||(g.as="script"),g.crossOrigin="",g.href=l,s&&g.setAttribute("nonce",s),document.head.appendChild(g),c)return new Promise((p,y)=>{g.addEventListener("load",p),g.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(d){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=d,window.dispatchEvent(i),!i.defaultPrevented)throw d}return a.then(d=>{for(const i of d||[])i.status==="rejected"&&r(i.reason);return t().catch(r)})};function at(){const e=E||[],t=xe(),n=e.filter(s=>s.status==="done"),o=n.length,a=n.filter(s=>s.rating).length?(n.filter(s=>s.rating).reduce((s,l)=>s+l.rating,0)/n.filter(s=>s.rating).length).toFixed(1):"—",r={};e.forEach(s=>{r[s.category||"其他"]=(r[s.category||"其他"]||0)+1});const d=Object.entries(r).sort((s,l)=>l[1]-s[1]),i=Array(12).fill(0);return n.forEach(s=>{(F[s.id]||[]).filter(c=>c.status==="done"&&c.endDate).forEach(c=>{const u=new Date(c.endDate).getMonth();new Date(c.endDate).getFullYear()===t&&i[u]++})}),e.filter(s=>s.status==="wish").length,e.filter(s=>s.status==="reading").length,`
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
          ${d.map(([s,l])=>`
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">${s}</span>
              <div class="flex items-center gap-2">
                <div class="w-32 bg-gray-100 rounded-full h-2">
                  <div class="bg-indigo-500 h-2 rounded-full" style="width: ${(l/e.length*100).toFixed(0)}%"></div>
                </div>
                <span class="text-xs text-gray-500 w-6 text-right">${l}</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `}let E=null,F={};async function rt(){E=await D();const e=Array(12).fill(0),t=E.filter(s=>s.status==="done"),n=xe(),o=[];for(const s of E){const l=await B(s.id);F[s.id]=l,o.push(...l)}t.forEach(s=>{(F[s.id]||[]).filter(c=>c.status==="done"&&c.endDate).forEach(c=>{const u=new Date(c.endDate).getMonth();new Date(c.endDate).getFullYear()===n&&e[u]++})});const a=(await q(async()=>{const{default:s}=await import("./chart-CnQqxsCx.js");return{default:s}},[],import.meta.url)).default,r=document.getElementById("monthly-chart");r&&new a(r,{type:"line",data:{labels:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],datasets:[{label:"读完数",data:e,borderColor:"#4f46e5",backgroundColor:"rgba(79,70,229,0.1)",fill:!0,tension:.3,pointRadius:3}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,ticks:{stepSize:1}}}}});const d=document.getElementById("category-chart");if(d){const s={};E.forEach(u=>{s[u.category||"其他"]=(s[u.category||"其他"]||0)+1});const l=Object.entries(s),c=["#4f46e5","#f59e0b","#10b981","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316","#6366f1"];new a(d,{type:"doughnut",data:{labels:l.map(u=>u[0]),datasets:[{data:l.map(u=>u[1]),backgroundColor:c.slice(0,l.length)}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom",labels:{boxWidth:10,padding:8,font:{size:10}}}}}})}const i=document.getElementById("status-chart");if(i){const s=E.filter(u=>u.status==="wish").length,l=E.filter(u=>u.status==="reading").length,c=E.filter(u=>u.status==="done").length;new a(i,{type:"doughnut",data:{labels:["想读","在读","已读"],datasets:[{data:[s,l,c],backgroundColor:["#f59e0b","#3b82f6","#10b981"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom",labels:{boxWidth:10,padding:8,font:{size:10}}}}}})}}function m(e,t="info",n=3e3){const o={info:"bg-blue-500",success:"bg-green-500",warning:"bg-amber-500",error:"bg-red-500"},a=document.createElement("div");a.className=`toast-enter fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white text-sm shadow-lg ${o[t]||o.info} max-w-xs`,a.textContent=e,document.body.appendChild(a),setTimeout(()=>{a.style.opacity="0",a.style.transition="opacity 0.3s",setTimeout(()=>a.remove(),300)},n)}function z(){try{const e=localStorage.getItem("ocr-config");return e?JSON.parse(e):null}catch{return null}}async function st(e){const t=z();if(!t||!t.apiKey||!t.secretKey)throw new Error("请先在设置中配置 OCR API");t.provider;const n=await fetch("https://ocr.cn-shanghai.aliyuncs.com/",{method:"POST",headers:{"Content-Type":"application/json",Authorization:t.apiKey,"x-ocr-secret":t.secretKey},body:JSON.stringify({image:e,type:"General"})});if(!n.ok)throw new Error(`阿里云 OCR 请求失败: ${n.status}`);const o=await n.json();return it(o)}function it(e){var o;const t=((o=e==null?void 0:e.data)==null?void 0:o.content)||(e==null?void 0:e.content)||[],n=Array.isArray(t)?t.join(`
`):typeof t=="string"?t:"";return Ee(n)}async function lt(e){const t=z();if(!t||!t.apiKey||!t.secretKey)throw new Error("请先在设置中配置 OCR API");const n=await fetch(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${t.apiKey}&client_secret=${t.secretKey}`,{method:"POST"});if(!n.ok)throw new Error("百度 token 获取失败");const o=await n.json(),a=o.access_token;if(!a)throw new Error("百度 token 无效: "+JSON.stringify(o));const r=new URLSearchParams;r.append("image",e),r.append("detect_direction","true");const d=await fetch(`https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${a}`,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:r.toString()});if(!d.ok){const s=await d.text();throw new Error(`百度 OCR 请求失败: ${d.status} - ${s}`)}const i=await d.json();return dt(i)}function dt(e){if(e.error_msg)throw new Error(`百度 OCR 错误: ${e.error_msg}`);const n=(e.words_result||[]).map(o=>o.words).filter(Boolean).join(`
`);return Ee(n)}function Ee(e){if(!e||!e.trim())return null;const t=e.split(`
`).filter(d=>d.trim()),n=e.trim(),o=[];for(const d of t){const i=d.trim();if(i.length<2)continue;let s="",l="";const c=i.match(/《([^》]+)》\s*(著|编著|主编|编)?\s*[：: ]?\s*(.+)?/);if(c){s=c[1].trim(),l=(c[3]||"").trim(),o.push({title:s,author:l});continue}const u=i.match(/^(.+?)\s*[／/｜|—–—-]\s*(.+)$/);if(u&&(s=u[1].trim(),l=u[2].trim(),s.length<50&&!s.includes("第")&&!s.includes("页"))){o.push({title:s,author:l});continue}const f=i.match(/^(.+?)\s+(著|编著|主编|编|译|著者|作者)[：: ]\s*(.+)$/);if(f){s=f[1].trim(),l=f[3].trim(),o.push({title:s,author:l});continue}const g=i.match(/(?:ISBN[：: ]*)?((?:\d[-\s]?){10,13})/);if(g){g[1].replace(/[-\s]/g,"");continue}i.length>=2&&i.length<=50&&!i.startsWith("第")&&!i.startsWith("页")&&!/^\d+$/.test(i)&&!i.includes("http")&&o.push({title:i,author:""})}const a=new Set,r=o.filter(d=>{const i=d.title;return a.has(i)?!1:(a.add(i),!0)});return r.length===0?n.length<=60?{title:n,author:""}:null:r}async function ct(e){const t=z();if(!t||!t.apiKey||!t.secretKey)throw new Error("请先在设置页面配置 OCR API Key");let n;return t.provider==="baidu"?n=await lt(e):n=await st(e),n&&!Array.isArray(n)?[n]:n||[]}function ut(e){return new Promise((t,n)=>{const o=new FileReader;o.onload=()=>{const a=o.result.split(",")[1]||o.result;t(a)},o.onerror=()=>n(new Error("图片读取失败")),o.readAsDataURL(e)})}function ee(e,t=1024,n=.85){return new Promise(o=>{const a=new Image;a.onload=()=>{const r=document.createElement("canvas");let d=a.width,i=a.height;d>t&&(i=i*t/d,d=t),r.width=d,r.height=i,r.getContext("2d").drawImage(a,0,0,d,i),o(r.toDataURL("image/jpeg",n).split(",")[1])},a.src="data:image/jpeg;base64,"+e})}function te(e){return(e!=null&&e.id?parseInt(e.id):null)?'<div class="page-enter max-w-3xl mx-auto px-4 py-4"><p class="text-center text-gray-400">加载中...</p></div>':`
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
              ${[1,2,3,4,5].map(o=>`<button type="button" class="rating-star text-2xl text-gray-300 hover:text-amber-400" data-rating="${o}">★</button>`).join("")}
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
  `}function ne(e){const t=e!=null&&e.id?parseInt(e.id):null,n=!!t,o=document.getElementById("form-back-btn");o&&o.addEventListener("click",()=>window.history.back()),document.querySelectorAll(".rating-star").forEach(l=>{l.addEventListener("click",()=>{const c=parseInt(l.dataset.rating);document.getElementById("field-rating").value=c,document.querySelectorAll(".rating-star").forEach((u,f)=>{u.classList.toggle("text-amber-400",f<c),u.classList.toggle("text-gray-300",f>=c)})})});const a=document.getElementById("ocr-camera");a&&a.addEventListener("click",async()=>{try{const l=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}),c=document.createElement("video");c.srcObject=l,c.setAttribute("playsinline",""),c.setAttribute("autoplay",""),c.style.cssText="position:fixed;top:-9999px;left:-9999px;width:1px;height:1px",document.body.appendChild(c),await new Promise(g=>{c.onloadedmetadata=g});const u=document.getElementById("ocr-preview"),f=document.getElementById("ocr-status");u.classList.remove("hidden"),f.textContent="📸 请对准书籍拍照...",a.textContent="📷 拍照",a.onclick=()=>{const g=document.createElement("canvas");g.width=c.videoWidth,g.height=c.videoHeight,g.getContext("2d").drawImage(c,0,0),g.toBlob(async p=>{l.getTracks().forEach(y=>y.stop()),c.remove(),f.textContent="🔄 识别中...",a.textContent="📸 拍照",a.onclick=null,await i(p)},"image/jpeg",.85)}}catch(l){l.name==="NotAllowedError"?m("请允许使用摄像头权限","warning"):l.name==="NotFoundError"?m("未检测到摄像头","warning"):m("拍照启动失败: "+l.message,"error")}});const r=document.getElementById("ocr-gallery");r&&r.addEventListener("click",()=>{const l=document.createElement("input");l.type="file",l.accept="image/*",l.multiple=!0,l.onchange=async c=>{const u=Array.from(c.target.files);if(u.length===0)return;const f=document.getElementById("ocr-preview"),g=document.getElementById("ocr-status");f.classList.remove("hidden");for(let p=0;p<u.length;p++)g.textContent=`🔄 正在识别第 ${p+1}/${u.length} 张...`,await i(u[p],p>0);g.textContent="✅ 识别完成"},l.click()});const d=document.getElementById("ocr-paste");d&&d.addEventListener("click",async()=>{try{const l=await navigator.clipboard.read();let c=!1;for(const u of l){const f=u.types.find(g=>g.startsWith("image/"));if(f){const g=await u.getType(f),p=document.getElementById("ocr-preview"),y=document.getElementById("ocr-status");p.classList.remove("hidden"),y.textContent="🔄 识别中...",await i(g),y.textContent="✅ 识别完成",c=!0;break}}c||m("剪贴板中没有图片，请先截图再粘贴","warning")}catch(l){l.name==="NotAllowedError"?m("请允许剪贴板读取权限","warning"):m("粘贴读取失败: "+l.message,"error")}});async function i(l,c=!1){try{const u=await ut(l),f=await ee(u),g=await ct(f);if(!g||g.length===0){m("未识别出书籍信息，请手动输入","warning");return}const p=document.getElementById("ocr-results");c||(p.innerHTML="");let y="";for(const v of g){if(!v.title)continue;const V=v.title?Ze(v.title,v.author):"其他";y||(y=v.title,document.getElementById("field-title").value=v.title||"",document.getElementById("field-author").value=v.author||"",document.getElementById("field-category").value=V);const A=document.createElement("div");A.className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm",A.innerHTML=`
          <div>
            <span class="font-medium">${I(v.title)}</span>
            ${v.author?`<span class="text-gray-500 ml-2">${I(v.author)}</span>`:""}
            <span class="text-xs text-indigo-500 ml-2">${V}</span>
          </div>
          <span class="text-green-500 text-xs">✅ 已识别</span>
        `,p.appendChild(A)}const _=document.createElement("img");_.src="data:image/jpeg;base64,"+await ee(u,200,.6),_.className="w-full rounded-lg mt-2 max-h-32 object-contain bg-gray-50",p.appendChild(_)}catch(u){throw m("OCR 识别失败: "+u.message,"error"),u}}const s=document.getElementById("book-form");s&&s.addEventListener("submit",async l=>{l.preventDefault();const c=document.getElementById("field-title").value.trim(),u=document.getElementById("field-author").value.trim();if(!c||!u){m("请填写书名和作者","warning");return}const f={title:c,author:u,isbn:document.getElementById("field-isbn").value.trim(),category:document.getElementById("field-category").value,status:document.getElementById("field-status").value,totalPages:parseInt(document.getElementById("field-pages").value)||0,rating:parseInt(document.getElementById("field-rating").value)||0,review:document.getElementById("field-review").value.trim(),pagesRead:0,tags:[]};try{if(n)await le(t,f),m("更新成功","success"),b.navigate(`book/${t}`);else{const g=await ie(f);if(f.status!=="wish"){const{addReadingLog:p}=await q(async()=>{const{addReadingLog:y}=await Promise.resolve().then(()=>Ye);return{addReadingLog:y}},void 0,import.meta.url);await p({bookId:g.id,round:1,status:f.status,startDate:new Date().toISOString(),endDate:f.status==="done"?new Date().toISOString():null,progress:0,rating:f.rating,review:f.review,notes:""})}m("添加成功","success")}b.navigate("home")}catch(g){m("保存失败: "+g.message,"error")}})}async function gt(e){const t=await S(e);if(!t){m("书籍不存在","error"),b.navigate("home");return}document.getElementById("field-title").value=t.title||"",document.getElementById("field-author").value=t.author||"",document.getElementById("field-isbn").value=t.isbn||"",document.getElementById("field-category").value=t.category||"其他",document.getElementById("field-status").value=t.status||"wish",document.getElementById("field-pages").value=t.totalPages||"",t.rating&&(document.getElementById("field-rating").value=t.rating,document.querySelectorAll(".rating-star").forEach((n,o)=>{n.classList.toggle("text-amber-400",o<t.rating),n.classList.toggle("text-gray-300",o>=t.rating)})),document.getElementById("field-review").value=t.review||""}function mt(e){return'<div class="page-enter max-w-3xl mx-auto px-4 py-4"><p class="text-center text-gray-400">加载中...</p></div>'}async function ft(e){const t=e!=null&&e.id?parseInt(e.id):null;if(!t){m("无效的书籍ID","error"),b.navigate("home");return}const n=await S(t);if(!n){m("书籍不存在","error"),b.navigate("home");return}const o=await B(t);document.querySelector("#page-content")||document.querySelector("#app-content");const a=()=>{const r=document.querySelector("#app-content");r&&(r.innerHTML=`
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
                <span class="text-xs px-2 py-0.5 rounded-full ${Ie(n.status)}">${K(n.status)}</span>
              </div>
              ${n.rating?`<p class="text-amber-500 mt-1">${H(n.rating)}</p>`:""}
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
            ${o.map(d=>pt(d)).join("")}
          </div>
        `}
      </div>
    `)};a(),window._detailRefresh=async()=>{const r=await S(t);r&&Object.assign(n,r);const d=await B(t);o.length=0,o.push(...d),a(),oe(t,n,o)},oe(t,n,o)}function oe(e,t,n){var o,a,r,d;(o=document.getElementById("detail-back-btn"))==null||o.addEventListener("click",()=>b.navigate("home")),(a=document.getElementById("new-reading-btn"))==null||a.addEventListener("click",()=>{bt(e,n)}),(r=document.getElementById("edit-book-btn"))==null||r.addEventListener("click",()=>{b.navigate(`book/${e}/edit`)}),(d=document.getElementById("delete-book-btn"))==null||d.addEventListener("click",async()=>{confirm(`确定删除《${t.title}》及其所有阅读记录吗？`)&&(await de(e),m("已删除","success"),b.navigate("home"))}),document.querySelectorAll("[data-delete-log]").forEach(i=>{i.addEventListener("click",async()=>{const s=parseInt(i.dataset.deleteLog);confirm("确定删除这条阅读记录吗？")&&(await ue(s),m("记录已删除","success"),window._detailRefresh&&window._detailRefresh())})})}function pt(e){return`
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-semibold text-indigo-600">第 ${e.round} 刷</span>
        <span class="text-xs px-2 py-0.5 rounded-full ${Ie(e.status)}">${K(e.status)}</span>
      </div>
      <div class="flex items-center gap-3 text-xs text-gray-500">
        ${e.startDate?`<span>开始: ${Z(e.startDate)}</span>`:""}
        ${e.endDate?`<span>读完: ${Z(e.endDate)}</span>`:""}
        ${e.progress?`<span>进度: ${e.progress}%</span>`:""}
      </div>
      ${e.rating?`<p class="text-amber-500 text-sm mt-1">${H(e.rating)}</p>`:""}
      ${e.review?`<p class="text-xs text-gray-600 mt-1">${I(e.review)}</p>`:""}
      <button data-delete-log="${e.id}" class="mt-2 text-xs text-red-500 hover:text-red-700">删除</button>
    </div>
  `}function bt(e,t){var r,d,i;const o=(t.length>0?Math.max(...t.map(s=>s.round||0)):0)+1,a=document.createElement("div");a.className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center",a.innerHTML=`
    <div class="bg-white rounded-t-2xl sm:rounded-2xl p-5 w-full max-w-md max-h-[80vh] overflow-auto">
      <h3 class="font-semibold text-gray-900 mb-3">第 ${o} 刷</h3>
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
            ${[1,2,3,4,5].map(s=>`<option value="${s}">${"★".repeat(s)}${"☆".repeat(5-s)}</option>`).join("")}
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
  `,document.body.appendChild(a),(r=document.getElementById("log-status"))==null||r.addEventListener("change",s=>{document.getElementById("end-date-group").style.display=s.target.value==="done"?"block":"none"}),document.getElementById("end-date-group").style.display="none",document.getElementById("log-start").value=new Date().toISOString().split("T")[0],(d=document.getElementById("log-form-cancel"))==null||d.addEventListener("click",()=>a.remove()),a.addEventListener("click",s=>{s.target===a&&a.remove()}),(i=document.getElementById("new-log-form"))==null||i.addEventListener("submit",async s=>{s.preventDefault();const l={bookId:e,round:o,status:document.getElementById("log-status").value,startDate:document.getElementById("log-start").value?new Date(document.getElementById("log-start").value).toISOString():new Date().toISOString(),endDate:document.getElementById("log-status").value==="done"&&document.getElementById("log-end").value?new Date(document.getElementById("log-end").value).toISOString():null,rating:parseInt(document.getElementById("log-rating").value)||0,review:document.getElementById("log-review").value.trim(),progress:parseInt(document.getElementById("log-progress").value)||0,notes:""};try{await ce(l),m("添加成功","success"),a.remove(),window._detailRefresh&&window._detailRefresh()}catch(c){m("保存失败: "+c.message,"error")}})}function Ie(e){return{wish:"bg-amber-100 text-amber-800",reading:"bg-blue-100 text-blue-800",done:"bg-green-100 text-green-800"}[e]||"bg-gray-100 text-gray-800"}function ht(){return`
    <div class="page-enter max-w-3xl mx-auto px-4 py-4">
      <h2 class="text-lg font-bold mb-4">⚙️ 设置</h2>

      <!-- OCR API Config -->
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4 max-w-md mx-auto">
        <h3 class="text-sm font-semibold text-gray-700 mb-4 text-center">📸 OCR 配置</h3>
        <div class="space-y-3">
          <div>
            <label class="text-xs font-medium text-gray-600">服务商</label>
            <select id="ocr-provider" class="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white">
              <option value="aliyun">阿里云文字识别</option>
              <option value="baidu">百度通用文字识别</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">API Key / AppKey</label>
            <input id="ocr-api-key" type="text" placeholder="请输入 API Key"
              class="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Secret Key</label>
            <input id="ocr-secret-key" type="password" placeholder="请输入 Secret Key"
              class="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <button id="save-ocr-config" class="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors">
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
  `}function yt(){var t,n,o,a;const e=localStorage.getItem("ocr-config");if(e)try{const r=JSON.parse(e);document.getElementById("ocr-provider").value=r.provider||"aliyun",document.getElementById("ocr-api-key").value=r.apiKey||"",document.getElementById("ocr-secret-key").value=r.secretKey||""}catch{}(t=document.getElementById("save-ocr-config"))==null||t.addEventListener("click",()=>{const r={provider:document.getElementById("ocr-provider").value,apiKey:document.getElementById("ocr-api-key").value.trim(),secretKey:document.getElementById("ocr-secret-key").value.trim()};if(!r.apiKey||!r.secretKey){m("请填写 API Key 和 Secret Key","warning");return}localStorage.setItem("ocr-config",JSON.stringify(r)),m("配置已保存","success")}),(n=document.getElementById("export-data-btn"))==null||n.addEventListener("click",async()=>{try{const r=await ge(),d=new Blob([JSON.stringify(r,null,2)],{type:"application/json"}),i=URL.createObjectURL(d),s=document.createElement("a");s.href=i,s.download="book-tracker-backup-"+new Date().toISOString().split("T")[0]+".json",s.click(),URL.revokeObjectURL(i),m("数据已导出","success")}catch(r){m("导出失败: "+r.message,"error")}}),(o=document.getElementById("import-data-input"))==null||o.addEventListener("change",async r=>{const d=r.target.files[0];if(d){try{const i=await d.text(),s=JSON.parse(i),l=confirm(`确定要导入吗？
取消 = 合并（跳过已存在的记录）
确定 = 覆盖（清除现有数据后再导入）`)?"overwrite":"merge";await me(s,l),m("数据已"+(l==="overwrite"?"覆盖":"合并")+"导入，请刷新页面","success")}catch(i){m("导入失败: "+i.message,"error")}r.target.value=""}}),(a=document.getElementById("clear-data-btn"))==null||a.addEventListener("click",async()=>{if(!(prompt("输入 DELETE 确认清除所有数据：")!=="DELETE"||!confirm("最后一次确认！清除后数据无法恢复！")))try{const{openDB:i}=await q(async()=>{const{openDB:g}=await Promise.resolve().then(()=>Me);return{openDB:g}},void 0,import.meta.url),s=await i("book-tracker-db",1),l=s.transaction("books","readwrite"),c=await l.store.getAll();await Promise.all(c.map(g=>l.store.delete(g.id))),await l.done;const u=s.transaction("reading_logs","readwrite"),f=await u.store.getAll();await Promise.all(f.map(g=>u.store.delete(g.id))),await u.done,m("所有数据已清除","success"),location.reload()}catch(i){m("清除失败: "+i.message,"error")}})}const xt=document.getElementById("app");xt.innerHTML=`
  <div id="app-shell" class="min-h-screen flex flex-col">
    <div id="app-top-header">${be("home")}</div>
    <main id="app-content" class="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom,0px)+0.5rem)] md:pb-0"></main>
  </div>
  Z<div id="app-bottom-nav">${he("home")}</div>
`;ye();function k(e){const t=document.getElementById("app-content");t&&(t.innerHTML=e)}function W(){k(ve()),we()}x.on("filter",()=>{var e;((e=b.currentRoute)==null?void 0:e.path)==="home"&&W()});x.on("searchQuery",()=>{var e;((e=b.currentRoute)==null?void 0:e.path)==="home"&&W()});x.on("sortBy",()=>{var e;((e=b.currentRoute)==null?void 0:e.path)==="home"&&W()});async function vt(){try{const e=await D();x.setState("books",e)}catch(e){console.error("Failed to load data:",e)}}b.add("home",async()=>{await vt(),k(ve()),we()}).add("stats",async()=>{k(at()),await rt()}).add("book/new",async()=>{k(te({})),ne({})}).add("book/:id/edit",async e=>{const t=parseInt(e.id);k(te({id:t})),ne({id:t}),t&&await gt(t)}).add("book/:id",async e=>{k(mt()),await ft(e)}).add("settings",async()=>{k(ht()),yt()});document.addEventListener("paste",e=>{var t,n,o,a;if(((t=b.currentRoute)==null?void 0:t.path)==="book/new"||(o=(n=b.currentRoute)==null?void 0:n.path)!=null&&o.startsWith("book/")){const r=(a=e.clipboardData)==null?void 0:a.items;if(r){for(const d of r)if(d.type.startsWith("image/")){m("截图粘贴将在 Phase 4 实现","info");break}}}});b.start();
