import React from 'react';
import { X, Mail, Phone, Building, Briefcase, Calendar, DollarSign, Users, User, Heart, Edit } from 'lucide-react';
import { Employee } from '../../types';

interface EmployeeDetailsProps {
  employee: Employee;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee, onClose, onEdit }) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 bg-gray-50 p-6 border-b border-gray-200 flex justify-between items-center shadow-md z-10">
          <h2 className="text-2xl font-bold text-gray-900">Employee Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Header with employee avatar and basic info */}
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-2xl">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{employee.name}</h3>
              <p className="text-lg text-gray-600">{employee.position || 'No Position'}</p>
              <div className="flex items-center mt-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {employee.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600">ID: {employee.employeeId}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{employee.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="text-gray-900">{employee.department || 'Not assigned'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="text-gray-900">{employee.position || 'Not assigned'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Hire Date</p>
                  <p className="text-gray-900">{formatDate(employee.hireDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="text-gray-900">
                    {employee.salary ? `$${employee.salary.toLocaleString()}` : 'Not provided'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-gray-900 capitalize">{employee.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
            {employee.emergencyContact?.name ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-gray-900">{employee.emergencyContact.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{employee.emergencyContact.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Relationship</p>
                    <p className="text-gray-900">{employee.emergencyContact.relationship || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No emergency contact information provided</p>
            )}
          </div>

          {/* Skills */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Skills</h4>
            {employee.skills && employee.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill) => (
                  <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No skills listed</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onEdit(employee)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Employee</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;