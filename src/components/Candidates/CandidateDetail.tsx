import React from 'react';
import { Candidate } from '../../types';
import { X, Mail, Phone, Briefcase, Calendar, User, Star, Hash } from 'lucide-react';

interface CandidateDetailProps {
  candidate: Candidate;
  onClose: () => void;

}

const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidate, onClose }) => {
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



  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Candidate Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-blue-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-3xl">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{candidate.name}</h3>
              <p className="text-lg text-gray-600">{candidate.position}</p>
              <span className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidate.status)}`}>
                {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 text-gray-700">
              <Mail className="h-5 w-5 text-blue-500" />
              <span>{candidate.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Phone className="h-5 w-5 text-green-500" />
              <span>{candidate.phone}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Briefcase className="h-5 w-5 text-purple-500" />
              <span>{candidate.experience} years of experience</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <User className="h-5 w-5 text-red-500" />
              <span>Source: {candidate.source}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Calendar className="h-5 w-5 text-yellow-500" />
              <span>Applied on: {new Date(candidate.applicationDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Hash className="h-5 w-5 text-gray-500" />
              <span>ID: {candidate.id}</span>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Skills</h4>
            {candidate.skills && candidate.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No skills listed.</p>
            )}
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Interviews</h4>
            {candidate.interviews && candidate.interviews.length > 0 ? (
              <ul className="space-y-2">
                {candidate.interviews.map((interview, index) => (
                  <li key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="font-medium">{interview.type} - {new Date(interview.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-700">Interviewer: {interview.interviewer}</p>
                    <p className="text-sm text-gray-700">Status: {interview.status}</p>
                    {interview.feedback && <p className="text-sm text-gray-700">Feedback: {String(interview.feedback)}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No interviews scheduled.</p>
            )}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>

        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;