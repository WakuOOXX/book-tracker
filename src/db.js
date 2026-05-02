import { openDB } from 'idb'

const DB_NAME = 'book-tracker-db'
const DB_VERSION = 1

let dbPromise = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Books store
        if (!db.objectStoreNames.contains('books')) {
          const booksStore = db.createObjectStore('books', {
            keyPath: 'id',
            autoIncrement: true
          })
          booksStore.createIndex('title', 'title')
          booksStore.createIndex('author', 'author')
          booksStore.createIndex('category', 'category')
          booksStore.createIndex('status', 'status')
          booksStore.createIndex('createdAt', 'createdAt')
        }
        // Reading logs store
        if (!db.objectStoreNames.contains('reading_logs')) {
          const logsStore = db.createObjectStore('reading_logs', {
            keyPath: 'id',
            autoIncrement: true
          })
          logsStore.createIndex('bookId', 'bookId')
          logsStore.createIndex('round', 'round')
          logsStore.createIndex('startDate', 'startDate')
          logsStore.createIndex('endDate', 'endDate')
        }
      }
    })
  }
  return dbPromise
}

// ── Books ──

export async function getAllBooks() {
  const db = await getDB()
  return db.getAll('books')
}

export async function getBook(id) {
  const db = await getDB()
  return db.get('books', id)
}

export async function addBook(book) {
  const db = await getDB()
  const now = new Date().toISOString()
  const data = { ...book, createdAt: now, updatedAt: now }
  const id = await db.add('books', data)
  return { ...data, id }
}

export async function updateBook(id, updates) {
  const db = await getDB()
  const existing = await db.get('books', id)
  if (!existing) throw new Error(`Book ${id} not found`)
  const data = { ...existing, ...updates, id, updatedAt: new Date().toISOString() }
  await db.put('books', data)
  return data
}

export async function deleteBook(id) {
  const db = await getDB()
  await db.delete('books', id)
  // Also delete all reading logs for this book
  const logs = await getReadingLogsByBook(id)
  const tx = db.transaction('reading_logs', 'readwrite')
  await Promise.all(logs.map(log => tx.store.delete(log.id)))
  await tx.done
}

export async function deleteBooks(ids) {
  const db = await getDB()
  const tx = db.transaction('books', 'readwrite')
  await Promise.all(ids.map(id => tx.store.delete(id)))
  await tx.done
  // Also delete their logs
  for (const id of ids) {
    const logs = await getReadingLogsByBook(id)
    const tx2 = db.transaction('reading_logs', 'readwrite')
    await Promise.all(logs.map(log => tx2.store.delete(log.id)))
    await tx2.done
  }
}

export async function searchBooks(query) {
  const all = await getAllBooks()
  if (!query) return all
  const q = query.toLowerCase()
  return all.filter(b =>
    (b.title && b.title.toLowerCase().includes(q)) ||
    (b.author && b.author.toLowerCase().includes(q)) ||
    (b.tags && b.tags.some(t => t.toLowerCase().includes(q)))
  )
}

export async function getBooksByStatus(status) {
  const db = await getDB()
  return db.getAllFromIndex('books', 'status', status)
}

// ── Reading Logs ──

export async function getReadingLogsByBook(bookId) {
  const db = await getDB()
  const logs = await db.getAllFromIndex('reading_logs', 'bookId', bookId)
  return logs.sort((a, b) => b.round - a.round)
}

export async function getReadingLog(id) {
  const db = await getDB()
  return db.get('reading_logs', id)
}

export async function addReadingLog(log) {
  const db = await getDB()
  const now = new Date().toISOString()
  const data = { ...log, createdAt: now, updatedAt: now }
  const id = await db.add('reading_logs', data)
  return { ...data, id }
}

export async function updateReadingLog(id, updates) {
  const db = await getDB()
  const existing = await db.get('reading_logs', id)
  if (!existing) throw new Error(`Log ${id} not found`)
  const data = { ...existing, ...updates, id, updatedAt: new Date().toISOString() }
  await db.put('reading_logs', data)
  return data
}

export async function deleteReadingLog(id) {
  const db = await getDB()
  await db.delete('reading_logs', id)
}

// Get max round number for a book
export async function getMaxRound(bookId) {
  const logs = await getReadingLogsByBook(bookId)
  if (logs.length === 0) return 0
  return Math.max(...logs.map(l => l.round || 0))
}

// ── Export / Import ──

export async function exportAllData() {
  const books = await getAllBooks()
  const db = await getDB()
  const readingLogs = await db.getAll('reading_logs')
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    books,
    readingLogs
  }
}

export async function importAllData(data, mode = 'merge') {
  if (!data.books || !data.readingLogs) {
    throw new Error('Invalid data format')
  }
  const db = await getDB()

  if (mode === 'overwrite') {
    // Clear existing data
    const tx1 = db.transaction('books', 'readwrite')
    const allBooks = await tx1.store.getAll()
    await Promise.all(allBooks.map(b => tx1.store.delete(b.id)))
    await tx1.done
    const tx2 = db.transaction('reading_logs', 'readwrite')
    const allLogs = await tx2.store.getAll()
    await Promise.all(allLogs.map(l => tx2.store.delete(l.id)))
    await tx2.done
  }

  // Import books
  const tx3 = db.transaction('books', 'readwrite')
  for (const book of data.books) {
    if (mode === 'merge') {
      const existing = book.id ? await db.get('books', book.id) : null
      if (!existing) {
        await tx3.store.add(book)
      }
    } else {
      await tx3.store.add(book)
    }
  }
  await tx3.done

  // Import reading logs
  const tx4 = db.transaction('reading_logs', 'readwrite')
  for (const log of data.readingLogs) {
    if (mode === 'merge') {
      const existing = log.id ? await db.get('reading_logs', log.id) : null
      if (!existing) {
        await tx4.store.add(log)
      }
    } else {
      await tx4.store.add(log)
    }
  }
  await tx4.done
}

// ── Statistics ──

export async function getYearlyStats(year) {
  const allLogs = await getAll('reading_logs')
  const yearLogs = allLogs.filter(l => {
    const d = l.endDate || l.startDate
    return d && d.startsWith(String(year))
  })
  return {
    total: yearLogs.length,
    done: yearLogs.filter(l => l.status === 'done').length
  }
}

async function getAll(storeName) {
  const db = await getDB()
  return db.getAll(storeName)
}
