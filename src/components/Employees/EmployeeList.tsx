import React, { useState } from 'react';
import { Plus, Search, Filter, Mail, Phone, Edit, Eye } from 'lucide-react';
import { Employee } from '../../types';

interface EmployeeListProps {
  employees: Employee[];
  // setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  onViewEmployee: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
  onAddEmployee: () => void;
  onDeleteEmployee: (employeeId: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  onViewEmployee,
  onEditEmployee,
  onAddEmployee,
  onDeleteEmployee
}) => {
  // Debug: log employees prop on every render
  console.log('EmployeeList received employees:', employees);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Employees</h2>
          <button
            onClick={onAddEmployee}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Employee</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                  <p className="text-sm text-gray-600">{employee.position}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                employee.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {employee.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{employee.email}</span>
              </div>
              {employee.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{employee.phone}</span>
                </div>
              )}
              <div className="text-sm text-gray-600">
                <span className="font-medium">Department:</span> {employee.department}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Employee ID:</span> {employee.employeeId}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onViewEmployee(employee)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 h-10 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
              <button
                onClick={() => onEditEmployee(employee)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 h-10 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDeleteEmployee(employee.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 h-10 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or add a new employee.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;