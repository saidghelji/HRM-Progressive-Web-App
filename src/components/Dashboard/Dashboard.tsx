import React from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import { 
  Users, 
  UserCheck, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Award,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import KPICard from './KPICard';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Employee, TimeOffRequest, Candidate, Goal } from '../../types';
import { 
  generateMockEmployees, 
  generateMockTimeOffRequests, 
  generateMockCandidates, 
  generateMockGoals 
} from '../../utils/storage';

const Dashboard: React.FC = () => {
  const [employees] = useLocalStorage<Employee[]>('employees', generateMockEmployees());
  const [timeOffRequests] = useLocalStorage<TimeOffRequest[]>('timeOffRequests', generateMockTimeOffRequests());
  const [candidates] = useLocalStorage<Candidate[]>('candidates', generateMockCandidates());
  const [goals] = useLocalStorage<Goal[]>('goals', generateMockGoals());

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    pendingTimeOff: timeOffRequests.filter(r => r.status === 'pending').length,
    upcomingInterviews: 4,
    openPositions: 3,
    newCandidates: candidates.filter(c => c.status === 'applied').length,
    completedGoals: goals.filter(g => g.status === 'completed').length,
    averageProgress: Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
  };

  const recentTimeOff = timeOffRequests.slice(0, 5);
  const upcomingBirthdays = employees.slice(0, 3);
  const recentGoals = goals.filter(g => g.status === 'completed').slice(0, 3);

  // Use our custom hook to determine screen size
  const isMobile = !useMediaQuery('(min-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  
  return (
    <div className="p-5 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-2">Dashboard Overview</h2>
        <p className="text-base md:text-base text-gray-600">Welcome back! Here's what's happening in your organization.</p>
      </div>

      {/* KPI Cards - Responsive grid based on screen size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 mb-7 md:mb-8">
        <KPICard
          title="Total Employees"
          value={stats.totalEmployees}
          change="+2 this month"
          changeType="positive"
          icon={Users}
          color="blue"
        />
        <KPICard
          title="Pending Time Off"
          value={stats.pendingTimeOff}
          change="Awaiting approval"
          changeType="neutral"
          icon={Clock}
          color="yellow"
        />
        <KPICard
          title="Open Positions"
          value={stats.openPositions}
          change="2 urgent"
          changeType="negative"
          icon={UserCheck}
          color="red"
        />
        <KPICard
          title="Goals Progress"
          value={`${stats.averageProgress}%`}
          change="+5% this week"
          changeType="positive"
          icon={TrendingUp}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
        {/* Recent Time Off Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-4">
            <h3 className="text-lg md:text-lg font-semibold text-gray-900">Recent Time Off</h3>
            <Clock className="h-6 w-6 text-gray-500" />
          </div>
          <div className="space-y-4">
            {recentTimeOff.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{request.employeeName}</p>
                  <p className="text-sm text-gray-600">{request.type} • {request.days} days</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  request.status === 'approved' ? 'bg-green-100 text-green-800' :
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
            <Award className="h-6 w-6 text-gray-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Goal Completion Rate</span>
              <span className="text-sm font-bold text-green-600">87%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Average Rating</span>
              <span className="text-sm font-bold text-blue-600">4.2/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '84%' }}></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-4">
            <h3 className="text-lg md:text-lg font-semibold text-gray-900">Quick Actions</h3>
            <AlertCircle className="h-6 w-6 text-gray-500" />
          </div>
          <div className="space-y-4">
            <button className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Add New Employee</p>
                  <p className="text-sm text-blue-600">Create employee profile</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Schedule Interview</p>
                  <p className="text-sm text-green-600">Book candidate interview</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Review Requests</p>
                  <p className="text-sm text-purple-600">Approve time off requests</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;