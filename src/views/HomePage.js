import { router } from '../router.js'
import { getAllBooks, searchBooks } from '../db.js'
import { store } from '../store.js'
import { statusLabel, statusColor, formatDateShort, stars, autoCategorize } from '../utils.js'

// Sort options
const SORT_OPTIONS = [
  { value: 'date-desc', label: '最新添加' },
  { value: 'date-asc', label: '最早添加' },
  { value: 'title-asc', label: '书名 A-Z' },
  { value: 'title-desc', label: '书名 Z-A' },
  { value: 'rating-desc', label: '评分最高' },
  { value: 'rating-asc', label: '评分最低' },
]

function sortBooks(books, sortBy) {
  const sorted = [...books]
  switch (sortBy) {
    case 'date-desc':
      return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    case 'date-asc':
      return sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
    case 'title-asc':
      return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'zh-CN'))
    case 'title-desc':
      return sorted.sort((a, b) => (b.title || '').localeCompare(a.title || '', 'zh-CN'))
    case 'rating-desc':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    case 'rating-asc':
      return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0))
    default:
      return sorted
  }
}

export function renderHomePage() {
  const filter = store.state.filter
  const query = store.state.searchQuery
  const sortBy = store.state.sortBy || 'date-desc'

  // Load sort preference from localStorage
  const savedSort = localStorage.getItem('book-sort')
  const activeSort = sortBy || savedSort || 'date-desc'

  let filtered = store.state.books.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false
    if (query && !`${b.title} ${b.author}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  filtered = sortBooks(filtered, activeSort)

  return `
    <div class="page-enter max-w-3xl mx-auto px-4 py-4">
      <!-- Search & Filter Bar -->
      <div class="flex gap-2 mb-2">
        <input type="text" id="search-input" placeholder="搜索书名、作者..."
          class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          value="${escapeHtml(query)}" />
        <select id="status-filter"
          class="px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%3E%3Cpath%20d%3D%22M3%204.5l3%203%203-3%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center] pr-8">
          <option value="all" ${filter === 'all' ? 'selected' : ''}>全部</option>
          <option value="wish" ${filter === 'wish' ? 'selected' : ''}>想读</option>
          <option value="reading" ${filter === 'reading' ? 'selected' : ''}>在读</option>
          <option value="done" ${filter === 'done' ? 'selected' : ''}>已读</option>
        </select>
      </div>

      <!-- Sort & Count Row -->
      <div class="flex items-center justify-between mb-3">
        <p class="text-sm text-gray-500">共 ${filtered.length} 本</p>
        <div class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M3 12h18M3 20h18"/>
          </svg>
          <select id="sort-select"
            class="text-xs border-0 bg-transparent text-gray-500 focus:outline-none focus:ring-0 appearance-none pr-4 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%2210%22%3E%3Cpath%20d%3D%22M2%203.5l3%203%203-3%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0_center]">
            ${SORT_OPTIONS.map(opt =>
              `<option value="${opt.value}" ${activeSort === opt.value ? 'selected' : ''}>${opt.label}</option>`
            ).join('')}
          </select>
        </div>
      </div>

      <!-- Book Grid -->
      ${filtered.length === 0 ? `
        <div class="text-center py-16 text-gray-400">
          <p class="text-5xl mb-4">📖</p>
          <p class="text-lg mb-2">${query ? '没有匹配的书籍' : '还没有书记录'}</p>
          <p class="text-sm">${query ? '试试换个关键词搜索' : '点击右下角 + 按钮添加'}</p>
        </div>
      ` : `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          ${filtered.map(book => renderBookCard(book)).join('')}
        </div>
      `}

      <!-- FAB -->
      <button id="add-book-btn" class="fab-btn fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-indigo-700 active:scale-90 transition-transform z-30 select-none">
        +
      </button>
    </div>
  `
}

function renderBookCard(book) {
  return `
    <div class="book-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer active:scale-[0.97] transition-transform select-none"
         data-book-id="${book.id}">
      <div class="aspect-[3/4] bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
        ${book.cover
          ? `<img src="${book.cover}" alt="${escapeHtml(book.title)}" class="w-full h-full object-cover" />`
          : `<span class="text-4xl">📕</span>`
        }
        <span class="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full ${statusColor(book.status)} shadow-sm">${statusLabel(book.status)}</span>
      </div>
      <div class="p-2.5">
        <p class="text-sm font-medium text-gray-900 truncate leading-tight">${escapeHtml(book.title)}</p>
        <p class="text-xs text-gray-500 truncate mt-0.5">${escapeHtml(book.author || '')}</p>
        ${book.rating ? `<p class="text-xs text-amber-500 mt-1">${stars(book.rating)}</p>` : ''}
      </div>
    </div>
  `
}

export function setupHomePage() {
  // Search with debounce
  const searchInput = document.getElementById('search-input')
  const statusFilter = document.getElementById('status-filter')
  const sortSelect = document.getElementById('sort-select')
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

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      localStorage.setItem('book-sort', sortSelect.value)
      store.setState('sortBy', sortSelect.value)
    })
  }

  // Book card clicks
  document.querySelectorAll('[data-book-id]').forEach(el => {
    el.addEventListener('click', () => {
      // Add subtle transition hint
      el.style.transform = 'scale(0.95)'
      setTimeout(() => {
        router.navigate(`book/${el.dataset.bookId}`)
      }, 100)
    })
  })

  // Add book
  const addBtn = document.getElementById('add-book-btn')
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      document.getElementById('add-book-btn')?.classList.add('scale-90')
      setTimeout(() => {
        router.navigate('book/new')
      }, 100)
    })
  }
}

function escapeHtml(str) {
  if (!str) return ''
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
