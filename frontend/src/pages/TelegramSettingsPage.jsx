import { useState } from 'react'
import { telegramApi } from '../services/api'
import TelegramLinkCard from '../components/TelegramLinkCard'
import '../components/Social.css'

export default function TelegramSettingsPage() {
  const [linkData, setLinkData] = useState(null)
  const [tokenData, setTokenData] = useState(null)
  const [confirmToken, setConfirmToken] = useState('')
  const [message, setMessage] = useState('')

  return (
    <section className="social-page">
      <div className="section-header">
        <div>
          <p className="kino-overline">Notifications</p>
          <h1 className="section-title">Telegram Link</h1>
        </div>
        <p className="section-subtitle">Connect Telegram to receive premium community activity updates.</p>
      </div>

      <TelegramLinkCard
        linkData={linkData}
        tokenData={tokenData}
        confirmToken={confirmToken}
        setConfirmToken={setConfirmToken}
        onStart={async () => {
          const data = await telegramApi.startLink()
          setTokenData(data)
          setMessage('Open the Telegram deep-link, then confirm with token.')
        }}
        onConfirm={async () => {
          if (!confirmToken.trim()) return
          const data = await telegramApi.confirmLink(confirmToken.trim())
          setLinkData(data)
          setMessage('Telegram linked successfully.')
        }}
        onUnlink={async () => {
          await telegramApi.unlink()
          setLinkData(null)
          setTokenData(null)
          setConfirmToken('')
          setMessage('Telegram unlinked.')
        }}
      />

      {message && <div className="kino-panel">{message}</div>}
    </section>
  )
}

