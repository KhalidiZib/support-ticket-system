import React, { useState, useContext } from 'react';
import { Bell, Search, User, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotificationContext from '../../context/NotificationContext';

import ThemeToggle from '../ui/ThemeToggle';

export default function TopBar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { unreadCount } = useContext(NotificationContext);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md border-b border-secondary-200/60 dark:border-secondary-800 sticky top-0 z-30 flex items-center justify-between px-8 shadow-sm transition-colors duration-300">
      <div className="flex-1 max-w-2xl">
        <form
          onSubmit={handleSearchSubmit}
          className="relative group"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input
            type="text"
            className="w-full bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 group-focus-within:bg-white dark:group-focus-within:bg-secondary-900 text-secondary-700 dark:text-secondary-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all shadow-sm"
            placeholder="Search tickets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <span className="text-[10px] bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 px-1.5 py-0.5 rounded text-secondary-400 font-medium hidden sm:block">⌘K</span>
          </div>
        </form>
      </div>

      <div className="flex items-center space-x-4 pl-4">
        <ThemeToggle />
        <button
          className="relative p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all"
          onClick={() => navigate('/notifications')}
          title="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white">
            </span>
          )}
        </button>

        <div className="h-8 w-px bg-secondary-200 mx-2"></div>

        <button
          onClick={() => navigate('/profile')}
          className="flex items-center space-x-3 group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-secondary-800 dark:text-secondary-100 group-hover:text-primary-600 transition-colors">{user?.name}</p>
            <p className="text-xs text-secondary-500 dark:text-secondary-400">View Profile</p>
          </div>
          <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-secondary-100 to-secondary-50 border border-secondary-200 group-hover:border-primary-200 transition-colors shadow-sm overflow-hidden">
            {user?.avatarUrl ? (
              <img src={`http://localhost:8085/support-api${user.avatarUrl}`} alt="Me" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full bg-secondary-100 flex items-center justify-center text-secondary-400 rounded-full">
                <User size={18} />
              </div>
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
