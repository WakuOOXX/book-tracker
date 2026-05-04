import { showToast } from '../components/Toast.js'
import { exportAllData, importAllData } from '../db.js'

export function renderSettingsPage() {
  return `
    <div class="page-enter max-w-3xl mx-auto px-4 py-4">
      <h2 class="text-lg font-bold mb-4">⚙️ 设置</h2>

      <!-- OCR API Config -->
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4 max-w-md mx-auto">
        <h3 class="text-sm font-semibold text-gray-700 mb-4 text-center">📸 OCR 配置</h3>
        <div class="space-y-3">
          <div>
            <label class="text-xs font-medium text-gray-600">服务商</label>
            <select id="ocr-provider" class="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white">
              <option value="aliyun">阿里云文字识别</option>
              <option value="baidu">百度通用文字识别</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">API Key / AppKey</label>
            <input id="ocr-api-key" type="text" placeholder="请输入 API Key"
              class="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600">Secret Key</label>
            <input id="ocr-secret-key" type="password" placeholder="请输入 Secret Key"
              class="w-full mt-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <button id="save-ocr-config" class="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors">
            保存配置
          </button>
        </div>
      </div>

      <!-- Data Management -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">💾 数据管理</h3>
        <div class="space-y-2">
          <button id="export-data-btn" class="w-full py-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 border border-green-200">
            📥 导出数据（JSON）
          </button>
          <label class="block w-full py-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 border border-blue-200 cursor-pointer text-center">
            📤 导入数据（JSON）
            <input type="file" id="import-data-input" accept=".json" class="hidden" />
          </label>
        </div>
      </div>

      <!-- Clear Data -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-red-100 mb-4">
        <h3 class="text-sm font-semibold text-red-700 mb-3">⚠️ 危险操作</h3>
        <button id="clear-data-btn" class="w-full py-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 border border-red-200">
          🗑️ 清除所有数据
        </button>
        <p class="text-xs text-gray-400 mt-2">建议先导出备份再清除，此操作不可恢复</p>
      </div>

      <!-- About -->
      <div class="text-center text-xs text-gray-400 py-4">
        <p>📖 读书笔记 v1.2</p>
        <p>数据仅存储在本地浏览器</p>
      </div>
    </div>
  `
}

export function setupSettingsPage() {
  // Load saved config
  const savedConfig = localStorage.getItem('ocr-config')
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig)
      document.getElementById('ocr-provider').value = config.provider || 'aliyun'
      document.getElementById('ocr-api-key').value = config.apiKey || ''
      document.getElementById('ocr-secret-key').value = config.secretKey || ''
    } catch (e) {}
  }

  // Save config
  document.getElementById('save-ocr-config')?.addEventListener('click', () => {
    const config = {
      provider: document.getElementById('ocr-provider').value,
      apiKey: document.getElementById('ocr-api-key').value.trim(),
      secretKey: document.getElementById('ocr-secret-key').value.trim()
    }
    if (!config.apiKey || !config.secretKey) {
      showToast('请填写 API Key 和 Secret Key', 'warning')
      return
    }
    localStorage.setItem('ocr-config', JSON.stringify(config))
    showToast('配置已保存', 'success')
  })

  // Export
  document.getElementById('export-data-btn')?.addEventListener('click', async () => {
    try {
      const data = await exportAllData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'book-tracker-backup-' + new Date().toISOString().split('T')[0] + '.json'
      a.click()
      URL.revokeObjectURL(url)
      showToast('数据已导出', 'success')
    } catch (err) {
      showToast('导出失败: ' + err.message, 'error')
    }
  })

  // Import
  document.getElementById('import-data-input')?.addEventListener('change', async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      const mode = confirm('确定要导入吗？\n取消 = 合并（跳过已存在的记录）\n确定 = 覆盖（清除现有数据后再导入）')
        ? 'overwrite'
        : 'merge'

      await importAllData(data, mode)
      showToast('数据已' + (mode === 'overwrite' ? '覆盖' : '合并') + '导入，请刷新页面', 'success')
    } catch (err) {
      showToast('导入失败: ' + err.message, 'error')
    }
    e.target.value = ''
  })

  // Clear data
  document.getElementById('clear-data-btn')?.addEventListener('click', async () => {
    const confirm1 = prompt('输入 DELETE 确认清除所有数据：')
    if (confirm1 !== 'DELETE') return
    const confirm2 = confirm('最后一次确认！清除后数据无法恢复！')
    if (!confirm2) return

    try {
      const { openDB } = await import('idb')
      const db = await openDB('book-tracker-db', 1)
      const tx1 = db.transaction('books', 'readwrite')
      const allBooks = await tx1.store.getAll()
      await Promise.all(allBooks.map(b => tx1.store.delete(b.id)))
      await tx1.done
      const tx2 = db.transaction('reading_logs', 'readwrite')
      const allLogs = await tx2.store.getAll()
      await Promise.all(allLogs.map(l => tx2.store.delete(l.id)))
      await tx2.done
      showToast('所有数据已清除', 'success')
      location.reload()
    } catch (err) {
      showToast('清除失败: ' + err.message, 'error')
    }
  })
}
