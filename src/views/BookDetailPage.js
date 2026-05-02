import { router } from '../router.js'
import { getBook, getReadingLogsByBook, addReadingLog, deleteReadingLog, deleteBook } from '../db.js'
import { formatDate, statusLabel, stars, escapeHtml } from '../utils.js'
import { showToast } from '../components/Toast.js'

export function renderBookDetailPage(params) {
  return `<div class="page-enter max-w-3xl mx-auto px-4 py-4"><p class="text-center text-gray-400">加载中...</p></div>`
}

export async function setupBookDetailPage(params) {
  const bookId = params?.id ? parseInt(params.id) : null
  if (!bookId) {
    showToast('无效的书籍ID', 'error')
    router.navigate('home')
    return
  }

  const book = await getBook(bookId)
  if (!book) {
    showToast('书籍不存在', 'error')
    router.navigate('home')
    return
  }

  const logs = await getReadingLogsByBook(bookId)
  const container = document.querySelector('#page-content') || document.querySelector('#app-content')

  // Set up page content
  const render = () => {
    const containerEl = document.querySelector('#app-content')
    if (!containerEl) return
    containerEl.innerHTML = `
      <div class="page-enter max-w-3xl mx-auto px-4 py-4">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-4">
          <button id="detail-back-btn" class="text-gray-500 hover:text-gray-700 text-xl">&larr;</button>
          <h2 class="text-lg font-bold truncate">${escapeHtml(book.title)}</h2>
        </div>

        <!-- Book Info Card -->
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <div class="flex gap-4">
            <div class="w-20 h-28 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
              ${book.cover
                ? `<img src="${book.cover}" class="w-full h-full object-cover rounded-lg" />`
                : `<span class="text-3xl">📕</span>`
              }
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900">${escapeHtml(book.title)}</h3>
              <p class="text-sm text-gray-500">${escapeHtml(book.author)}</p>
              <div class="flex flex-wrap gap-1.5 mt-2">
                <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">${book.category || '其他'}</span>
                <span class="text-xs px-2 py-0.5 rounded-full ${statusColor(book.status)}">${statusLabel(book.status)}</span>
              </div>
              ${book.rating ? `<p class="text-amber-500 mt-1">${stars(book.rating)}</p>` : ''}
              ${book.isbn ? `<p class="text-xs text-gray-400 mt-1">ISBN: ${escapeHtml(book.isbn)}</p>` : ''}
              ${book.totalPages ? `<p class="text-xs text-gray-400 mt-1">共 ${book.totalPages} 页</p>` : ''}
            </div>
          </div>
          ${book.review ? `<p class="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">${escapeHtml(book.review)}</p>` : ''}
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
          阅读记录（共 ${logs.length} 刷）
        </h3>

        ${logs.length === 0 ? `
          <div class="text-center py-8 text-gray-400">
            <p>还没有阅读记录</p>
          </div>
        ` : `
          <div class="space-y-2">
            ${logs.map(log => renderReadingLog(log)).join('')}
          </div>
        `}
      </div>
    `
  }

  // Initial render
  render()

  // Re-fetch and re-render after changes
  window._detailRefresh = async () => {
    const updatedBook = await getBook(bookId)
    if (updatedBook) {
      Object.assign(book, updatedBook)
    }
    const updatedLogs = await getReadingLogsByBook(bookId)
    logs.length = 0
    logs.push(...updatedLogs)
    render()
    setupDetailEventHandlers(bookId, book, logs)
  }

  setupDetailEventHandlers(bookId, book, logs)
}

function setupDetailEventHandlers(bookId, book, logs) {
  // Back
  document.getElementById('detail-back-btn')?.addEventListener('click', () => router.navigate('home'))

  // New reading
  document.getElementById('new-reading-btn')?.addEventListener('click', () => {
    showNewReadingForm(bookId, logs)
  })

  // Edit book
  document.getElementById('edit-book-btn')?.addEventListener('click', () => {
    router.navigate(`book/${bookId}/edit`)
  })

  // Delete book
  document.getElementById('delete-book-btn')?.addEventListener('click', async () => {
    if (confirm(`确定删除《${book.title}》及其所有阅读记录吗？`)) {
      await deleteBook(bookId)
      showToast('已删除', 'success')
      router.navigate('home')
    }
  })

  // Delete log buttons
  document.querySelectorAll('[data-delete-log]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const logId = parseInt(btn.dataset.deleteLog)
      if (confirm('确定删除这条阅读记录吗？')) {
        await deleteReadingLog(logId)
        showToast('记录已删除', 'success')
        if (window._detailRefresh) window._detailRefresh()
      }
    })
  })
}

function renderReadingLog(log) {
  return `
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-semibold text-indigo-600">第 ${log.round} 刷</span>
        <span class="text-xs px-2 py-0.5 rounded-full ${statusColor(log.status)}">${statusLabel(log.status)}</span>
      </div>
      <div class="flex items-center gap-3 text-xs text-gray-500">
        ${log.startDate ? `<span>开始: ${formatDate(log.startDate)}</span>` : ''}
        ${log.endDate ? `<span>读完: ${formatDate(log.endDate)}</span>` : ''}
        ${log.progress ? `<span>进度: ${log.progress}%</span>` : ''}
      </div>
      ${log.rating ? `<p class="text-amber-500 text-sm mt-1">${stars(log.rating)}</p>` : ''}
      ${log.review ? `<p class="text-xs text-gray-600 mt-1">${escapeHtml(log.review)}</p>` : ''}
      <button data-delete-log="${log.id}" class="mt-2 text-xs text-red-500 hover:text-red-700">删除</button>
    </div>
  `
}

function showNewReadingForm(bookId, logs) {
  const maxRound = logs.length > 0 ? Math.max(...logs.map(l => l.round || 0)) : 0
  const newRound = maxRound + 1

  const overlay = document.createElement('div')
  overlay.className = 'fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center'
  overlay.innerHTML = `
    <div class="bg-white rounded-t-2xl sm:rounded-2xl p-5 w-full max-w-md max-h-[80vh] overflow-auto">
      <h3 class="font-semibold text-gray-900 mb-3">第 ${newRound} 刷</h3>
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
            ${[1,2,3,4,5].map(i => `<option value="${i}">${'★'.repeat(i)}${'☆'.repeat(5-i)}</option>`).join('')}
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
  `
  document.body.appendChild(overlay)

  // Toggle end date visibility
  document.getElementById('log-status')?.addEventListener('change', (e) => {
    document.getElementById('end-date-group').style.display = e.target.value === 'done' ? 'block' : 'none'
  })
  document.getElementById('end-date-group').style.display = 'none'

  // Set default start date
  document.getElementById('log-start').value = new Date().toISOString().split('T')[0]

  // Cancel
  document.getElementById('log-form-cancel')?.addEventListener('click', () => overlay.remove())
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove() })

  // Submit
  document.getElementById('new-log-form')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const logData = {
      bookId,
      round: newRound,
      status: document.getElementById('log-status').value,
      startDate: document.getElementById('log-start').value
        ? new Date(document.getElementById('log-start').value).toISOString()
        : new Date().toISOString(),
      endDate: document.getElementById('log-status').value === 'done' && document.getElementById('log-end').value
        ? new Date(document.getElementById('log-end').value).toISOString()
        : null,
      rating: parseInt(document.getElementById('log-rating').value) || 0,
      review: document.getElementById('log-review').value.trim(),
      progress: parseInt(document.getElementById('log-progress').value) || 0,
      notes: ''
    }

    try {
      await addReadingLog(logData)
      showToast('添加成功', 'success')
      overlay.remove()
      if (window._detailRefresh) window._detailRefresh()
    } catch (err) {
      showToast('保存失败: ' + err.message, 'error')
    }
  })
}

function statusColor(status) {
  const map = { wish: 'bg-amber-100 text-amber-800', reading: 'bg-blue-100 text-blue-800', done: 'bg-green-100 text-green-800' }
  return map[status] || 'bg-gray-100 text-gray-800'
}

export { formatDate }
