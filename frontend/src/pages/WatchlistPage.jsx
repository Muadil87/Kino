import Watchlist from '../components/Watchlist'

export default function WatchlistPage({
  watchlist,
  history,
  onRemoveFromWatchlist,
  onRemoveFromHistory,
  onMoveToHistory,
}) {
  return (
    <Watchlist
      watchlist={watchlist}
      history={history}
      onRemoveFromWatchlist={onRemoveFromWatchlist}
      onRemoveFromHistory={onRemoveFromHistory}
      onMoveToHistory={onMoveToHistory}
    />
  )
}
