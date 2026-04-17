import React, { useState } from 'react';
import { Interview } from '../../types';
import { X, Calendar, Video, Phone, MapPin } from 'lucide-react';

interface InterviewFormProps {
  onClose: () => void;
  onSave: (interviewData: Omit<Interview, 'id'>) => void;
  candidateId: string;
  candidateName: string;
  position: string;
}

const InterviewForm: React.FC<InterviewFormProps> = ({ 
  onClose, 
  onSave,
  candidateId,
  candidateName,
  position
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [type, setType] = useState<'phone' | 'video' | 'in-person'>('phone');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !interviewer) {
      alert('Please fill in all required fields.');
      return;
    }

    onSave({
      candidateId,
      candidateName,
      position,
      date,
      time,
      interviewer,
      status: 'scheduled',
      type,
      location,
      notes: notes || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Schedule Interview</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-blue-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Candidate</label>
            <p className="text-gray-900">{candidateName}</p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <p className="text-gray-900">{position}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date*</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time*</label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="interviewer" className="block text-sm font-medium text-gray-700">Interviewer*</label>
            <input
              type="text"
              id="interviewer"
              value={interviewer}
              onChange={(e) => setInterviewer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Interview Type*</label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setType('phone')}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center space-x-2 ${type === 'phone' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              >
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </button>
              <button
                type="button"
                onClick={() => setType('video')}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center space-x-2 ${type === 'video' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              >
                <Video className="h-4 w-4" />
                <span>Video</span>
              </button>
              <button
                type="button"
                onClick={() => setType('in-person')}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center space-x-2 ${type === 'in-person' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              >
                <MapPin className="h-4 w-4" />
                <span>In-Person</span>
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location/Link*</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder={type === 'phone' ? 'Phone number' : type === 'video' ? 'Video call link' : 'Office address'}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Schedule Interview
          </button>
        </div>
      </form>
    </div>
  );
};

export default InterviewForm;