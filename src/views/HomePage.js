import { router } from '../router.js'
import { getAllBooks, searchBooks } from '../db.js'
import { store } from '../store.js'
import { statusLabel, statusColor, formatDateShort, stars, autoCategorize } from '../utils.js'

export function renderHomePage() {
  const filter = store.state.filter
  const query = store.state.searchQuery
  const filtered = store.state.books.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false
    if (query && !`${b.title} ${b.author}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  return `
    <div class="page-enter max-w-3xl mx-auto px-4 py-4">
      <!-- Search & Filter -->
      <div class="flex gap-2 mb-4">
        <input type="text" id="search-input" placeholder="搜索书名、作者..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          value="${escapeHtml(query)}" />
        <select id="status-filter" class="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <option value="all" ${filter === 'all' ? 'selected' : ''}>全部</option>
          <option value="wish" ${filter === 'wish' ? 'selected' : ''}>想读</option>
          <option value="reading" ${filter === 'reading' ? 'selected' : ''}>在读</option>
          <option value="done" ${filter === 'done' ? 'selected' : ''}>已读</option>
        </select>
      </div>

      <!-- Book count -->
      <p class="text-sm text-gray-500 mb-3">共 ${filtered.length} 本书</p>

      <!-- Book Grid -->
      ${filtered.length === 0 ? `
        <div class="text-center py-20 text-gray-400">
          <p class="text-5xl mb-4">📖</p>
          <p class="text-lg mb-2">还没有书记录</p>
          <p class="text-sm">点击右下角 + 按钮添加</p>
        </div>
      ` : `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          ${filtered.map(book => renderBookCard(book)).join('')}
        </div>
      `}

      <!-- FAB -->
      <button id="add-book-btn" class="fab-btn fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-indigo-700 z-30">
        +
      </button>
    </div>
  `
}

function renderBookCard(book) {
  return `
    <div class="book-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
         data-book-id="${book.id}">
      <div class="aspect-[3/4] bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center relative">
        ${book.cover
          ? `<img src="${book.cover}" alt="${escapeHtml(book.title)}" class="w-full h-full object-cover" />`
          : `<span class="text-4xl">📕</span>`
        }
        <span class="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full ${statusColor(book.status)}">${statusLabel(book.status)}</span>
      </div>
      <div class="p-2.5">
        <p class="text-sm font-medium text-gray-900 truncate">${escapeHtml(book.title)}</p>
        <p class="text-xs text-gray-500 truncate">${escapeHtml(book.author || '')}</p>
        ${book.rating ? `<p class="text-xs text-amber-500 mt-0.5">${stars(book.rating)}</p>` : ''}
      </div>
    </div>
  `
}

export function setupHomePage() {
  // Search with debounce
  const searchInput = document.getElementById('search-input')
  const statusFilter = document.getElementById('status-filter')
  let searchTimer

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
        store.setState('searchQuery', searchInput.value)
      }, 300)
    })
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      store.setState('filter', statusFilter.value)
    })
  }

  // Book card clicks
  document.querySelectorAll('[data-book-id]').forEach(el => {
    el.addEventListener('click', () => {
      router.navigate(`book/${el.dataset.bookId}`)
    })
  })

  // Add book
  const addBtn = document.getElementById('add-book-btn')
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      router.navigate('book/new')
    })
  }
}

function escapeHtml(str) {
  if (!str) return ''
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
