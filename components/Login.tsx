
import React, { useEffect } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user?: Partial<User>) => void;
  t: any;
  language: 'en' | 'he';
  setLanguage: (lang: 'en' | 'he') => void;
}

const LanguageSwitcher: React.FC<{ language: 'en' | 'he', setLanguage: (lang: 'en' | 'he') => void }> = ({ language, setLanguage }) => {
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'he' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="absolute top-4 right-4 flex items-center space-x-2 px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
      <span className="font-semibold uppercase text-gray-600 dark:text-gray-300">{language}</span>
    </button>
  );
};

const Login: React.FC<LoginProps> = ({ onLogin, t, language, setLanguage }) => {

    const handleGoogleResponse = (response: any) => {
        try {
            // Decode the JWT token to get user info
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const payload = JSON.parse(jsonPayload);
            
            onLogin({
                name: payload.name,
                email: payload.email,
                avatarUrl: payload.picture,
                id: payload.sub
            });
        } catch (e) {
            console.error("Error processing Google Login", e);
        }
    };

    useEffect(() => {
        // Initialize Google Sign-In
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with actual Client ID from Google Cloud Console
                callback: handleGoogleResponse
            });
            window.google.accounts.id.renderButton(
                document.getElementById("google-signin-button"),
                { theme: "outline", size: "large", width: "100%" }
            );
        }
    }, []);

  return (
    <div className="flex items-center justify-center min-h-screen relative text-gray-800 dark:text-gray-200">
      <LanguageSwitcher language={language} setLanguage={setLanguage} />
      <div className="text-center p-10 max-w-sm w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
        <h1 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">{t.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{t.subtitle}</p>
        
        {/* Container for Google Sign-In Button */}
        <div id="google-signin-button" className="mb-4 flex justify-center w-full h-[48px]"></div>
        
        {/* Divider or Alternative text */}
        <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">Demo Access</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Fallback/Mock Login Button */}
        <button 
            onClick={() => onLogin()} 
            className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 dark:border-slate-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
        >
          <span className="me-2">🚀</span> Mock Login (Galia)
        </button>
      </div>
    </div>
  );
};

export default Login;
