import './styles/main.css'
import { router } from './router.js'
import { store } from './store.js'
import { getAllBooks } from './db.js'
import { renderHeader, setupHeaderEvents } from './components/Header.js'
import { renderHomePage, setupHomePage } from './views/HomePage.js'
import { renderStatsPage, setupStatsPage } from './views/StatsPage.js'
import { renderBookFormPage, setupBookFormPage, loadEditData } from './views/BookFormPage.js'
import { renderBookDetailPage, setupBookDetailPage } from './views/BookDetailPage.js'
import { renderSettingsPage, setupSettingsPage } from './views/SettingsPage.js'
import { showToast } from './components/Toast.js'
import { autoCategorize } from './utils.js'

// ── App Shell ──

const app = document.getElementById('app')
app.className = 'min-h-screen flex flex-col'

function renderShell(content) {
  app.innerHTML = `
    <div id="app-header">${renderHeader()}</div>
    <main id="app-content" class="flex-1 pb-20">
      ${content}
    </main>
  `
  setupHeaderEvents()
}

// ── Re-render on state changes ──

function reRenderHome() {
  renderShell(renderHomePage())
  setupHomePage()
}

store.on('filter', () => {
  if (router.currentRoute?.path === 'home') {
    reRenderHome()
  }
})

store.on('searchQuery', () => {
  if (router.currentRoute?.path === 'home') {
    reRenderHome()
  }
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
  .add('home', async (params) => {
    await loadData()
    renderShell(renderHomePage())
    setupHomePage()
  })
  .add('stats', async (params) => {
    renderShell(renderStatsPage())
    await setupStatsPage()
  })
  .add('book/new', async (params) => {
    renderShell(renderBookFormPage({}))
    setupBookFormPage({})
  })
  .add('book/:id/edit', async (params) => {
    const bookId = parseInt(params.id)
    // For editing, we reuse BookFormPage but we need a modified version
    // For now redirect to new with book ID - simplified approach
    renderShell(renderBookFormPage({ id: bookId }))
    setupBookFormPage({ id: bookId })
    if (bookId) {
      await loadEditData(bookId)
    }
  })
  .add('book/:id', async (params) => {
    renderShell(renderBookDetailPage(params))
    await setupBookDetailPage(params)
  })
  .add('settings', async (params) => {
    renderShell(renderSettingsPage())
    setupSettingsPage()
  })

// ── Keyboard shortcut: Ctrl+V for paste ──

document.addEventListener('paste', (e) => {
  // Check if we're on the book form page
  if (router.currentRoute?.path === 'book/new' || router.currentRoute?.path?.startsWith('book/')) {
    // OCR paste will be implemented in Phase 4
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
