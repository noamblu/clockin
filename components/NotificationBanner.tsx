
import React from 'react';

interface NotificationBannerProps {
  title: string;
  message: string;
  type?: 'warning' | 'error';
  onClose: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ title, message, type = 'warning', onClose }) => {
  const styles = {
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/50 border-yellow-400 dark:border-yellow-500',
      iconColor: 'text-yellow-400 dark:text-yellow-500',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      bodyColor: 'text-yellow-700 dark:text-yellow-300',
      hoverColor: 'hover:text-yellow-900 dark:hover:text-yellow-100',
      focusRing: 'focus:ring-yellow-500'
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/50 border-red-400 dark:border-red-500',
      iconColor: 'text-red-400 dark:text-red-500',
      textColor: 'text-red-800 dark:text-red-200',
      bodyColor: 'text-red-700 dark:text-red-300',
      hoverColor: 'hover:text-red-900 dark:hover:text-red-100',
      focusRing: 'focus:ring-red-500'
    }
  };

  const currentStyle = styles[type];

  return (
    <div className={`${currentStyle.container} border-l-4 p-4 mb-6 rounded-md shadow-md flex justify-between items-center`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className={`h-6 w-6 ${currentStyle.iconColor}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ms-3">
          <p className={`text-sm font-bold ${currentStyle.textColor}`}>{title}</p>
          <p className={`text-sm ${currentStyle.bodyColor}`}>{message}</p>
        </div>
      </div>
      <button onClick={onClose} className={`${currentStyle.textColor} ${currentStyle.hoverColor} p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentStyle.focusRing}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default NotificationBanner;
