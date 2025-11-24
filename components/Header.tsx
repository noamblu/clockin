
import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole, AppNotification } from '../types';

interface LanguageSwitcherProps {
  language: 'en' | 'he';
  setLanguage: (lang: 'en' | 'he') => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, setLanguage }) => {
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'he' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
      <span className="font-semibold uppercase">{language}</span>
    </button>
  );
};

interface ThemeSwitcherProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.95a1 1 0 10-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};


interface RoleSwitcherProps {
  t: any;
  user: User | null;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ t, user, userRole, setUserRole }) => {
  // Check if the user has the Admin role
  const isAdmin = user?.roles.includes(UserRole.Admin);

  return (
    <div className="flex items-center bg-slate-200 dark:bg-slate-700 rounded-md">
      {Object.values(UserRole).map((role) => {
        // Allow access if user has the specific role OR is an Admin
        if (user && !user.roles.includes(role) && !isAdmin) return null;
        
        return (
            <button
            key={role}
            onClick={() => setUserRole(role)}
            className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                userRole === role
                ? 'bg-indigo-500 text-white'
                : 'hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
            >
            {t[role.toLowerCase().replace(' ', '_')]}
            </button>
        );
      })}
    </div>
  );
};

interface NotificationBellProps {
    t: any;
    notifications: AppNotification[];
    onMarkAsRead: (id: string) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ t, notifications, onMarkAsRead }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getTypeColor = (type: string) => {
        switch(type) {
            case 'success': return 'text-green-500';
            case 'warning': return 'text-yellow-500';
            case 'error': return 'text-red-500';
            default: return 'text-blue-500';
        }
    };

    return (
        <div className="relative me-4" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-800"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700 font-semibold text-gray-800 dark:text-white flex justify-between items-center">
                        <span>{t.notifications}</span>
                        {unreadCount > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{unreadCount}</span>}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div 
                                    key={notification.id} 
                                    className={`p-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                >
                                    <div className="flex items-start">
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-800 dark:text-gray-200 mb-1">{notification.message}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(notification.date).toLocaleDateString()}</span>
                                                {!notification.isRead && (
                                                    <button 
                                                        onClick={() => onMarkAsRead(notification.id)}
                                                        className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                                                    >
                                                        {t.mark_as_read}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                                {t.no_notifications}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


interface HeaderProps {
  t: any;
  user: User | null;
  language: 'en' | 'he';
  setLanguage: (lang: 'en' | 'he') => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  onProfileClick: () => void;
  onLogoClick: () => void;
  notifications?: AppNotification[];
  onMarkNotificationRead?: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ t, user, language, setLanguage, userRole, setUserRole, onLogout, theme, setTheme, onProfileClick, onLogoClick, notifications, onMarkNotificationRead }) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onLogoClick}
            title="Go to Employee Dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white ms-3">{t.title}</h1>
          </div>
          <div className="hidden md:block">
            <RoleSwitcher t={t} user={user} userRole={userRole} setUserRole={setUserRole} />
          </div>
          <div className="flex items-center space-x-4">
             {user && notifications && onMarkNotificationRead && (
                <NotificationBell t={t} notifications={notifications} onMarkAsRead={onMarkNotificationRead} />
            )}
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
            {user && (
              <div className="flex items-center">
                <button 
                  onClick={onProfileClick}
                  className="flex items-center hover:bg-slate-100 dark:hover:bg-slate-700 px-2 py-1 rounded-md transition-colors group"
                >
                  <span className="hidden sm:inline font-medium me-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{user.name}</span>
                  <img className="h-10 w-10 rounded-full ring-2 ring-transparent group-hover:ring-indigo-500 transition-all" src={user.avatarUrl} alt="User Avatar" />
                </button>
                <button
                    onClick={onLogout}
                    className="ms-4 flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    aria-label={t.sign_out}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden sm:inline ms-2">{t.sign_out}</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="md:hidden pb-4 flex justify-center">
          <RoleSwitcher t={t} user={user} userRole={userRole} setUserRole={setUserRole} />
        </div>
      </div>
    </header>
  );
};

export default Header;
