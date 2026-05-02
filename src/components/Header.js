import { router } from '../router.js'
import { store } from '../store.js'

const NAV_ITEMS = [
  { hash: 'home', label: '书架', icon: '📚' },
  { hash: 'stats', label: '统计', icon: '📊' },
  { hash: 'settings', label: '设置', icon: '⚙️' }
]

/**
 * Desktop: top header nav
 * Mobile: bottom tab bar (fixed)
 * Detected by tailwind breakpoints
 */
export function renderHeader() {
  const currentPath = router.currentRoute?.path || 'home'

  return `
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-3xl mx-auto px-4">
        <div class="flex items-center justify-between h-14">
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-bold text-indigo-600 select-none">📖 读书笔记</h1>
          </div>
          <!-- Desktop nav (hidden on mobile, shown on md+) -->
          <nav class="hidden md:flex gap-1">
            ${NAV_ITEMS.map(item => {
              const isActive = currentPath === item.hash || (item.hash === 'home' && currentPath === 'home')
              return `<button
                class="nav-btn px-3 py-1.5 rounded-lg text-sm transition-all select-none
                  ${isActive ? 'bg-indigo-100 text-indigo-700 font-medium shadow-sm' : 'text-gray-500 hover:bg-gray-100'}"
                data-nav="${item.hash}"
              >${item.icon} ${item.label}</button>`
            }).join('')}
          </nav>
        </div>
      </div>
    </header>
    <!-- Mobile bottom nav (hidden on md+, shown on mobile) -->
    <nav id="mobile-bottom-nav" class="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <div class="flex items-center justify-around h-14 px-2">
        ${NAV_ITEMS.map(item => {
          const isActive = currentPath === item.hash || (item.hash === 'home' && currentPath === 'home')
          return `<button
            class="nav-btn flex flex-col items-center justify-center flex-1 h-full rounded-lg transition-all select-none
              ${isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}"
            data-nav="${item.hash}"
          >
            <span class="text-xl leading-none">${item.icon}</span>
            <span class="text-[10px] mt-0.5 font-medium ${isActive ? 'text-indigo-600' : 'text-gray-400'}">${item.label}</span>
            ${isActive ? '<span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-indigo-600 rounded-full"></span>' : ''}
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

// Listen for route changes to update header active state
router.onNavigate = () => {
  const headerEl = document.querySelector('#app-header')
  if (headerEl) {
    headerEl.innerHTML = renderHeader()
    setupHeaderEvents()
  }
}
