import { beforeEach, describe, expect, it } from 'vitest'

import { SAFARI_COMMENT_THEME_CSS, startSafariCommentThemeBridge } from '../contentScripts/safariCommentTheme'

describe('safari comment theme bridge', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<head></head><body></body>'
    document.documentElement.className = 'bewly-design dark'
  })

  it('injects the theme variables through nested comment shadow roots', () => {
    const comments = document.createElement('bili-comments')
    const commentsRoot = comments.attachShadow({ mode: 'open' })
    const renderer = document.createElement('bili-comment-renderer')
    const rendererRoot = renderer.attachShadow({ mode: 'open' })
    const richText = document.createElement('bili-rich-text')
    const richTextRoot = richText.attachShadow({ mode: 'open' })

    rendererRoot.appendChild(richText)
    commentsRoot.appendChild(renderer)
    document.body.appendChild(comments)

    startSafariCommentThemeBridge()

    expect(commentsRoot.querySelector('style[data-bewly-safari-comment-theme]')?.textContent)
      .toBe(SAFARI_COMMENT_THEME_CSS)
    expect(rendererRoot.querySelector('style[data-bewly-safari-comment-theme]')).not.toBeNull()
    expect(richTextRoot.querySelector('style[data-bewly-safari-comment-theme]')).not.toBeNull()
  })

  it('styles comment components added after startup', async () => {
    startSafariCommentThemeBridge()

    const comments = document.createElement('bili-comments')
    const commentsRoot = comments.attachShadow({ mode: 'open' })
    document.body.appendChild(comments)
    await Promise.resolve()

    const richText = document.createElement('bili-rich-text')
    const richTextRoot = richText.attachShadow({ mode: 'open' })
    commentsRoot.appendChild(richText)
    await Promise.resolve()

    expect(richTextRoot.querySelector('style[data-bewly-safari-comment-theme]')).not.toBeNull()
  })

  it('removes the bridge when page style adaptation is disabled', async () => {
    const comments = document.createElement('bili-comments')
    const commentsRoot = comments.attachShadow({ mode: 'open' })
    document.body.appendChild(comments)
    startSafariCommentThemeBridge()

    document.documentElement.classList.remove('bewly-design')
    await Promise.resolve()

    expect(commentsRoot.querySelector('style[data-bewly-safari-comment-theme]')).toBeNull()
  })
})
