import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Target, Clock, Award, AlertTriangle, UserCheck } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Employee, TimeOffRequest, Goal, Candidate, Interview } from '../../types';
import { generateMockEmployees, generateMockTimeOffRequests, generateMockGoals, generateMockCandidates, generateMockInterviews } from '../../utils/storage';

const Analytics: React.FC = () => {
  const [employees] = useLocalStorage<Employee[]>('employees', generateMockEmployees());
  const [timeOffRequests] = useLocalStorage<TimeOffRequest[]>('timeOffRequests', generateMockTimeOffRequests());
  const [goals] = useLocalStorage<Goal[]>('goals', generateMockGoals());
  const [candidates] = useLocalStorage<Candidate[]>('candidates', generateMockCandidates());
  const [interviews] = useLocalStorage<Interview[]>('interviews', generateMockInterviews());
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Calculate analytics data
  const analytics = {
    workforce: {
      total: employees.length,
      active: employees.filter(e => e.status === 'active').length,
      byDepartment: employees.reduce((acc, emp) => {
        if (emp.department) {
          acc[emp.department] = (acc[emp.department] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
      avgTenure: employees.length > 0 ? employees.reduce((acc, emp) => {
        if (emp.hireDate) {
          const years = (new Date().getTime() - new Date(emp.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
          return acc + years;
        }
        return acc;
      }, 0) / employees.length : 0,
    },
    timeOff: {
      total: timeOffRequests.length,
      approved: timeOffRequests.filter(r => r.status === 'approved').length,
      pending: timeOffRequests.filter(r => r.status === 'pending').length,
      rejected: timeOffRequests.filter(r => r.status === 'rejected').length,
      avgDays: timeOffRequests.length > 0 ? timeOffRequests.reduce((acc, req) => acc + req.days, 0) / timeOffRequests.length : 0,
      byType: timeOffRequests.reduce((acc, req) => {
        acc[req.type] = (acc[req.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    },
    goals: {
      total: goals.length,
      completed: goals.filter(g => g.status === 'completed').length,
      inProgress: goals.filter(g => g.status === 'in-progress').length,
      avgProgress: goals.length > 0 ? goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length : 0,
      byCategory: goals.reduce((acc, goal) => {
        acc[goal.category] = (acc[goal.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    },
    recruitment: {
      totalCandidates: candidates.length,
      hired: candidates.filter(c => c.status === 'hired').length,
      interviewing: candidates.filter(c => c.status === 'interviewing').length,
      rejected: candidates.filter(c => c.status === 'rejected').length,
      hireRate: candidates.length > 0 ? (candidates.filter(c => c.status === 'hired').length / candidates.length) * 100 : 0,
      avgExperience: candidates.length > 0 ? candidates.reduce((acc, candidate) => acc + candidate.experience, 0) / candidates.length : 0,
      bySource: candidates.reduce((acc, candidate) => {
        acc[candidate.source] = (acc[candidate.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    },
    interviews: {
      total: interviews.length,
      scheduled: interviews.filter(i => i.status === 'scheduled').length,
      completed: interviews.filter(i => i.status === 'completed').length,
      cancelled: interviews.filter(i => i.status === 'cancelled').length,
      byType: interviews.reduce((acc, interview) => {
        acc[interview.type] = (acc[interview.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    }
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: React.ComponentType<any>;
    color: string;
  }> = ({ title, value, change, changeType = 'neutral', icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ChartCard: React.FC<{
    title: string;
    data: Record<string, number>;
    type: 'bar' | 'pie';
  }> = ({ title, data, type }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => {
          const percentage = (value / Math.max(...Object.values(data))) * 100;
          return (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-sm font-medium text-gray-700 capitalize min-w-0 flex-1">
                  {key.replace('-', ' ')}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-900 min-w-8 text-right">{value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
          <div className="flex space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        <p className="text-gray-600">Comprehensive insights into your organization's performance and metrics.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Active Employees"
          value={analytics.workforce.active}
          change={analytics.workforce.active === analytics.workforce.total ? "All active" : `${analytics.workforce.active}/${analytics.workforce.total}`}
          changeType="neutral"
          icon={Users}
          color="bg-green-500"
        />
        <MetricCard
          title="Pending Time Off"
          value={analytics.timeOff.pending}
          change={analytics.timeOff.pending > 0 ? `${analytics.timeOff.pending} pending` : "No pending"}
          changeType={analytics.timeOff.pending > 0 ? "negative" : "neutral"}
          icon={Clock}
          color="bg-yellow-500"
        />
        <MetricCard
          title="Open Positions"
          value={analytics.recruitment.totalCandidates - analytics.recruitment.hired}
          change={analytics.recruitment.hired > 0 ? `${analytics.recruitment.hired} hired` : "No hires yet"}
          changeType={analytics.recruitment.hired > 0 ? "positive" : "neutral"}
          icon={UserCheck}
          color="bg-blue-500"
        />
        <MetricCard
          title="Rejected Candidates"
          value={analytics.recruitment.rejected}
          change={analytics.recruitment.rejected > 0 ? `${analytics.recruitment.rejected} rejected` : "None rejected"}
          changeType={analytics.recruitment.rejected > 0 ? "negative" : "neutral"}
          icon={Award}
          color="bg-red-500"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <ChartCard
          title="Employees by Department"
          data={analytics.workforce.byDepartment}
          type="bar"
        />
        <ChartCard
          title="Time Off by Type"
          data={analytics.timeOff.byType}
          type="pie"
        />
        <ChartCard
          title="Goals by Category"
          data={analytics.goals.byCategory}
          type="bar"
        />
        <ChartCard
          title="Candidates by Source"
          data={analytics.recruitment.bySource}
          type="pie"
        />
        <ChartCard
          title="Interviews by Type"
          data={analytics.interviews.byType}
          type="bar"
        />
        {/* Performance Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Goals Completed</span>
              <span className="font-semibold text-green-600">{analytics.goals.completed}/{analytics.goals.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Time Off Approved</span>
              <span className="font-semibold text-blue-600">{analytics.timeOff.approved}/{analytics.timeOff.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Interviews Completed</span>
              <span className="font-semibold text-purple-600">{analytics.interviews.completed}/{analytics.interviews.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Candidates Hired</span>
              <span className="font-semibold text-green-600">{analytics.recruitment.hired}/{analytics.recruitment.totalCandidates}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trends and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Goal completion rate is above average</p>
                <p className="text-xs text-gray-600">Teams are consistently meeting their performance targets</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Time off requests are increasing</p>
                <p className="text-xs text-gray-600">Consider reviewing workload distribution</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Award className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Strong recruitment pipeline</p>
                <p className="text-xs text-gray-600">High-quality candidates are being attracted</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Optimize Interview Process</p>
              <p className="text-xs text-blue-700 mt-1">Consider streamlining the interview process to reduce time-to-hire</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-900">Expand Goal Categories</p>
              <p className="text-xs text-green-700 mt-1">Introduce more diverse goal types to enhance employee development</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-900">Improve Retention</p>
              <p className="text-xs text-purple-700 mt-1">Focus on career development programs to increase average tenure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;