'use client'

import sanitizeHtml from 'sanitize-html';

export interface SafeHtmlProps {
  html: string
  className?: string
}


export default function SafeHtml({ html, className }: SafeHtmlProps) {
  const sanitized = sanitizeHtml(html);

  if (!sanitized) return null

  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitized }} />
}
