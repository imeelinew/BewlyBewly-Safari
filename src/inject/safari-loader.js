// Safari does not support Manifest V3's content_scripts[].world = "MAIN".
// Load the page-world script through a web-accessible resource instead so the
// history hooks run against the real window object rather than Safari's
// isolated extension world.
(() => {
  const marker = 'data-bewlybewly-safari-loader'
  if (document.documentElement.hasAttribute(marker))
    return

  document.documentElement.setAttribute(marker, '')

  const script = document.createElement('script')
  script.src = globalThis.browser.runtime.getURL('dist/inject/index.js')
  script.async = false
  script.addEventListener('load', () => script.remove(), { once: true })
  script.addEventListener('error', () => {
    document.documentElement.removeAttribute(marker)
    script.remove()
  }, { once: true })
  document.documentElement.appendChild(script)
})()
