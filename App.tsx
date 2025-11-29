
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import LandingPage from './components/LandingPage';
import { User } from './types';

type AppView = 'landing' | 'login' | 'signup' | 'dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // If user is logged in, default to dashboard, but we need to handle logout correctly
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const renderContent = () => {
    // Priority: Authenticated User -> Dashboard
    if (currentUser) {
      return (
        <Dashboard 
          currentUser={currentUser} 
          onUserUpdate={setCurrentUser}
          onLogout={handleLogout} 
        />
      );
    }

    // Unauthenticated Views
    switch (currentView) {
      case 'signup':
        return (
          <SignupPage 
            onSignup={handleLogin} 
            onSwitchToLogin={() => setCurrentView('login')} 
          />
        );
      case 'login':
        return (
          <LoginPage 
            onLogin={handleLogin} 
            onSwitchToSignup={() => setCurrentView('signup')} 
          />
        );
      case 'landing':
      default:
        return (
          <LandingPage 
            onNavigateToLogin={() => setCurrentView('login')}
            onNavigateToSignup={() => setCurrentView('signup')}
          />
        );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {renderContent()}
    </div>
  );
}

export default App;
