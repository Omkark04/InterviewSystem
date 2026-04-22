import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'

function App() {
  return (
    <>
      <h1>App is working</h1>

      <SignedOut>
        <SignInButton mode='modal'/>
          
        
      </SignedOut>

      <SignedIn>
        <SignOutButton/>
      </SignedIn>
    </>
  )
}

export default App