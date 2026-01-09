import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Nutrition from './components/Nutrition';
import ActivityComponent from './components/Activity';
import LogActivity from './components/LogActivity';
import Sleep from './components/Sleep';
import Goals from './components/Goals';
import Achievements from './components/Achievements';
import Profile from './components/Profile';
import Auth from './components/Auth';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Derive activeTab from current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'dashboard';
    if (path.startsWith('/nutrition')) return 'nutrition';
    if (path.startsWith('/activities')) return 'activities';
    if (path.startsWith('/sleep')) return 'sleep';
    if (path.startsWith('/goals')) return 'goals';
    if (path.startsWith('/achievements')) return 'achievements';
    if (path.startsWith('/profile')) return 'profile';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleTabChange = (tab: string) => {
    const routes: Record<string, string> = {
      dashboard: '/dashboard',
      nutrition: '/nutrition',
      activities: '/activities',
      sleep: '/sleep',
      goals: '/goals',
      achievements: '/achievements',
      profile: '/profile',
    };
    navigate(routes[tab] || '/dashboard');
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onSuccess={handleAuthSuccess} />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/activities" element={<ActivityComponent />} />
        <Route path="/activities/log" element={<LogActivity />} />
        <Route path="/sleep" element={<Sleep />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
