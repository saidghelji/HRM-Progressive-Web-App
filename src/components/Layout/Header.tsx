import { FC, useState, useRef, useEffect } from 'react';
 import { Bell, Search, User, LogOut, Menu, XCircle } from 'lucide-react';
 import { useAuth } from '../../contexts/AuthContext';
 import useMediaQuery from '../../hooks/useMediaQuery';
 import { useNotification } from '../../contexts/NotificationContext';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header: FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { notifications, removeNotification } = useNotification();
  const isMobile = !useMediaQuery('(min-width: 640px)');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close search and notification dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowMobileSearch(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 md:py-4 sticky top-0 z-40 safe-top">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2.5 rounded-md hover:bg-gray-100 text-gray-700"
            aria-label="Toggle menu"
          >
            <Menu className="h-7 w-7" />
          </button>
          <h1 className="text-xl sm:text-xl md:text-2xl font-bold text-gray-900 truncate max-w-[150px] sm:max-w-none">HRM Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 relative">
          {/* Search input - hidden on mobile, visible on tablet and up */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={isMobile ? "Search" : "Search..."}
              className="pl-8 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32 sm:w-40 md:w-64"
            />
          </div>
          
          {/* Mobile search button */}
          <button 
            onClick={() => setShowMobileSearch(true)}
            className="sm:hidden relative p-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Search className="h-6 w-6" />
          </button>
          
          {/* Mobile search dropdown */}
          {showMobileSearch && (
            <div ref={searchRef} className="absolute top-full right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-[95vw] sm:hidden z-50 animate-fadeIn">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 mx-auto">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-11 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      autoFocus
                    />
                  </div>
                  <button 
                    onClick={() => setShowMobileSearch(false)}
                    className="p-2 text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Notification bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 sm:p-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="h-6 w-6 sm:h-5 sm:w-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (notifications.length > 0 ? (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fadeIn overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start p-4 border-b border-gray-100 last:border-b-0 ${notification.type === 'success' ? 'bg-green-50' : notification.type === 'info' ? 'bg-blue-50' : 'bg-red-50'}`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(notification.id).toLocaleTimeString()}</p>
                      </div>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="ml-3 text-gray-400 hover:text-gray-600"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fadeIn p-4 text-center text-gray-500">
                No new notifications.
              </div>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-2 sm:space-x-2">
              <div className="h-9 w-9 sm:h-8 sm:w-8 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                <User className="h-4.5 w-4.5 sm:h-4 sm:w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[80px] md:max-w-none">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize truncate max-w-[80px] md:max-w-none">{user?.role}</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="p-2.5 sm:p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;