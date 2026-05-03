import { router } from '../router.js'
import { store } from '../store.js'

const NAV_ITEMS = [
  { hash: 'home', label: '书架', icon: '📚' },
  { hash: 'stats', label: '统计', icon: '📊' },
  { hash: 'settings', label: '设置', icon: '⚙️' }
]

function isActive(hash, currentPath) {
  if (hash === 'home') {
    return currentPath === 'home' || currentPath === '' || currentPath?.startsWith('book')
  }
  return currentPath === hash
}

export function renderTopHeader() {
  const currentPath = router.currentRoute?.path || 'home'
  return `
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-3xl mx-auto px-4">
        <div class="flex items-center justify-between h-14">
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-bold text-indigo-600 select-none">📖 读书笔记</h1>
          </div>
          <!-- Desktop nav -->
          <nav class="hidden md:flex gap-1">
            ${NAV_ITEMS.map(item => {
              const active = isActive(item.hash, currentPath)
              return `<button
                class="nav-btn px-3 py-1.5 rounded-lg text-sm transition-all select-none ${active ? 'bg-indigo-100 text-indigo-700 font-medium shadow-sm' : 'text-gray-500 hover:bg-gray-100'}"
                data-nav="${item.hash}"
              >${item.icon} ${item.label}</button>`
            }).join('')}
          </nav>
        </div>
      </div>
    </header>
  `
}

export function renderBottomNav() {
  const currentPath = router.currentRoute?.path || 'home'
  return `
    <nav id="mobile-nav" class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 safe-area-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div class="flex items-center justify-around h-14 px-2">
        ${NAV_ITEMS.map(item => {
          const active = isActive(item.hash, currentPath)
          return `<button
            class="nav-btn flex flex-col items-center justify-center flex-1 h-full transition-all select-none py-1 relative"
            data-nav="${item.hash}"
          >
            <span class="text-xl leading-none mb-0.5">${item.icon}</span>
            <span class="text-[10px] font-medium ${active ? 'text-indigo-600' : 'text-gray-400'}">${item.label}</span>
            ${active ? '<span class="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-indigo-600 rounded-full"></span>' : ''}
          </button>`
        }).join('')}
      </div>
    </nav>
  `
}

export function setupHeaderEvents() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      router.navigate(btn.dataset.nav)
    })
  })
}

// Only re-render header/nav when route changes
router.onNavigate = () => {
  const topEl = document.querySelector('#app-top-header')
  const navEl = document.querySelector('#app-bottom-nav')
  if (topEl) topEl.innerHTML = renderTopHeader()
  if (navEl) navEl.innerHTML = renderBottomNav()
  setupHeaderEvents()
}
