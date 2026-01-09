
import React, { useState } from 'react';
import {
  LayoutDashboard,
  Utensils,
  Activity,
  Moon,
  Target,
  Trophy,
  User,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { authAPI } from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'nutrition', label: 'Nutrition', icon: <Utensils size={20} /> },
    { id: 'activities', label: 'Activities', icon: <Activity size={20} /> },
    { id: 'sleep', label: 'Sleep', icon: <Moon size={20} /> },
    { id: 'goals', label: 'Goals', icon: <Target size={20} /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  const handleLogout = () => {
    authAPI.logout();
    onLogout();
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Vitality</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-red-600 transition-colors group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-white z-50 transform transition-transform duration-300 lg:hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
                <span className="text-xl font-bold tracking-tight text-slate-900">Vitality</span>
             </div>
             <button onClick={() => setSidebarOpen(false)}><X size={24} /></button>
          </div>
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-slate-500'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-6 border-t border-slate-100">
             <button 
               onClick={handleLogout}
               className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-red-600"
             >
               <LogOut size={20} />
               <span>Logout</span>
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} className="text-slate-600" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search stats, meals, goals..."
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 w-64 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <button className="relative text-slate-500 hover:text-slate-900 transition">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white">3</span>
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">Alex Johnson</p>
                <p className="text-xs text-slate-500">Premium Plan</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-200 overflow-hidden border border-slate-100 ring-2 ring-slate-50">
                <img src="https://picsum.photos/id/64/100/100" alt="Profile" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
