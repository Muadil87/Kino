import Landing from '../components/Landing'

export default function LandingPage({ movies, onGetStarted }) {
  return <Landing movies={movies} onGetStarted={onGetStarted} />
}
