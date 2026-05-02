import { getAllBooks } from '../db.js'
import { getCurrentYear, statusLabel } from '../utils.js'

export function renderStatsPage() {
  const books = storeBooks || []
  const year = getCurrentYear()

  // Compute basic stats
  const doneBooks = books.filter(b => b.status === 'done')
  const totalRead = doneBooks.length
  const avgRating = doneBooks.filter(b => b.rating).length
    ? (doneBooks.filter(b => b.rating).reduce((s, b) => s + b.rating, 0) / doneBooks.filter(b => b.rating).length).toFixed(1)
    : '—'

  // Category breakdown
  const categoryMap = {}
  books.forEach(b => {
    categoryMap[b.category || '其他'] = (categoryMap[b.category || '其他'] || 0) + 1
  })
  const categoryData = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])

  // Monthly data (this year)
  const monthlyCounts = Array(12).fill(0)
  doneBooks.forEach(b => {
    const logs = storeLogs[b.id] || []
    logs.filter(l => l.status === 'done' && l.endDate).forEach(l => {
      const m = new Date(l.endDate).getMonth()
      if (new Date(l.endDate).getFullYear() === year) monthlyCounts[m]++
    })
  })

  // Status breakdown
  const wishCount = books.filter(b => b.status === 'wish').length
  const readingCount = books.filter(b => b.status === 'reading').length
  const doneCount = totalRead

  return `
    <div class="page-enter max-w-3xl mx-auto px-4 py-4">
      <h2 class="text-lg font-bold mb-4">📊 ${year}年阅读统计</h2>

      <!-- Stats Cards -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p class="text-2xl font-bold text-indigo-600">${totalRead}</p>
          <p class="text-xs text-gray-500 mt-1">本年读完</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p class="text-2xl font-bold text-amber-600">${avgRating}</p>
          <p class="text-xs text-gray-500 mt-1">平均评分</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p class="text-2xl font-bold text-green-600">${books.length}</p>
          <p class="text-xs text-gray-500 mt-1">总藏书</p>
        </div>
      </div>

      <!-- Monthly Chart -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">月度阅读趋势</h3>
        <canvas id="monthly-chart" height="200"></canvas>
      </div>

      <!-- Category & Status Distribution -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">分类分布</h3>
          <canvas id="category-chart" height="180"></canvas>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">阅读状态</h3>
          <canvas id="status-chart" height="180"></canvas>
        </div>
      </div>

      <!-- Category List -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">分类详情</h3>
        <div class="space-y-2">
          ${categoryData.map(([cat, count]) => `
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">${cat}</span>
              <div class="flex items-center gap-2">
                <div class="w-32 bg-gray-100 rounded-full h-2">
                  <div class="bg-indigo-500 h-2 rounded-full" style="width: ${(count / books.length * 100).toFixed(0)}%"></div>
                </div>
                <span class="text-xs text-gray-500 w-6 text-right">${count}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

let storeBooks = null
let storeLogs = {}

export async function setupStatsPage() {
  storeBooks = await getAllBooks()
  // Get all reading logs grouped by book
  const { getAll } = await import('../db.js')
  const db = await (await import('../utils.js')).getDB?.() || null

  // Build chart instances
  const monthlyData = Array(12).fill(0)
  const doneBooks = storeBooks.filter(b => b.status === 'done')
  const year = getCurrentYear()

  // We need logs for monthly data
  const logs = []
  for (const book of storeBooks) {
    const { getReadingLogsByBook } = await import('../db.js')
    const bookLogs = await getReadingLogsByBook(book.id)
    storeLogs[book.id] = bookLogs
    logs.push(...bookLogs)
  }

  doneBooks.forEach(b => {
    const bookLogs = storeLogs[b.id] || []
    bookLogs.filter(l => l.status === 'done' && l.endDate).forEach(l => {
      const m = new Date(l.endDate).getMonth()
      if (new Date(l.endDate).getFullYear() === year) monthlyData[m]++
    })
  })

  // Charts
  const Chart = (await import('chart.js')).default

  // Monthly chart
  const ctx1 = document.getElementById('monthly-chart')
  if (ctx1) {
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
        datasets: [{
          label: '读完数',
          data: monthlyData,
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79,70,229,0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    })
  }

  // Category chart
  const ctx2 = document.getElementById('category-chart')
  if (ctx2) {
    const categoryMap = {}
    storeBooks.forEach(b => {
      categoryMap[b.category || '其他'] = (categoryMap[b.category || '其他'] || 0) + 1
    })
    const entries = Object.entries(categoryMap)
    const colors = [
      '#4f46e5', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
      '#ec4899', '#14b8a6', '#f97316', '#6366f1'
    ]
    new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: entries.map(e => e[0]),
        datasets: [{
          data: entries.map(e => e[1]),
          backgroundColor: colors.slice(0, entries.length)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 8, font: { size: 10 } } } }
      }
    })
  }

  // Status chart
  const ctx3 = document.getElementById('status-chart')
  if (ctx3) {
    const wish = storeBooks.filter(b => b.status === 'wish').length
    const reading = storeBooks.filter(b => b.status === 'reading').length
    const done = storeBooks.filter(b => b.status === 'done').length
    new Chart(ctx3, {
      type: 'doughnut',
      data: {
        labels: ['想读', '在读', '已读'],
        datasets: [{
          data: [wish, reading, done],
          backgroundColor: ['#f59e0b', '#3b82f6', '#10b981']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 8, font: { size: 10 } } } }
      }
    })
  }
}
