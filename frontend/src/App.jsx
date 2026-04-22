import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  SignOutButton,
  UserButton
} from '@clerk/clerk-react'

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Online Interview Platform</h1>

      {/* When user is NOT logged in */}
      <SignedOut>
        <SignInButton mode="modal">
          <button style={{ marginRight: "10px" }}>
            Sign In
          </button>
        </SignInButton>

        <SignUpButton mode="modal">
          <button>
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>

      {/* When user IS logged in */}
      <SignedIn>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <UserButton />

          <SignOutButton>
            <button>
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </SignedIn>
    </div>
  )
}

export default App