/**
 * Utility functions
 */

export function formatDate(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function formatDateShort(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  const now = new Date()
  const diff = now - d
  if (diff < 86400000) return '今天'
  if (diff < 172800000) return '昨天'
  if (d.getFullYear() === now.getFullYear()) {
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

export function getCurrentYear() {
  return new Date().getFullYear()
}

export function statusLabel(status) {
  const map = { wish: '想读', reading: '在读', done: '已读' }
  return map[status] || status
}

export function statusColor(status) {
  const map = { wish: 'bg-amber-100 text-amber-800', reading: 'bg-blue-100 text-blue-800', done: 'bg-green-100 text-green-800' }
  return map[status] || 'bg-gray-100 text-gray-800'
}

export function stars(rating) {
  if (!rating) return ''
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

/**
 * Auto-categorize based on title + author keywords
 */
const CATEGORY_RULES = [
  { category: '小说', keywords: ['小说', '长篇', '短篇', '故事集', '三部曲', '文集', '选集', '全集'] },
  { category: '技术', keywords: ['编程', '技术', '算法', '架构', '设计模式', '代码', '程序', '软件', '计算机', 'AI', '人工智能', '数据', '网络', '安全', '数据库', 'Python', 'Java', 'JavaScript', '前端', '后端', 'Go', 'Rust', 'C++', 'Linux', '机器学习', '深度学习', '云计算', '区块链'] },
  { category: '历史', keywords: ['历史', '史记', '王朝', '战争', '文明', '帝国', '古代', '近代', '革命', '史', '考古', '传记', '回忆录', '年谱'] },
  { category: '哲学', keywords: ['哲学', '思想', '逻辑', '存在', '本质', '伦理', '形而上学', '认识论', '方法论', '辩证法'] },
  { category: '科学', keywords: ['科学', '物理', '化学', '生物', '数学', '天文', '地理', '自然', '物种', '进化', '基因', '量子', '宇宙'] },
  { category: '艺术', keywords: ['艺术', '设计', '摄影', '绘画', '音乐', '电影', '美学', '创意', '视觉', '色彩', '建筑', '雕塑', '书法'] },
  { category: '生活', keywords: ['生活', '心理', '成长', '理财', '健康', '养生', '美食', '旅行', '情感', '社交', '沟通', '管理', '职场', '励志', '自我', '习惯', '幸福', '冥想'] },
  { category: '经济', keywords: ['经济', '商业', '管理', '营销', '投资', '金融', '市场', '战略', '创业', '财务', '会计', '贸易', '股票', '基金'] },
  { category: '教育', keywords: ['教育', '学习', '教学', '课程', '考试', '培训', '教材', '教辅', '词典', '词汇', '语法'] },
]

export function autoCategorize(title, author) {
  const text = ((title || '') + ' ' + (author || '')).toLowerCase()
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some(k => text.includes(k))) {
      return rule.category
    }
  }
  return '其他'
}

/**
 * Debounce
 */
export function debounce(fn, ms = 300) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), ms)
  }
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(str) {
  if (!str) return ''
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * Generate a simple unique id (for temporary use)
 */
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
