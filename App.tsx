
import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { auth, initStorage } from './firebase';
import LandingPage from './views/LandingPage';
import Dashboard from './views/Dashboard';
import AdminPanel from './views/AdminPanel';
import Login from './views/Login';
import Signup from './views/Signup';
import SubscriptionPage from './views/SubscriptionPage';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

type ViewState = 'LANDING' | 'LOGIN' | 'SIGNUP' | 'DASHBOARD' | 'ADMIN' | 'SUBSCRIPTION';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('LANDING');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    initStorage();
    const user = auth.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentView(user.role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD');
    }
    setLoading(false);
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogout = () => {
    auth.logout();
    setCurrentUser(null);
    setCurrentView('LANDING');
    showNotification("Logged out successfully", 'success');
  };

  const navigateTo = (view: ViewState) => setCurrentView(view);
  
  const refreshUser = () => {
    const user = auth.getCurrentUser();
    setCurrentUser(user);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f121d] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f121d] relative">
      {/* Global Notification Component */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none animate-in slide-in-from-top-10 duration-300">
          <div className={`px-8 py-4 rounded-2xl flex items-center gap-4 border-2 shadow-2xl backdrop-blur-xl pointer-events-auto ${
            notification.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-xs font-black uppercase tracking-[0.2em]">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {currentView === 'LANDING' && <LandingPage onNavigate={navigateTo} />}
      
      {currentView === 'LOGIN' && <Login 
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentView(user.role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD');
          showNotification(`${user.name} identified. Login successful.`, 'success');
        }} 
        onNavigate={navigateTo} 
      />}
      
      {currentView === 'SIGNUP' && <Signup 
        onSignupSuccess={(user) => {
          setCurrentUser(user);
          setCurrentView('DASHBOARD');
          showNotification("Portfolio initialized. Welcome to Abragim.", 'success');
        }} 
        onNavigate={navigateTo} 
      />}
      
      {currentView === 'DASHBOARD' && currentUser && (
        <Dashboard 
          user={currentUser} 
          onLogout={handleLogout} 
          onRefreshUser={refreshUser} 
          onNavigate={navigateTo}
          onNotify={showNotification}
        />
      )}
      
      {currentView === 'SUBSCRIPTION' && currentUser && (
        <SubscriptionPage 
          user={currentUser} 
          onBack={() => navigateTo('DASHBOARD')} 
          onRefreshUser={refreshUser}
          onNotify={showNotification}
        />
      )}
      
      {currentView === 'ADMIN' && currentUser && currentUser.role === 'ADMIN' && (
        <AdminPanel 
          user={currentUser} 
          onLogout={handleLogout} 
          onNotify={showNotification}
        />
      )}
    </div>
  );
};

export default App;
