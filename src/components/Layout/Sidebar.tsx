import React from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  UserCheck, 
  Target, 
  Clock,
  BarChart3,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Employee, TimeOffRequest, Candidate } from '../../types';
import { generateMockEmployees, generateMockTimeOffRequests, generateMockCandidates } from '../../utils/storage';

interface SidebarProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  onTabChange?: (tab: string) => void;
  className?: string;
  onClose?: () => void;
}

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'employees', icon: Users, label: 'Employees' },
  { id: 'timeoff', icon: Clock, label: 'Time Off' },
  { id: 'interviews', icon: Calendar, label: 'Interviews' },
  { id: 'candidates', icon: UserCheck, label: 'Candidates' },
  { id: 'goals', icon: Target, label: 'Goals' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'settings', icon: Settings, label: 'Settings' }
];

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onTabChange, 
  className = '',
  onClose 
}) => {
  const { user } = useAuth();
  const [employees] = useLocalStorage<Employee[]>('employees', generateMockEmployees());
  const [timeOffRequests] = useLocalStorage<TimeOffRequest[]>('timeOffRequests', generateMockTimeOffRequests());
  const [candidates] = useLocalStorage<Candidate[]>('candidates', generateMockCandidates());
  // Use setActiveTab if provided, otherwise fall back to onTabChange
  const handleTabChange = (tab: string) => {
    if (setActiveTab) {
      setActiveTab(tab);
    } else if (onTabChange) {
      onTabChange(tab);
    }
    
    // On mobile, close the sidebar when a tab is selected
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };
  return (
    <div className={`bg-gray-900 text-white w-64 min-h-screen p-4 sm:p-5 overflow-y-auto hide-scrollbar ${className}`}>
      {onClose && (
        <button 
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 text-white hover:text-gray-300"
          aria-label="Close sidebar"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      )}
      <div className="mb-8 mt-2">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
            <Users className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold">HRM Pro</span>
        </div>
      </div>
      
      <nav className="space-y-2 md:space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          // Hide admin-only tabs for non-admin users
          if (user?.role !== 'admin' && ['employees', 'interviews', 'candidates', 'analytics'].includes(item.id)) {
            return null;
          }
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 md:px-4 md:py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-6 w-6 md:h-5 md:w-5" />
                <span className="font-medium text-base">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-5 w-5 md:h-4 md:w-4" />}
            </button>
          );
        })}
      </nav>
      
      <div className="mt-10 pt-8 border-t border-gray-700">
        <div className="bg-gray-800 rounded-lg p-5 shadow-md">
          <h4 className="text-base font-semibold mb-3">Quick Stats</h4>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Active Employees</span>
              <span className="text-green-400 font-medium">{employees.filter(e => e.status === 'active').length}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Requests</span>
              <span className="text-yellow-400 font-medium">{timeOffRequests.filter(r => r.status === 'pending').length}</span>
            </div>
            <div className="flex justify-between">
              <span>Open Positions</span>
              <span className="text-blue-400 font-medium">{candidates.filter(c => c.status === 'applied').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;