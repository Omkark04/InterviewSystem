import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser, useAuth } from '@clerk/clerk-react'
import { Route, Routes, Navigate } from "react-router";
import HomePage from './pages/HomePage';
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from './pages/ProblemsPage';
// import { useUser } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import DashboardPage from "./pages/DashboardPage";
import SessionPage from "./pages/SessionPage";
import { setGetToken } from "./lib/tokenStore";

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  // Feed Clerk's getToken into the axios interceptor token store
  setGetToken(getToken);

  //  flickering effect off
  if (!isLoaded) return null;


  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />

        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />

      </Routes>
      <Toaster position='top-center' toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App

// tw, daisy-ui, react router, react hot toast,
// to be doing= react-query(tanstack), axios