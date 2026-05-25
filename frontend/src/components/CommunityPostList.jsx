export default function CommunityPostList({ posts = [] }) {
  if (!posts.length) {
    return <div className="kino-panel">No posts yet. Start the conversation.</div>
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <article key={post.id} className="kino-panel post-card">
          <p className="post-author">{post.user?.name || 'Member'} · {post.type}</p>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  )
}

