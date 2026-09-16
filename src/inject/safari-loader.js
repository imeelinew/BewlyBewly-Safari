// Safari does not support Manifest V3's content_scripts[].world = "MAIN".
// Load the page-world script through a web-accessible resource instead so the
// history hooks run against the real window object rather than Safari's
// isolated extension world.
(() => {
  const marker = 'data-bewlybewly-safari-loader'

  function loadPageWorldScript() {
    const root = document.documentElement
    if (!root) {
      document.addEventListener('readystatechange', loadPageWorldScript, { once: true })
      return
    }

    if (root.hasAttribute(marker))
      return

    root.setAttribute(marker, '')

    const script = document.createElement('script')
    script.src = globalThis.browser.runtime.getURL('dist/inject/index.js')
    script.async = false
    script.addEventListener('load', () => script.remove(), { once: true })
    script.addEventListener('error', () => {
      root.removeAttribute(marker)
      script.remove()
    }, { once: true })
    root.appendChild(script)
  }

  loadPageWorldScript()
})()
