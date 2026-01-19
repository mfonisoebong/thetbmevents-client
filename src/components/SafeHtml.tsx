'use client'

import React, { useMemo } from 'react'
import DOMPurify, { type Config as DOMPurifyConfig } from 'dompurify'

export interface SafeHtmlProps {
  html?: string | null
  className?: string
  /**
   * Optional DOMPurify config. If omitted, we use a conservative allowlist.
   * Prefer extending allowlist rather than using the default permissive config.
   */
  config?: DOMPurifyConfig
}

const defaultConfig: DOMPurifyConfig = {
  USE_PROFILES: { html: true },
  ALLOWED_TAGS: [
    'a',
    'abbr',
    'b',
    'blockquote',
    'br',
    'code',
    'del',
    'div',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'i',
    'img',
    'li',
    'ol',
    'p',
    'pre',
    'span',
    'strong',
    'sub',
    'sup',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'u',
    'ul',
  ],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'src', 'alt', 'width', 'height', 'class', 'style'],
  ALLOW_DATA_ATTR: false,
}

export default function SafeHtml({ html, className, config }: SafeHtmlProps) {
  const sanitized = useMemo(() => {
    const input = html ?? ''
    // `sanitize` returns a string by default; KEEP it that way to avoid DOM nodes.
    return DOMPurify.sanitize(input, { ...defaultConfig, ...(config ?? {}) })
  }, [html, config])

  if (!sanitized) return null

  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitized }} />
}
