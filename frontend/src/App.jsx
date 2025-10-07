import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import { testBackendConnection } from './services/apiService.js';
import config from './constants.js';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [backendConnected, setBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const manifest = new Manifest(config.BACKEND_URL);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 [APP] Initializing application...');
      const connectionResult = await testBackendConnection();
      setBackendConnected(connectionResult.success);

      if (connectionResult.success) {
        console.log('✅ [APP] Backend connection successful.');
        try {
          const currentUser = await manifest.from('User').me();
          setUser(currentUser);
          setCurrentScreen('dashboard');
          console.log('✅ [APP] User is logged in:', currentUser.email);
        } catch (error) {
          setUser(null);
          setCurrentScreen('landing');
          console.log('ℹ️ [APP] No active user session.');
        }
      } else {
        console.error('❌ [APP] Backend connection failed:', connectionResult.error);
      }
      setLoading(false);
    };

    initializeApp();
  }, []);

  const login = async (email, password) => {
    await manifest.login(email, password);
    const loggedInUser = await manifest.from('User').me();
    setUser(loggedInUser);
    setCurrentScreen('dashboard');
  };

  const signup = async (name, email, password) => {
    await manifest.from('User').signup({ name, email, password });
    await login(email, password);
  };

  const logout = async () => {
    await manifest.logout();
    setUser(null);
    setCurrentScreen('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Connecting to FlavorFusion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-2 ${backendConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
           <span className={`h-2 w-2 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
           <span>{backendConnected ? 'Backend Connected' : 'Backend Disconnected'}</span>
        </div>
      </div>
      
      {currentScreen === 'landing' ? (
        <LandingPage onLogin={login} onSignup={signup} />
      ) : (
        <DashboardPage user={user} onLogout={logout} manifest={manifest} />
      )}
    </div>
  );
}

export default App;
