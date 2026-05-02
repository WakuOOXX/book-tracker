/**
 * OCR 识别模块
 * 支持阿里云文字识别、百度通用文字识别
 */

/**
 * 获取 OCR 配置
 */
function getConfig() {
  try {
    const raw = localStorage.getItem('ocr-config')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * 调用阿里云文字识别 API
 * 文档: https://help.aliyun.com/document_detail/324217.html
 */
async function recognizeAliyun(imageBase64) {
  const config = getConfig()
  if (!config || !config.apiKey || !config.secretKey) {
    throw new Error('请先在设置中配置 OCR API')
  }
  if (config.provider !== 'aliyun') {
    // If user has other provider configured, don't use aliyun
    // This is a fallback, check again
  }

  // 阿里云 OCR API 调用
  const response = await fetch('https://ocr.cn-shanghai.aliyuncs.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': config.apiKey,
      'x-ocr-secret': config.secretKey
    },
    body: JSON.stringify({
      image: imageBase64,
      // 通用文字识别
      type: 'General'
    })
  })

  if (!response.ok) {
    throw new Error(`阿里云 OCR 请求失败: ${response.status}`)
  }

  const data = await response.json()
  return parseAliyunResult(data)
}

/**
 * 解析阿里云 OCR 结果
 */
function parseAliyunResult(data) {
  const lines = data?.data?.content || data?.content || []
  // 合并所有识别文本
  const text = Array.isArray(lines) ? lines.join('\n') : (typeof lines === 'string' ? lines : '')
  return parseTextToBook(text)
}

/**
 * 调用百度通用文字识别 API (高精度版)
 * 文档: https://ai.baidu.com/ai-doc/OCR/ik3h7y238
 */
async function recognizeBaidu(imageBase64) {
  const config = getConfig()
  if (!config || !config.apiKey || !config.secretKey) {
    throw new Error('请先在设置中配置 OCR API')
  }

  // 1. 获取 access_token
  const tokenRes = await fetch(
    `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${config.apiKey}&client_secret=${config.secretKey}`,
    { method: 'POST' }
  )
  if (!tokenRes.ok) {
    throw new Error('百度 token 获取失败')
  }
  const tokenData = await tokenRes.json()
  const accessToken = tokenData.access_token
  if (!accessToken) {
    throw new Error('百度 token 无效: ' + JSON.stringify(tokenData))
  }

  // 2. 识别图片
  const formData = new URLSearchParams()
  formData.append('image', imageBase64)
  formData.append('detect_direction', 'true')

  const res = await fetch(
    `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${accessToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    }
  )

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`百度 OCR 请求失败: ${res.status} - ${errText}`)
  }

  const data = await res.json()
  return parseBaiduResult(data)
}

/**
 * 解析百度 OCR 结果
 */
function parseBaiduResult(data) {
  if (data.error_msg) {
    throw new Error(`百度 OCR 错误: ${data.error_msg}`)
  }
  const wordsResult = data.words_result || []
  const text = wordsResult.map(w => w.words).filter(Boolean).join('\n')
  return parseTextToBook(text)
}

/**
 * 从识别文本中提取书名和作者
 * 支持多种常见格式：
 * - 《书名》作者
 * - 书名 / 作者
 * - 书名 - 作者
 * - 书名 著/著者 作者
 * - 纯书名（无法识别作者）
 */
function parseTextToBook(text) {
  if (!text || !text.trim()) return null

  const lines = text.split('\n').filter(l => l.trim())
  const fullText = text.trim()

  // 尝试按行解析（优先），多本书时走批量
  const books = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.length < 2) continue

    let title = ''
    let author = ''
    let isbn = ''

    // 格式1: 《书名》作者
    const bookMarkMatch = trimmed.match(/《([^》]+)》\s*(著|编著|主编|编)?\s*[：: ]?\s*(.+)?/)
    if (bookMarkMatch) {
      title = bookMarkMatch[1].trim()
      author = (bookMarkMatch[3] || '').trim()
      books.push({ title, author })
      continue
    }

    // 格式2: 书名 / 作者 或 书名 - 作者
    const sepMatch = trimmed.match(/^(.+?)\s*[／/｜|—–—-]\s*(.+)$/)
    if (sepMatch) {
      title = sepMatch[1].trim()
      author = sepMatch[2].trim()
      // 排除明显不是书名的行
      if (title.length < 50 && !title.includes('第') && !title.includes('页')) {
        books.push({ title, author })
        continue
      }
    }

    // 格式3: 书名 著/著者 作者
    const authorMatch = trimmed.match(/^(.+?)\s+(著|编著|主编|编|译|著者|作者)[：: ]\s*(.+)$/)
    if (authorMatch) {
      title = authorMatch[1].trim()
      author = authorMatch[3].trim()
      books.push({ title, author })
      continue
    }

    // 格式4: ISBN 10/13位
    const isbnMatch = trimmed.match(/(?:ISBN[：: ]*)?((?:\d[-\s]?){10,13})/)
    if (isbnMatch) {
      isbn = isbnMatch[1].replace(/[-\s]/g, '')
      continue
    }

    // 格式5: 单纯书名（没有明显分隔符）
    // 只保留看起来像书名的行（不要太长、不包含明显非书名内容）
    if (trimmed.length >= 2 && trimmed.length <= 50 &&
        !trimmed.startsWith('第') && !trimmed.startsWith('页') &&
        !/^\d+$/.test(trimmed) && !trimmed.includes('http')) {
      books.push({ title: trimmed, author: '' })
    }
  }

  // 去重
  const seen = new Set()
  const unique = books.filter(b => {
    const key = b.title
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  if (unique.length === 0) {
    // 回退：整段文本作为书名
    if (fullText.length <= 60) {
      return { title: fullText, author: '' }
    }
    return null
  }

  return unique
}

/**
 * 主入口：根据配置自动选择 OCR 服务
 * @param {string} imageBase64 - base64 编码的图片数据 (不含 data:image 前缀)
 * @returns {Promise<Array<{title: string, author: string}>>} 识别结果
 */
export async function recognizeImage(imageBase64) {
  const config = getConfig()
  if (!config || !config.apiKey || !config.secretKey) {
    throw new Error('请先在设置页面配置 OCR API Key')
  }

  let result
  if (config.provider === 'baidu') {
    result = await recognizeBaidu(imageBase64)
  } else {
    // 默认使用阿里云
    result = await recognizeAliyun(imageBase64)
  }

  // 如果返回单个对象，转成数组
  if (result && !Array.isArray(result)) {
    return [result]
  }

  return result || []
}

/**
 * 将图片 File 对象转为 base64
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1] || reader.result
      resolve(base64)
    }
    reader.onerror = () => reject(new Error('图片读取失败'))
    reader.readAsDataURL(file)
  })
}

/**
 * 将粘贴板中的图片转为 base64
 */
export async function clipboardToBase64(clipboardItems) {
  for (const item of clipboardItems) {
    if (item.type.startsWith('image/')) {
      const blob = item.getAsFile()
      if (blob) {
        return fileToBase64(blob)
      }
    }
  }
  throw new Error('剪贴板中没有图片')
}

/**
 * 压缩图片（控制在合理大小内，加快识别速度）
 */
export function compressImage(base64, maxWidth = 1024, quality = 0.85) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let w = img.width
      let h = img.height
      if (w > maxWidth) {
        h = h * maxWidth / w
        w = maxWidth
      }
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', quality).split(',')[1])
    }
    img.src = 'data:image/jpeg;base64,' + base64
  })
}
