import { router } from '../router.js'
import { getBook, addBook, updateBook } from '../db.js'
import { autoCategorize, escapeHtml } from '../utils.js'

import { showToast } from '../components/Toast.js'

export function renderBookFormPage(params) {
  const bookId = params?.id ? parseInt(params.id) : null
  const isEdit = !!bookId

  if (isEdit) {
    // We'll load async
    return `<div class="page-enter max-w-3xl mx-auto px-4 py-4"><p class="text-center text-gray-400">加载中...</p></div>`
  }

  return `
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
              ${[1,2,3,4,5].map(i => `<button type="button" class="rating-star text-2xl text-gray-300 hover:text-amber-400" data-rating="${i}">★</button>`).join('')}
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
  `
}

export function setupBookFormPage(params) {
  const bookId = params?.id ? parseInt(params.id) : null
  const isEdit = !!bookId

  // Back button
  const backBtn = document.getElementById('form-back-btn')
  if (backBtn) backBtn.addEventListener('click', () => window.history.back())

  // Rating stars
  document.querySelectorAll('.rating-star').forEach(btn => {
    btn.addEventListener('click', () => {
      const rating = parseInt(btn.dataset.rating)
      document.getElementById('field-rating').value = rating
      document.querySelectorAll('.rating-star').forEach((s, i) => {
        s.classList.toggle('text-amber-400', i < rating)
        s.classList.toggle('text-gray-300', i >= rating)
      })
    })
  })

  // OCR buttons (placeholder - will implement in Phase 4)
  document.getElementById('ocr-camera')?.addEventListener('click', () => {
    showToast('拍照功能将在 Phase 4 实现', 'info')
  })
  document.getElementById('ocr-gallery')?.addEventListener('click', () => {
    showToast('相册功能将在 Phase 4 实现', 'info')
  })
  document.getElementById('ocr-paste')?.addEventListener('click', () => {
    showToast('粘贴功能将在 Phase 4 实现', 'info')
  })

  // If editing, load existing data
  if (isEdit) {
    // handled in loadEditData
  }

  // Form submit
  const form = document.getElementById('book-form')
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const title = document.getElementById('field-title').value.trim()
      const author = document.getElementById('field-author').value.trim()
      if (!title || !author) {
        showToast('请填写书名和作者', 'warning')
        return
      }

      const book = {
        title,
        author,
        isbn: document.getElementById('field-isbn').value.trim(),
        category: document.getElementById('field-category').value,
        status: document.getElementById('field-status').value,
        totalPages: parseInt(document.getElementById('field-pages').value) || 0,
        rating: parseInt(document.getElementById('field-rating').value) || 0,
        review: document.getElementById('field-review').value.trim(),
        pagesRead: 0,
        tags: []
      }

      try {
        if (isEdit) {
          await updateBook(bookId, book)
          showToast('更新成功', 'success')
        } else {
          const newBook = await addBook(book)
          // If status is 'done' or 'reading', auto-create a reading log
          if (book.status !== 'wish') {
            const { addReadingLog } = await import('../db.js')
            await addReadingLog({
              bookId: newBook.id,
              round: 1,
              status: book.status,
              startDate: new Date().toISOString(),
              endDate: book.status === 'done' ? new Date().toISOString() : null,
              progress: 0,
              rating: book.rating,
              review: book.review,
              notes: ''
            })
          }
          showToast('添加成功', 'success')
        }
        router.navigate('home')
      } catch (err) {
        showToast('保存失败: ' + err.message, 'error')
      }
    })
  }
}

export async function loadEditData(bookId) {
  const book = await getBook(bookId)
  if (!book) {
    showToast('书籍不存在', 'error')
    router.navigate('home')
    return
  }
  document.getElementById('field-title').value = book.title || ''
  document.getElementById('field-author').value = book.author || ''
  document.getElementById('field-isbn').value = book.isbn || ''
  document.getElementById('field-category').value = book.category || '其他'
  document.getElementById('field-status').value = book.status || 'wish'
  document.getElementById('field-pages').value = book.totalPages || ''
  if (book.rating) {
    document.getElementById('field-rating').value = book.rating
    document.querySelectorAll('.rating-star').forEach((s, i) => {
      s.classList.toggle('text-amber-400', i < book.rating)
      s.classList.toggle('text-gray-300', i >= book.rating)
    })
  }
  document.getElementById('field-review').value = book.review || ''
}

// escapeHtml is imported from utils.js
