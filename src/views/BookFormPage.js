import { router } from '../router.js'
import { getBook, addBook, updateBook } from '../db.js'
import { autoCategorize, escapeHtml } from '../utils.js'
import { showToast } from '../components/Toast.js'
import { recognizeImage, fileToBase64, compressImage } from '../ocr.js'

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

  // ── OCR: Camera ──
  const cameraBtn = document.getElementById('ocr-camera')
  if (cameraBtn) {
    cameraBtn.addEventListener('click', async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        // 创建一个隐藏的 video 元素拍照
        const video = document.createElement('video')
        video.srcObject = stream
        video.setAttribute('playsinline', '')
        video.setAttribute('autoplay', '')
        video.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px'
        document.body.appendChild(video)

        await new Promise(resolve => { video.onloadedmetadata = resolve })

        // 显示拍照预览
        const previewEl = document.getElementById('ocr-preview')
        const statusEl = document.getElementById('ocr-status')
        previewEl.classList.remove('hidden')
        statusEl.textContent = '📸 请对准书籍拍照...'

        // 切换按钮为拍照模式
        cameraBtn.textContent = '📷 拍照'
        cameraBtn.onclick = () => {
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          canvas.getContext('2d').drawImage(video, 0, 0)
          canvas.toBlob(async (blob) => {
            // 停止摄像头
            stream.getTracks().forEach(t => t.stop())
            video.remove()

            statusEl.textContent = '🔄 识别中...'
            cameraBtn.textContent = '📸 拍照'
            cameraBtn.onclick = null // reset

            await processImageForOCR(blob)
          }, 'image/jpeg', 0.85)
        }
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          showToast('请允许使用摄像头权限', 'warning')
        } else if (err.name === 'NotFoundError') {
          showToast('未检测到摄像头', 'warning')
        } else {
          showToast('拍照启动失败: ' + err.message, 'error')
        }
      }
    })
  }

  // ── OCR: Gallery ──
  const galleryBtn = document.getElementById('ocr-gallery')
  if (galleryBtn) {
    galleryBtn.addEventListener('click', () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.multiple = true
      input.onchange = async (e) => {
        const files = Array.from(e.target.files)
        if (files.length === 0) return

        const previewEl = document.getElementById('ocr-preview')
        const statusEl = document.getElementById('ocr-status')
        previewEl.classList.remove('hidden')

        for (let i = 0; i < files.length; i++) {
          statusEl.textContent = `🔄 正在识别第 ${i + 1}/${files.length} 张...`
          await processImageForOCR(files[i], i > 0)
        }
        statusEl.textContent = '✅ 识别完成'
      }
      input.click()
    })
  }

  // ── OCR: Paste ──
  const pasteBtn = document.getElementById('ocr-paste')
  if (pasteBtn) {
    pasteBtn.addEventListener('click', async () => {
      try {
        const items = await navigator.clipboard.read()
        let found = false
        for (const item of items) {
          const imageType = item.types.find(t => t.startsWith('image/'))
          if (imageType) {
            const blob = await item.getType(imageType)
            const previewEl = document.getElementById('ocr-preview')
            const statusEl = document.getElementById('ocr-status')
            previewEl.classList.remove('hidden')
            statusEl.textContent = '🔄 识别中...'
            await processImageForOCR(blob)
            statusEl.textContent = '✅ 识别完成'
            found = true
            break
          }
        }
        if (!found) {
          showToast('剪贴板中没有图片，请先截图再粘贴', 'warning')
        }
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          showToast('请允许剪贴板读取权限', 'warning')
        } else {
          showToast('粘贴读取失败: ' + err.message, 'error')
        }
      }
    })
  }

  // ── OCR helper: process an image blob ──
  async function processImageForOCR(blob, isAdditional = false) {
    try {
      const base64 = await fileToBase64(blob)
      const compressed = await compressImage(base64)
      const results = await recognizeImage(compressed)

      if (!results || results.length === 0) {
        showToast('未识别出书籍信息，请手动输入', 'warning')
        return
      }

      const resultsContainer = document.getElementById('ocr-results')

      // 如果已有多本书的识别结果，追加
      if (isAdditional) {
        // Just add results
      } else {
        // 首次识别：清空并填充
        resultsContainer.innerHTML = ''
      }

      let firstTitle = ''
      for (const book of results) {
        if (!book.title) continue

        const category = book.title ? autoCategorize(book.title, book.author) : '其他'

        if (!firstTitle) {
          firstTitle = book.title
          // 填充主表单
          document.getElementById('field-title').value = book.title || ''
          document.getElementById('field-author').value = book.author || ''
          document.getElementById('field-category').value = category
        }

        const card = document.createElement('div')
        card.className = 'flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm'
        card.innerHTML = `
          <div>
            <span class="font-medium">${escapeHtml(book.title)}</span>
            ${book.author ? `<span class="text-gray-500 ml-2">${escapeHtml(book.author)}</span>` : ''}
            <span class="text-xs text-indigo-500 ml-2">${category}</span>
          </div>
          <span class="text-green-500 text-xs">✅ 已识别</span>
        `
        resultsContainer.appendChild(card)
      }

      // 显示缩略图
      const img = document.createElement('img')
      img.src = 'data:image/jpeg;base64,' + (await compressImage(base64, 200, 0.6))
      img.className = 'w-full rounded-lg mt-2 max-h-32 object-contain bg-gray-50'
      resultsContainer.appendChild(img)
    } catch (err) {
      showToast('OCR 识别失败: ' + err.message, 'error')
      throw err
    }
  }

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
          router.navigate(`book/${bookId}`)
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
