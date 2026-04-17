import React, { useState } from 'react';
import { Plus, Search, Filter, Mail, Phone, FileText, Star, Eye, Edit, Trash2 } from 'lucide-react';
import CandidateForm from './CandidateForm';
import CandidateDetail from './CandidateDetail';
import InterviewForm from '../Interviews/InterviewForm';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Candidate, Interview, Employee } from '../../types';
import { generateMockCandidates } from '../../utils/storage';
import { useAuth } from '../../contexts/AuthContext';

interface CandidateListProps {
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  onAddCandidate: () => void;
  onViewCandidate: (candidate: Candidate) => void;
}

const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  setCandidates,
  onAddCandidate,
  onViewCandidate
}) => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useLocalStorage<Interview[]>('interviews', []);
  const [employees, setEmployees] = useLocalStorage<Employee[]>('employees', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isInterviewFormOpen, setIsInterviewFormOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [viewedCandidate, setViewedCandidate] = useState<Candidate | null>(null);

  const handleAddCandidateClick = () => {
    setSelectedCandidate(null);
    setIsFormOpen(true);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsFormOpen(true);
  };

  const handleSaveCandidate = (candidateData: Candidate | Omit<Candidate, 'id' | 'status'>) => {
    if ('id' in candidateData) {
      // Update existing candidate
      setCandidates(prev => prev.map(c => c.id === candidateData.id ? (candidateData as Candidate) : c));
    } else {
      // Add new candidate
      const newCandidate: Candidate = {
        id: Date.now().toString(), // Simple unique ID generation
        status: 'applied',
        ...candidateData,
      };
      setCandidates(prev => [...prev, newCandidate]);
    }
    setIsFormOpen(false);
  };

  const handleScheduleInterview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsFormOpen(false);
    setIsDetailOpen(false);
    setIsInterviewFormOpen(true);
    // Do NOT set status to 'interviewing' here
  };

  const handleSaveInterview = (interviewData: Omit<Interview, 'id'>) => {
    const newInterview: Interview = {
      ...interviewData,
      id: Date.now().toString()
    };
    setInterviews(prev => [...prev, newInterview]);
    setIsInterviewFormOpen(false);
    setSelectedCandidate(null);
    // Set candidate status to 'interviewing' only after interview is scheduled
    setCandidates(prev => prev.map(c =>
      c.id === interviewData.candidateId ? { ...c, status: 'interviewing' } : c
    ));
    window.location.href = '/interviews';
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCandidate(null);
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setViewedCandidate(candidate);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setViewedCandidate(null);
  };

  const handleStatusChange = (candidateId: string, newStatus: Candidate['status']) => {
    if (newStatus === 'hired') {
      setCandidates(prev => prev.map(candidate =>
        candidate.id === candidateId
          ? { ...candidate, status: 'hired' }
          : candidate
      ));
      const candidate = candidates.find(c => c.id === candidateId);
      if (candidate) {
        const newEmployee: Employee = {
          ...candidate,
          id: Date.now().toString(), // New unique ID
          employeeId: Date.now().toString(), // Assign a unique employeeId
          status: 'active', // Ensure status is always 'active' for employees
          role: 'employee', // Assign a default role for the employee
          // Optionally, add any employee-specific fields here
        };
        setEmployees(empPrev => [...empPrev, newEmployee]);
      }
    } else {
      setCandidates(prev => prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, status: newStatus }
          : candidate
      ));
    }
  };

  const handleDeleteCandidate = (candidateId: string) => {
    setCandidates(prev => prev.filter(candidate => candidate.id !== candidateId));
  };

  const positions = [...new Set(candidates.map(candidate => candidate.position))];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || candidate.status === filterStatus;
    const matchesPosition = !filterPosition || candidate.position === filterPosition;
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'screening':
        return 'bg-yellow-100 text-yellow-800';
      case 'interviewing':
        return 'bg-purple-100 text-purple-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const visibleCandidates = candidates.filter(candidate => candidate.status !== 'screening');
  const candidateStats = {
    total: visibleCandidates.length,
    applied: visibleCandidates.filter(c => c.status === 'applied').length,
    interviewing: visibleCandidates.filter(c => c.status === 'interviewing').length,
    hired: visibleCandidates.filter(c => c.status === 'hired').length,
    rejected: visibleCandidates.filter(c => c.status === 'rejected').length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Candidates</h2>
          {user?.role === 'admin' && (
            <button
              onClick={handleAddCandidateClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Candidate</span>
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search candidates..."
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
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="relative">
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Positions</option>
                {positions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <CandidateForm
          onClose={handleCloseForm}
          onSave={handleSaveCandidate}
          candidate={selectedCandidate || undefined}
        />
      )}

      {isDetailOpen && viewedCandidate && (
        <CandidateDetail
          candidate={viewedCandidate}
          onClose={handleCloseDetail}
        />
      )}
      
      {isInterviewFormOpen && selectedCandidate && (
        <InterviewForm
          onClose={() => setIsInterviewFormOpen(false)}
          onSave={handleSaveInterview}
          candidateId={selectedCandidate.id}
          candidateName={selectedCandidate.name}
          position={selectedCandidate.position}
        />
      )}

      {/* Candidate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
          <span className="text-2xl font-bold mb-2">{candidateStats.total}</span>
          <span className="text-gray-500">Total Candidates</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
          <span className="text-2xl font-bold mb-2 text-blue-600">{candidateStats.applied}</span>
          <span className="text-gray-500">Applied</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
          <span className="text-2xl font-bold mb-2 text-purple-600">{candidateStats.interviewing}</span>
          <span className="text-gray-500">Interviewing</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
          <span className="text-2xl font-bold mb-2 text-green-600">{candidateStats.hired}</span>
          <span className="text-gray-500">Hired</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
          <span className="text-2xl font-bold mb-2 text-red-600">{candidateStats.rejected}</span>
          <span className="text-gray-500">Rejected</span>
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-lg">
          No Candidates found.
        </div>) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.filter(candidate => candidate.status !== 'screening').map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                  <p className="text-sm text-gray-600">{candidate.position}</p>
                </div>
              </div>

              <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(candidate.status)}`}>
                {candidate.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{candidate.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{candidate.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Star className="h-4 w-4" />
                <span>{candidate.experience} years experience</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Source:</span> {candidate.source}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    +{candidate.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-2 w-full">
              <button
                 onClick={() => handleDeleteCandidate(candidate.id)}
                 className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 h-10 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors"
               >
                 <Trash2 className="h-4 w-4" />
                 <span>Delete</span>
               </button>
              <button 
                 onClick={() => onViewCandidate(candidate)}
                 className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 h-10 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
              {user?.role === 'admin' && (
                 <>
                   <button
                     onClick={() => handleEditCandidate(candidate)}
                     className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 h-10 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors"
                   >
                     <Edit className="h-4 w-4" />
                     <span>Edit</span>
                   </button>
                  {!(candidate.status === 'rejected' || candidate.status === 'hired' || candidate.status === 'interviewing') && (
                    <button
                      onClick={() => handleScheduleInterview(candidate)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 h-10 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors"
                    >
                      <span className="text-xs">Schedule Interview</span>
                    </button>
                  )}
                  {candidate.status === 'applied' && (
                    <></>
                  )}
                </>
              )}
            </div>

            {user?.role === 'admin' && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex space-x-2">
                  {candidate.status === 'screening' && (
                    <></>
                  )}
                  {candidate.status === 'interviewing' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(candidate.id, 'hired')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Hire
                      </button>
                      <button
                        onClick={() => handleStatusChange(candidate.id, 'rejected')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default CandidateList;