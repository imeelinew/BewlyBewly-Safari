const COMMENT_SELECTOR = 'bili-comments'
const STYLE_MARKER = 'data-bewly-safari-comment-theme'

export const SAFARI_COMMENT_THEME_CSS = `
:host {
  --bg1: var(--bew-bg, #0d0e13) !important;
  --bg2: var(--bew-content-solid, #17181f) !important;
  --bg3: var(--bew-content-alt-solid, #20212a) !important;
  --bg1_float: var(--bew-elevated-solid, #20212a) !important;
  --text1: var(--bew-text-1, #f8f9fb) !important;
  --text2: var(--bew-text-2, rgb(226 229 235 / 80%)) !important;
  --text3: var(--bew-text-3, rgb(201 207 217 / 72%)) !important;
  --text4: var(--bew-text-4, rgb(176 184 197 / 55%)) !important;
  --line_light: var(--bew-border-color, rgb(131 131 145 / 15%)) !important;
  --line_regular: var(--bew-border-color, rgb(131 131 145 / 15%)) !important;
  --line_bold: var(--bew-border-color, rgb(131 131 145 / 15%)) !important;
}

:host(bili-rich-text) {
  --bili-rich-text-color: var(--bew-text-1, #f8f9fb) !important;
  --bili-rich-text-link-color: var(--bew-theme-color, #00aeec) !important;
  --bili-rich-text-link-color-hover: var(--bew-theme-color-80, #33bef0) !important;
}

:host(bili-comment-user-info) #user-name a[style*="color"] {
  color: var(--bew-theme-color, #00aeec) !important;
}

:host(bili-comment-renderer) #body.dark .tag[style] {
  --bili-comment-tag-color: var(--bew-text-2, rgb(226 229 235 / 80%));
  --bili-comment-tag-bg: var(--bew-fill-1, rgb(131 131 145 / 15%));
}

:host(bili-comment-box) #pub button:not(:hover, :active, .active) {
  background-color: var(--bew-theme-color-60, #66cef3);
}
`

/**
 * Safari gives a component's own `:host` custom properties precedence over
 * the page-level mappings used by BewlyBewly. Bilibili's new comments are
 * several open shadow roots deep, so bridge only that subtree with a small
 * stylesheet instead of importing the complete extension CSS into every
 * shadow root on the page.
 */
export function startSafariCommentThemeBridge() {
  const observedRoots = new Set<ShadowRoot>()
  const styledRoots = new Map<ShadowRoot, HTMLStyleElement>()
  let commentObserver: MutationObserver

  const isEnabled = () => document.documentElement.classList.contains('bewly-design')

  function syncStyle(root: ShadowRoot) {
    const existingStyle = styledRoots.get(root)

    if (!isEnabled()) {
      existingStyle?.remove()
      styledRoots.delete(root)
      return
    }

    if (existingStyle?.isConnected)
      return

    const style = document.createElement('style')
    style.setAttribute(STYLE_MARKER, '')
    style.textContent = SAFARI_COMMENT_THEME_CSS
    root.appendChild(style)
    styledRoots.set(root, style)
  }

  function observeShadowRoot(root: ShadowRoot) {
    syncStyle(root)

    if (observedRoots.has(root))
      return

    observedRoots.add(root)
    commentObserver.observe(root, { childList: true, subtree: true })
    processDescendants(root)
  }

  function processElement(element: Element) {
    if (element.shadowRoot)
      observeShadowRoot(element.shadowRoot)

    processDescendants(element)
  }

  function processDescendants(root: ParentNode) {
    root.querySelectorAll('*').forEach((element) => {
      if (element.shadowRoot)
        observeShadowRoot(element.shadowRoot)
    })
  }

  function processCommentHosts(root: ParentNode) {
    if (root instanceof Element && root.matches(COMMENT_SELECTOR))
      processElement(root)

    root.querySelectorAll(COMMENT_SELECTOR).forEach(processElement)
  }

  commentObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element))
          return

        processElement(node)
      })
    })
  })

  const pageObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element)
          processCommentHosts(node)
      })
    })
  })

  const appearanceObserver = new MutationObserver(() => {
    observedRoots.forEach(syncStyle)
  })

  pageObserver.observe(document.documentElement, { childList: true, subtree: true })
  appearanceObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  processCommentHosts(document)
}
