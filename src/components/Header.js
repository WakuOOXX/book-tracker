import { router } from '../router.js'
import { store } from '../store.js'

const NAV_ITEMS = [
  { hash: 'home', label: '书架', icon: '📚' },
  { hash: 'stats', label: '统计', icon: '📊' },
  { hash: 'settings', label: '设置', icon: '⚙️' }
]

export function renderHeader() {
  const currentPath = router.currentRoute?.path || 'home'
  return `
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-3xl mx-auto px-4">
        <div class="flex items-center justify-between h-14">
          <h1 class="text-lg font-bold text-indigo-600">📖 读书笔记</h1>
          <nav class="flex gap-1">
            ${NAV_ITEMS.map(item => {
              const isActive = currentPath === item.hash || (item.hash === 'home' && !currentPath)
              return `<button
                class="nav-btn px-3 py-1.5 rounded-lg text-sm transition-colors
                  ${isActive ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-500 hover:bg-gray-100'}"
                data-nav="${item.hash}"
              >${item.icon} ${item.label}</button>`
            }).join('')}
          </nav>
        </div>
      </div>
    </header>
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
