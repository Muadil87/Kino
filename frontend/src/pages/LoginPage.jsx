import SignIn from '../components/SignIn'

export default function LoginPage({ onNavigateToSignUp, onLogin }) {
  return <SignIn onNavigateToSignUp={onNavigateToSignUp} onLogin={onLogin} />
}
