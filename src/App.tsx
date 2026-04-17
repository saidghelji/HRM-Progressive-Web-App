import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import EmployeeForm from './components/Employees/EmployeeForm';
import EmployeeDetails from './components/Employees/EmployeeDetails';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import EmployeeList from './components/Employees/EmployeeList';
import TimeOffList from './components/TimeOff/TimeOffList';
import InterviewList from './components/Interviews/InterviewList';
import CandidateList from './components/Candidates/CandidateList';
import CandidateDetail from './components/Candidates/CandidateDetail';
import GoalsList from './components/Goals/GoalsList';
import Analytics from './components/Analytics/Analytics';
import Settings from './components/Settings/Settings';
import { Employee, TimeOffRequest, Candidate } from './types';
import { generateMockTimeOffRequests, generateMockEmployees, generateMockCandidates } from './utils/storage';

import TimeOffForm from './components/TimeOff/TimeOffForm';
import { useNotification } from './contexts/NotificationContext';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotification();
  console.log('Current user role:', user?.role);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [showTimeOffForm, setShowTimeOffForm] = useState(false);
  const [showCandidateDetail, setShowCandidateDetail] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);


  const [timeOffRequests, setTimeOffRequests] = useLocalStorage<TimeOffRequest[]>('timeOffRequests', generateMockTimeOffRequests());
  const [employees, setEmployees] = useLocalStorage<Employee[]>('employees', () => {
    const storedEmployees = localStorage.getItem('employees');
    return storedEmployees ? JSON.parse(storedEmployees) : generateMockEmployees();
  });
  const [candidates, setCandidates] = useLocalStorage<Candidate[]>('candidates', () => {
    const storedCandidates = localStorage.getItem('candidates');
    return storedCandidates ? JSON.parse(storedCandidates) : generateMockCandidates();
  });

  

  if (!isAuthenticated) {
    return <Login />;
  }

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeDetails(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowEmployeeForm(true);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    addNotification(`Employee deleted successfully!`, 'success');
  };

  const handleAddTimeOffRequest = () => {
    setShowTimeOffForm(true);
  };

  const handleSaveTimeOffRequest = (request: TimeOffRequest) => {
    setTimeOffRequests(prev => {
      const newState = [request, ...prev];
      return newState;
    });
    setShowTimeOffForm(false);
    addNotification({
      id: Date.now(),
      type: 'info',
      message: `Time off requested by ${request.employeeName} (${request.type})`,
    });
    if (activeTab === 'timeoff') {
      setActiveTab('dashboard');
      setTimeout(() => setActiveTab('timeoff'), 10);
    }
  };

  const handleCancelTimeOffRequest = () => {
    setShowTimeOffForm(false);
  };

  const handleApproveTimeOffRequest = (requestId: string) => {
    setTimeOffRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'approved', 
            approvedBy: 'Admin', // Replace with actual admin user from auth context
            approvalDate: new Date().toISOString().split('T')[0]
          }
        : req
    ));
  };

  const handleRejectTimeOffRequest = (requestId: string) => {
    setTimeOffRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'rejected', 
            approvedBy: 'Admin', // Replace with actual admin user from auth context
            approvalDate: new Date().toISOString().split('T')[0]
          }
        : req
    ));
  };

  const handleRemoveTimeOffRequest = (requestId: string) => {
    setTimeOffRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleAddInterview = () => {
    console.log('Add interview');
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateDetail(true);
  };

  const handleCloseCandidateDetail = () => {
    setShowCandidateDetail(false);
    setSelectedCandidate(null);
  };

  const handleHireCandidate = (candidateToHire: Candidate) => {
    const newEmployee: Employee = {
      id: candidateToHire.id,
      employeeId: `EMP${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
      email: candidateToHire.email,
      name: candidateToHire.name,
      role: 'employee',
      department: 'Unassigned',
      position: candidateToHire.position,
      phone: candidateToHire.phone,
      hireDate: new Date().toISOString().split('T')[0],
      salary: 0, // Default salary, can be updated later
      status: 'active',
      emergencyContact: { name: '', phone: '', relationship: '' }, // To be filled later
    };

    setEmployees(prev => {
      const updatedEmployees = [...prev, newEmployee];
      console.log('Updated employees after hire:', updatedEmployees);
      return updatedEmployees;
    });
    setCandidates(prev => prev.map(c => c.id === candidateToHire.id ? { ...c, status: 'hired' } : c));
    addNotification({
      id: Date.now(),
      type: 'success',
      message: `${candidateToHire.name} has been hired as an employee!`,
    });
    setShowCandidateDetail(false);
    setSelectedCandidate(null);
  };

  const handleAddGoal = (newGoal: Goal) => {
    setGoals(prev => {
      const goalWithId = { ...newGoal, id: Date.now().toString() };
      addNotification({
        id: Date.now(),
        type: 'success',
        message: `Goal "${newGoal.title}" for ${newGoal.employeeName} added successfully!`,
      });
      return [...prev, goalWithId];
    });
    setShowGoalForm(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return (
          <EmployeeList
            employees={employees}
            setEmployees={setEmployees}
            onViewEmployee={handleViewEmployee}
            onEditEmployee={handleEditEmployee}
            onAddEmployee={handleAddEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
        );
      case 'timeoff':
        return (
          <TimeOffList
            requests={timeOffRequests}
            onAddRequest={handleAddTimeOffRequest}
            onApproveRequest={handleApproveTimeOffRequest}
            onRejectRequest={handleRejectTimeOffRequest}
            onRemoveRequest={handleRemoveTimeOffRequest}
          />
        );
      case 'interviews':
        return <InterviewList onAddInterview={handleAddInterview} />;
      case 'candidates':
        return <CandidateList candidates={candidates} setCandidates={setCandidates} onViewCandidate={handleViewCandidate} onAddCandidate={() => setActiveTab('add-candidate')} />;

      case 'goals':
        return (
          <GoalsList
            onAddGoal={() => setShowGoalForm(true)}
            onGoalUpdate={(goal) => addNotification({
              id: Date.now(),
              type: 'success',
              message: `Goal "${goal.title}" for ${goal.employeeName} updated successfully!`,
            })}
          />
        );
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:static top-0 left-0 z-30 h-full`}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>

        {showCandidateDetail && selectedCandidate && (
          <CandidateDetail
            candidate={selectedCandidate}
            onClose={handleCloseCandidateDetail}
            onHire={handleHireCandidate}
          />
        )}
      </div>

      {showEmployeeForm && (
        <EmployeeForm 
          initialData={selectedEmployee || undefined}
          onClose={() => {
            setShowEmployeeForm(false);
            setSelectedEmployee(null);
          }} 
          onSave={(employee) => {
            console.log('Employee saved:', employee);
            setShowEmployeeForm(false);
            setSelectedEmployee(null);
            if (activeTab === 'employees') {
              setActiveTab('dashboard');
              setTimeout(() => setActiveTab('employees'), 10);
            }
          }} 
        />
      )}

      {showEmployeeDetails && selectedEmployee && (
        <EmployeeDetails
          employee={selectedEmployee}
          onClose={() => {
            setShowEmployeeDetails(false);
            setSelectedEmployee(null);
          }}
          onEdit={(employee) => {
            setShowEmployeeDetails(false);
            handleEditEmployee(employee);
          }}
        />
      )}

      {showTimeOffForm && (
        <TimeOffForm
          onSave={handleSaveTimeOffRequest}
          onCancel={handleCancelTimeOffRequest}
        />
      )}
    </div>
  );
};

import { NotificationProvider } from './contexts/NotificationContext';
import Notification from './components/Notification';
const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
        <Notification />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;