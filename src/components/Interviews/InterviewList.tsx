import React, { useState } from 'react';
import { Plus, Calendar, Video, Phone, MapPin, Search, Filter, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Interview } from '../../types';
import { generateMockInterviews } from '../../utils/storage';
import { useAuth } from '../../contexts/AuthContext';

interface InterviewListProps {
  onAddInterview: () => void;
}

const InterviewList: React.FC<InterviewListProps> = ({ onAddInterview }) => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useLocalStorage<Interview[]>('interviews', generateMockInterviews());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  const handleStatusChange = (interviewId: string, newStatus: Interview['status']) => {
    setInterviews(prev => prev.map(interview => 
      interview.id === interviewId 
        ? { ...interview, status: newStatus }
        : interview
    ));
  };

  const handleDeleteInterview = (interviewId: string) => {
    setInterviews(prev => prev.filter(interview => interview.id !== interviewId));
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || interview.status === filterStatus;
    const matchesType = !filterType || interview.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'in-person':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const upcomingInterviews = interviews.filter(interview => 
    interview.status === 'scheduled' && new Date(interview.date) >= new Date()
  ).slice(0, 3);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Interviews</h2>

        </div>

        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search interviews..."
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
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>
            
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Types</option>
                <option value="video">Video</option>
                <option value="phone">Phone</option>
                <option value="in-person">In-Person</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Interviews Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Interviews</h3>
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-blue-600">
                      {getTypeIcon(interview.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{interview.candidateName}</p>
                      <p className="text-sm text-gray-600">{interview.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{new Date(interview.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">{interview.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Scheduled</span>
                <span className="font-semibold text-blue-600">{interviews.filter(i => i.status === 'scheduled').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">{interviews.filter(i => i.status === 'completed').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">This Week</span>
                <span className="font-semibold text-purple-600">
                  {interviews.filter(i => {
                    const interviewDate = new Date(i.date);
                    const now = new Date();
                    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                    return interviewDate >= now && interviewDate <= weekFromNow;
                  }).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interviews Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Candidate</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Position</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date & Time</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Interviewer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                {user?.role === 'admin' && (
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInterviews.map((interview) => (
                <tr key={interview.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {interview.candidateName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{interview.candidateName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{interview.position}</td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{new Date(interview.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-600">{interview.time}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(interview.type)}
                      <span className="capitalize text-gray-900">{interview.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{interview.interviewer}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                  </td>
                  {user?.role === 'admin' && (
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        {interview.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(interview.id, 'completed')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleStatusChange(interview.id, 'cancelled')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteInterview(interview.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInterviews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or schedule a new interview.</p>
        </div>
      )}
    </div>
  );
};

export default InterviewList;