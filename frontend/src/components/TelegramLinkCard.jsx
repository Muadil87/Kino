export default function TelegramLinkCard({ linkData, tokenData, onStart, onConfirm, onUnlink, confirmToken, setConfirmToken }) {
  return (
    <div className="kino-panel telegram-card">
      <p className="post-author">Telegram Connection</p>
      {linkData ? (
        <>
          <p>Linked as @{linkData.telegram_username || 'unknown'}</p>
          <button className="btn-ghost" onClick={onUnlink}>Unlink Telegram</button>
        </>
      ) : (
        <>
          <button className="btn-ghost" onClick={onStart}>Start Telegram Link</button>
          {tokenData?.deep_link && (
            <a className="btn-ghost" href={tokenData.deep_link} target="_blank" rel="noreferrer">Open Telegram Link</a>
          )}
          <div className="telegram-confirm-row">
            <input placeholder="Paste link token" value={confirmToken} onChange={(e) => setConfirmToken(e.target.value)} />
            <button className="btn-ghost" onClick={onConfirm}>Confirm</button>
          </div>
        </>
      )}
    </div>
  )
}

