/**
 * Toast notification component
 */
export function showToast(message, type = 'info', duration = 3000) {
  const colors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500'
  }
  const el = document.createElement('div')
  el.className = `toast-enter fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white text-sm shadow-lg ${colors[type] || colors.info} max-w-xs`
  el.textContent = message
  document.body.appendChild(el)
  setTimeout(() => {
    el.style.opacity = '0'
    el.style.transition = 'opacity 0.3s'
    setTimeout(() => el.remove(), 300)
  }, duration)
}
