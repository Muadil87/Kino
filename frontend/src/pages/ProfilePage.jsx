import Profile from '../components/Profile'

export default function ProfilePage({
  username,
  email,
  watchlistCount,
  favoritesCount,
  historyCount,
}) {
  return (
    <Profile
      username={username}
      email={email}
      watchlistCount={watchlistCount}
      favoritesCount={favoritesCount}
      historyCount={historyCount}
    />
  )
}
