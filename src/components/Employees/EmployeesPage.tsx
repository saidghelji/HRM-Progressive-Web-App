import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Employee } from '../../types';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import EmployeeDetails from './EmployeeDetails';

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useLocalStorage<Employee[]>('employees', []);
  // Debug: log employees array whenever EmployeesPage renders
  console.log('EmployeesPage employees state:', employees);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleSaveEmployee = (employee: Employee) => {
    setEmployees(prev => {
      const exists = prev.some(e => e.id === employee.id);
      if (exists) {
        return prev.map(e => e.id === employee.id ? employee : e);
      } else {
        return [...prev, employee];
      }
    });
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  const handleViewEmployee = (employee: Employee) => {
    setViewingEmployee(employee);
  };

  const handleCloseDetails = () => {
    setViewingEmployee(null);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(e => e.id !== employeeId));
  };

  return (
    <>
      <EmployeeList
        employees={employees}
        onViewEmployee={handleViewEmployee}
        onEditEmployee={handleEditEmployee}
        onAddEmployee={handleAddEmployee}
        onDeleteEmployee={handleDeleteEmployee}
      />
      {isFormOpen && (
        <EmployeeForm
          initialData={editingEmployee || undefined}
          onClose={() => { setIsFormOpen(false); setEditingEmployee(null); }}
          onSave={handleSaveEmployee}
        />
      )}
      {viewingEmployee && (
        <EmployeeDetails
          employee={viewingEmployee}
          onClose={handleCloseDetails}
          onEdit={handleEditEmployee}
        />
      )}
    </>
  );
};

export default EmployeesPage;
