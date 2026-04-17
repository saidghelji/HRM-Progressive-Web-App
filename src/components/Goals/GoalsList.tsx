import React, { useState } from 'react';
import { Plus, Target, Calendar, User, Filter, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Goal } from '../../types';
import { generateMockGoals } from '../../utils/storage';
import { useAuth } from '../../contexts/AuthContext';

interface GoalsListProps {
  onAddGoal: () => void;
  onGoalUpdate: (goal: Goal) => void;
}

const GoalsList: React.FC<GoalsListProps> = ({ onAddGoal }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', generateMockGoals());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const handleProgressUpdate = (goalId: string, newProgress: number) => {
    setGoals(prev => {
      const updatedGoals = prev.map(goal => 
        goal.id === goalId 
          ? { 
              ...goal, 
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'in-progress'
            }
          : goal
      );
      const updatedGoal = updatedGoals.find(goal => goal.id === goalId);
      if (updatedGoal) {
        onGoalUpdate(updatedGoal as Goal);
      }
      return updatedGoals;
    });
  };

  const handleStatusChange = (goalId: string, newStatus: Goal['status']) => {
    setGoals(prev => {
      const updatedGoals = prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, status: newStatus }
          : goal
      );
      const updatedGoal = updatedGoals.find(goal => goal.id === goalId);
      if (updatedGoal) {
        onGoalUpdate(updatedGoal);
      }
      return updatedGoals;
    });
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || goal.status === filterStatus;
    const matchesCategory = !filterCategory || goal.category === filterCategory;
    const matchesPriority = !filterPriority || goal.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'on-hold':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'not-started':
        return <Target className="h-4 w-4 text-gray-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance':
        return 'bg-blue-100 text-blue-800';
      case 'skill':
        return 'bg-purple-100 text-purple-800';
      case 'project':
        return 'bg-green-100 text-green-800';
      case 'career':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const goalStats = {
    total: goals.length,
    completed: goals.filter(g => g.status === 'completed').length,
    inProgress: goals.filter(g => g.status === 'in-progress').length,
    overdue: goals.filter(g => new Date(g.targetDate) < new Date() && g.status !== 'completed').length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Performance Goals</h2>
          {user?.role === 'admin' && (
            <button
              onClick={onAddGoal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Goal</span>
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Status</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
            
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Categories</option>
                <option value="performance">Performance</option>
                <option value="skill">Skill</option>
                <option value="project">Project</option>
                <option value="career">Career</option>
              </select>
            </div>
            
            <div className="relative">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-3xl font-bold text-gray-900">{goalStats.total}</p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{goalStats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{goalStats.inProgress}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-3xl font-bold text-red-600">{goalStats.overdue}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGoals.map((goal) => (
          <div key={goal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{goal.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{goal.employeeName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{new Date(goal.targetDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 mb-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(goal.status)}`}>
                    {goal.status.replace('-', ' ')}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getCategoryColor(goal.category)}`}>
                    {goal.category}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getPriorityColor(goal.priority)}`}>
                    {goal.priority} priority
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getStatusIcon(goal.status)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold text-gray-900">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Milestones */}
            {goal.milestones && goal.milestones.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Milestones</p>
                <div className="space-y-2">
                  {goal.milestones.slice(0, 3).map((milestone) => (
                    <div key={milestone.id} className="flex items-center space-x-2">
                      <CheckCircle className={`h-4 w-4 ${milestone.completed ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={`text-sm ${milestone.completed ? 'text-gray-900 line-through' : 'text-gray-600'}`}>
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                  {goal.milestones.length > 3 && (
                    <p className="text-xs text-gray-500">+{goal.milestones.length - 3} more milestones</p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            {user?.role === 'admin' && goal.status !== 'completed' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleProgressUpdate(goal.id, Math.min(100, goal.progress + 25))}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Update Progress
                </button>
                {goal.status === 'not-started' && (
                  <button
                    onClick={() => handleStatusChange(goal.id, 'in-progress')}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Start
                  </button>
                )}
                {goal.status === 'in-progress' && (
                  <button
                    onClick={() => handleStatusChange(goal.id, 'completed')}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Complete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Target className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or create a new goal.</p>
        </div>
      )}
    </div>
  );
};

export default GoalsList;

function onGoalUpdate(updatedGoal: Goal) {
  throw new Error('Function not implemented.');
}
