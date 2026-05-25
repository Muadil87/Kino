import { useState } from 'react'

export default function CommunityPostComposer({ onSubmit }) {
  const [content, setContent] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!content.trim()) return
    onSubmit({ content, type: 'discussion' })
    setContent('')
  }

  return (
    <form className="kino-panel post-composer" onSubmit={submit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share a thought, a scene, or a recommendation..."
      />
      <button className="btn-primary" type="submit">Post</button>
    </form>
  )
}

