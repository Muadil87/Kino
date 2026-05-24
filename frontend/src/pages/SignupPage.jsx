import SignUp from '../components/SignUp'

export default function SignupPage({ onNavigateToSignIn, onSignUp }) {
  return <SignUp onNavigateToSignIn={onNavigateToSignIn} onSignUp={onSignUp} />
}
