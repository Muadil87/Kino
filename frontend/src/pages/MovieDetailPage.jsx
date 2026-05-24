import MovieDetail from '../components/MovieDetail'

export default function MovieDetailPage({
  movies,
  isFavorite,
  onToggleFavorite,
  isInWatchlist,
  onToggleWatchlist,
  isLoggedIn,
}) {
  return (
    <MovieDetail
      movies={movies}
      isFavorite={isFavorite}
      onToggleFavorite={onToggleFavorite}
      isInWatchlist={isInWatchlist}
      onToggleWatchlist={onToggleWatchlist}
      isLoggedIn={isLoggedIn}
    />
  )
}
