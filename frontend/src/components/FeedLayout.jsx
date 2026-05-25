export default function FeedLayout({ children, meta, onPrev, onNext }) {
  return (
    <>
      <div className="post-list">{children}</div>
      {meta && (
        <div className="social-pager">
          <button className="btn-ghost" disabled={meta.currentPage <= 1} onClick={onPrev}>Prev</button>
          <span className="social-page-label">Page {meta.currentPage} of {meta.lastPage}</span>
          <button className="btn-ghost" disabled={meta.currentPage >= meta.lastPage} onClick={onNext}>Next</button>
        </div>
      )}
    </>
  )
}
