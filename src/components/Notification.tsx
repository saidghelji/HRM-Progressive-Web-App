import React from 'react';
import { useNotification } from '../contexts/NotificationContext';

const typeStyles: Record<string, string> = {
  info: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
};

const Notification: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`px-4 py-2 rounded shadow-md flex items-center justify-between min-w-[220px] ${typeStyles[n.type || 'info']}`}
        >
          <span>{n.message}</span>
          <button
            className="ml-4 text-lg font-bold focus:outline-none"
            onClick={() => removeNotification(n.id)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;