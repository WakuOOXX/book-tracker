/**
 * Simple reactive store
 */
class Store {
  constructor() {
    this._state = {
      books: [],
      readingLogs: [],
      filter: 'all',       // all | wish | reading | done
      searchQuery: '',
      currentBook: null,
      currentLog: null
    }
    this._listeners = new Map()
    this._idCounter = 0
  }

  get state() {
    return this._state
  }

  setState(key, value) {
    this._state[key] = value
    this._notify(key, value)
  }

  on(key, fn) {
    if (!this._listeners.has(key)) {
      this._listeners.set(key, new Set())
    }
    this._listeners.get(key).add(fn)
    return () => this._listeners.get(key).delete(fn)
  }

  _notify(key, value) {
    const listeners = this._listeners.get(key)
    if (listeners) {
      listeners.forEach(fn => fn(value))
    }
  }
}

export const store = new Store()
export default Store
