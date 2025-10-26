import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchEntryByUID } from '../contentstackClient'

function escapeHtml(str) {
  try {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  } catch {
    return ''
  }
}

function applyMarks(text, node) {
  let out = text
  try {
    // Boolean style flags
    if (node.bold) out = `<strong>${out}</strong>`
    if (node.italic || node.emphasis) out = `<em>${out}</em>`
    if (node.underline) out = `<u>${out}</u>`
    if (node.strike || node.strikethrough) out = `<s>${out}</s>`
    if (node.code) out = `<code>${out}</code>`

    // ProseMirror-like marks array
    if (Array.isArray(node.marks)) {
      node.marks.forEach(m => {
        const type = m && (m.type || m)
        if (type === 'bold' || type === 'strong') out = `<strong>${out}</strong>`
        if (type === 'italic' || type === 'em') out = `<em>${out}</em>`
        if (type === 'underline') out = `<u>${out}</u>`
        if (type === 'strike' || type === 'strikethrough') out = `<s>${out}</s>`
        if (type === 'code') out = `<code>${out}</code>`
      })
    }
  } catch {}
  return out
}

function renderChildren(nodes) {
  if (!nodes) return ''
  if (!Array.isArray(nodes)) return renderNode(nodes)
  return nodes.map(renderNode).join('')
}

function renderNode(node) {
  if (!node) return ''
  // Text node
  if (typeof node.text === 'string') {
    return applyMarks(escapeHtml(node.text), node)
  }

  const type = node.type || node.nodeType || ''
  const children = node.children || node.child || node.content || []
  const attrs = node.attrs || node.attributes || node.data || {}

  switch (type) {
    case 'doc':
    case 'document':
      return renderChildren(children)
    case 'paragraph':
    case 'p':
      return `<p>${renderChildren(children)}</p>`
    case 'heading': {
      const level = attrs.level || node.level || 1
      const tag = `h${Math.min(6, Math.max(1, Number(level) || 1))}`
      return `<${tag}>${renderChildren(children)}</${tag}>`
    }
    case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
      return `<${type}>${renderChildren(children)}</${type}>`
    case 'link':
    case 'a': {
      const href = (attrs.href || attrs.url || node.url || '#')
      const target = attrs.target ? ` target="${escapeHtml(attrs.target)}"` : ' target="_blank"'
      return `<a href="${escapeHtml(href)}" rel="noreferrer"${target}>${renderChildren(children)}</a>`
    }
    case 'ordered_list':
    case 'ol':
      return `<ol>${renderChildren(children)}</ol>`
    case 'unordered_list':
    case 'bullet_list':
    case 'ul':
      return `<ul>${renderChildren(children)}</ul>`
    case 'list_item':
    case 'li':
      return `<li>${renderChildren(children)}</li>`
    case 'blockquote':
      return `<blockquote>${renderChildren(children)}</blockquote>`
    case 'horizontal_rule':
    case 'hr':
      return '<hr />'
    case 'code_block':
      return `<pre><code>${renderChildren(children)}</code></pre>`
    case 'image': {
      const src = attrs.src || node.src
      const alt = attrs.alt || ''
      if (src) return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" />`
      return ''
    }
    default:
      // Unknown node: render its children inline
      return renderChildren(children)
  }
}

export default function Post(){
  const { uid } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    if (!uid) return
    ;(async () => {
      try {
        const entry = await fetchEntryByUID('blog_post', uid)
        if (isMounted) setPost(entry || null)
      } catch (err) {
        console.warn('Failed to load post', err)
        if (isMounted) setPost(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    })()
    return () => { isMounted = false }
  }, [uid])

  if (loading) return <div className="container" style={{padding:40}}>Loading...</div>
  if (!post) return <div className="container" style={{padding:40}}>Post not found.</div>

  const contentHtml = (() => {
    try {
      const b = post && post.body
      // If the body is already HTML string
      if (typeof b === 'string') return b
      // If the body has an html property
      if (b && typeof b === 'object' && typeof b.html === 'string') return b.html
      // If JSON RTE style content
      if (b && typeof b === 'object' && (Array.isArray(b.children) || Array.isArray(b.content))) {
        const nodes = Array.isArray(b.children) ? b.children : b.content
        return renderChildren(nodes)
      }
      // If array of nodes directly
      if (Array.isArray(b)) return renderChildren(b)
    } catch (e) {
      // ignore
    }
    if (typeof post.description === 'string') return post.description
    if (typeof post.summary === 'string') return post.summary
    return ''
  })()

  return (
    <div className="container" style={{padding:'2rem 0'}}>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{__html: contentHtml}} />
    </div>
  )
}
