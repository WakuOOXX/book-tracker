import './styles/main.css'
import { router } from './router.js'
import { store } from './store.js'
import { getAllBooks } from './db.js'
import { renderTopHeader, renderBottomNav, setupHeaderEvents } from './components/Header.js'
import { renderHomePage, setupHomePage } from './views/HomePage.js'
import { renderStatsPage, setupStatsPage } from './views/StatsPage.js'
import { renderBookFormPage, setupBookFormPage, loadEditData } from './views/BookFormPage.js'
import { renderBookDetailPage, setupBookDetailPage } from './views/BookDetailPage.js'
import { renderSettingsPage, setupSettingsPage } from './views/SettingsPage.js'
import { showToast } from './components/Toast.js'

// ── App Shell — fixed layout that never re-renders ──

const app = document.getElementById('app')
app.innerHTML = `
  <div id="app-shell" class="min-h-screen flex flex-col">
    <div id="app-top-header">${renderTopHeader('home')}</div>
    <main id="app-content" class="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom,0px)+0.5rem)] md:pb-0"></main>
    <div id="app-bottom-nav" style="display:contents">${renderBottomNav('home')}</div>
  </div>
`
setupHeaderEvents()

// ── Render current page into app-content (no shell re-render) ──

function renderContent(content) {
  const contentEl = document.getElementById('app-content')
  if (contentEl) contentEl.innerHTML = content
}

// ── Re-render on state changes ──

function reRenderHome() {
  renderContent(renderHomePage())
  setupHomePage()
}

store.on('filter', () => {
  if (router.currentRoute?.path === 'home') reRenderHome()
})

store.on('searchQuery', () => {
  if (router.currentRoute?.path === 'home') reRenderHome()
})

store.on('sortBy', () => {
  if (router.currentRoute?.path === 'home') reRenderHome()
})

// ── Route Handlers ──

async function loadData() {
  try {
    const books = await getAllBooks()
    store.setState('books', books)
  } catch (err) {
    console.error('Failed to load data:', err)
  }
}

router
  .add('home', async () => {
    await loadData()
    renderContent(renderHomePage())
    setupHomePage()
  })
  .add('stats', async () => {
    renderContent(renderStatsPage())
    await setupStatsPage()
  })
  .add('book/new', async () => {
    renderContent(renderBookFormPage({}))
    setupBookFormPage({})
  })
  .add('book/:id/edit', async (params) => {
    const bookId = parseInt(params.id)
    renderContent(renderBookFormPage({ id: bookId }))
    setupBookFormPage({ id: bookId })
    if (bookId) await loadEditData(bookId)
  })
  .add('book/:id', async (params) => {
    renderContent(renderBookDetailPage(params))
    await setupBookDetailPage(params)
  })
  .add('settings', async () => {
    renderContent(renderSettingsPage())
    setupSettingsPage()
  })

// ── Keyboard shortcut: Ctrl+V for paste ──

document.addEventListener('paste', (e) => {
  if (router.currentRoute?.path === 'book/new' || router.currentRoute?.path?.startsWith('book/')) {
    const items = e.clipboardData?.items
    if (items) {
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          showToast('截图粘贴将在 Phase 4 实现', 'info')
          break
        }
      }
    }
  }
})

// ── Start ──

router.start()
