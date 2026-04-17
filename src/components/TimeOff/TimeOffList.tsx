import React from 'react';
import { Plus, Calendar, Clock, Filter, CheckCircle, XCircle, AlertCircle, Trash } from 'lucide-react';
import { TimeOffRequest } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

// Plus is already imported in the first line with other Lucide icons

interface TimeOffListProps {
  requests: TimeOffRequest[];
  onAddRequest: () => void;
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
  onRemoveRequest: (id: string) => void;
}

const TimeOffList: React.FC<TimeOffListProps> = ({ requests, onAddRequest, onApproveRequest, onRejectRequest, onRemoveRequest }) => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = React.useState('');
  const [filterType, setFilterType] = React.useState('');

  const handleApprove = (requestId: string) => {
    onApproveRequest(requestId);
  };

  const handleReject = (requestId: string) => {
    onRejectRequest(requestId);
  };

  const handleRemove = (requestId: string) => {
    onRemoveRequest(requestId);
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = !filterStatus || request.status === filterStatus;
    const matchesType = !filterType || request.type === filterType;
    return matchesStatus && matchesType;
  });

  console.log('TimeOffList - requests prop:', requests);
  console.log('TimeOffList - filteredRequests:', filteredRequests);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vacation':
        return 'bg-blue-100 text-blue-800';
      case 'sick':
        return 'bg-red-100 text-red-800';
      case 'personal':
        return 'bg-purple-100 text-purple-800';
      case 'maternity':
      case 'paternity':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Time Off Requests</h2>
          {user?.role === 'employee' && (
            <button
              onClick={onAddRequest}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Request Time Off</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Types</option>
              <option value="vacation">Vacation</option>
              <option value="sick">Sick Leave</option>
              <option value="personal">Personal</option>
              <option value="maternity">Maternity</option>
              <option value="paternity">Paternity</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Employee</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Dates</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Days</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Reason</th>
                {user?.role === 'admin' && (
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {request.employeeName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{request.employeeName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getTypeColor(request.type)}`}>
                      {request.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-900">
                    <div>
                      <div className="font-medium">{new Date(request.startDate).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-600">to {new Date(request.endDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900 font-medium">{request.days}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      <span className={`text-sm font-medium capitalize ${
                        request.status === 'approved' ? 'text-green-600' :
                        request.status === 'rejected' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 max-w-xs truncate">{request.reason}</td>
                  {user?.role === 'admin' && (
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleRemove(request.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center space-x-1 transition-colors"
                        >
                          <Trash className="h-4 w-4" />
                          <span>Delete</span>
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

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No time off requests found</h3>
          <p className="text-gray-600">Try adjusting your filters or create a new request.</p>
        </div>
      )}
    </div>
  );
};

export default TimeOffList;