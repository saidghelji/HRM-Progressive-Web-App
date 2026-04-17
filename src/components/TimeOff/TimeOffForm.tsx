import React, { useState } from 'react';
import { TimeOffRequest } from '../../types';

interface TimeOffFormProps {
  onSave: (request: TimeOffRequest) => void;
  onCancel: () => void;
}

const TimeOffForm: React.FC<TimeOffFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<TimeOffRequest>>({
    employeeId: '',
    employeeName: '',
    type: 'vacation',
    startDate: '',
    endDate: '',
    days: 1,
    reason: '',
    status: 'pending',
    requestDate: new Date().toISOString().split('T')[0],
  });

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: name === 'days' ? Number(value) : value };
      
      // Automatically calculate days when start or end date changes
      if ((name === 'startDate' || name === 'endDate') && newData.startDate && newData.endDate) {
        newData.days = calculateDays(newData.startDate, newData.endDate);
      }
      
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.employeeName || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields.');
      return;
    }
    const newRequest: TimeOffRequest = {
      id: String(Date.now()),
      employeeId: formData.employeeId!,
      employeeName: formData.employeeName!,
      type: formData.type!,
      startDate: formData.startDate!,
      endDate: formData.endDate!,
      days: formData.days || 1,
      reason: formData.reason || '',
      status: 'pending',
      requestDate: formData.requestDate || new Date().toISOString().split('T')[0],
    };
    onSave(newRequest);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h2 className="text-xl font-semibold">Request Time Off</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Employee ID*</label>
            <input 
              type="text" 
              name="employeeId" 
              value={formData.employeeId} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Employee Name*</label>
            <input 
              type="text" 
              name="employeeName" 
              value={formData.employeeName} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Type*</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required
            >
              <option value="vacation">Vacation</option>
              <option value="sick">Sick Leave</option>
              <option value="personal">Personal</option>
              <option value="maternity">Maternity</option>
              <option value="paternity">Paternity</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Start Date*</label>
              <input 
                type="date" 
                name="startDate" 
                value={formData.startDate} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">End Date*</label>
              <input 
                type="date" 
                name="endDate" 
                value={formData.endDate} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                required 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Days</label>
            <input 
              type="number" 
              name="days" 
              min={1} 
              value={formData.days} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea 
              name="reason" 
              value={formData.reason} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]" 
            />
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default TimeOffForm;