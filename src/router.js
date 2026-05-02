/**
 * Hash-based router for SPA
 */
class Router {
  constructor() {
    this.routes = new Map()
    this.currentRoute = null
    this.onNavigate = null
    this._handleHashChange = this._handleHashChange.bind(this)
  }

  add(path, handler) {
    this.routes.set(path, handler)
    return this
  }

  start() {
    window.addEventListener('hashchange', this._handleHashChange)
    this._handleHashChange()
  }

  _handleHashChange() {
    const hash = window.location.hash.slice(1) || 'home'
    const { path, params } = this._match(hash)
    const handler = this.routes.get(path)
    if (handler) {
      this.currentRoute = { path, params, hash }
      handler(params)
      if (this.onNavigate) this.onNavigate(path, params)
    }
  }

  _match(hash) {
    const parts = hash.split('/')
    for (const [pattern] of this.routes) {
      const patternParts = pattern.split('/')
      if (patternParts.length !== parts.length) continue
      const params = {}
      let match = true
      for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
          params[patternParts[i].slice(1)] = parts[i]
        } else if (patternParts[i] !== parts[i]) {
          match = false
          break
        }
      }
      if (match) return { path: pattern, params }
    }
    return { path: 'home', params: {} }
  }

  navigate(hash) {
    window.location.hash = hash
  }

  destroy() {
    window.removeEventListener('hashchange', this._handleHashChange)
  }
}

export const router = new Router()
export default Router
