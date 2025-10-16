import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Stack from '../contentstackClient'

export default function Post(){
  const { uid } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!Stack || !uid) return
    Stack.ContentType('blog_post').Entry(uid).fetch()
      .then(res => {
        // SDK returns entry data directly
        setPost(res.entry || res)
      })
      .catch(err => console.warn(err))
      .finally(() => setLoading(false))
  }, [uid])

  if (loading) return <div className="container" style={{padding:40}}>Loading...</div>
  if (!post) return <div className="container" style={{padding:40}}>Post not found.</div>

  return (
    <div className="container" style={{padding:'2rem 0'}}>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{__html: post.body || post.description || ''}} />
    </div>
  )
}
