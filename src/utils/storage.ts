import { Employee, TimeOffRequest, Interview, Candidate, Goal } from '../types';

// Mock data generators
export const generateMockEmployees = (): Employee[] => [
  {
    id: '1',
    employeeId: 'EMP001',
    email: 'john.doe@company.com',
    name: 'John Doe',
    role: 'employee',
    department: 'Engineering',
    position: 'Senior Developer',
    phone: '+1 (555) 234-5678',
    hireDate: '2021-03-10',
    salary: 85000,
    status: 'active',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1 (555) 345-6789',
      relationship: 'Spouse'
    },
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    documents: []
  },
  {
    id: '2',
    employeeId: 'EMP002',
    email: 'alice.smith@company.com',
    name: 'Alice Smith',
    role: 'employee',
    department: 'Marketing',
    position: 'Marketing Manager',
    phone: '+1 (555) 345-6789',
    hireDate: '2020-06-15',
    salary: 75000,
    status: 'active',
    emergencyContact: {
      name: 'Bob Smith',
      phone: '+1 (555) 456-7890',
      relationship: 'Spouse'
    },
    skills: ['Digital Marketing', 'SEO', 'Analytics', 'Content Strategy'],
    documents: []
  },
  {
    id: '3',
    employeeId: 'EMP003',
    email: 'mike.johnson@company.com',
    name: 'Mike Johnson',
    role: 'employee',
    department: 'Sales',
    position: 'Sales Representative',
    phone: '+1 (555) 456-7890',
    hireDate: '2022-01-20',
    salary: 65000,
    status: 'active',
    emergencyContact: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 567-8901',
      relationship: 'Sister'
    },
    skills: ['Sales', 'CRM', 'Negotiation', 'Customer Relations'],
    documents: []
  },
  {
    id: '4',
    employeeId: 'EMP004',
    email: 'sarah.wilson@company.com',
    name: 'Sarah Wilson',
    role: 'employee',
    department: 'Design',
    position: 'UX Designer',
    phone: '+1 (555) 567-8901',
    hireDate: '2021-09-05',
    salary: 70000,
    status: 'active',
    emergencyContact: {
      name: 'Tom Wilson',
      phone: '+1 (555) 678-9012',
      relationship: 'Spouse'
    },
    skills: ['Figma', 'Sketch', 'User Research', 'Prototyping'],
    documents: []
  }
];

export const generateMockTimeOffRequests = (): TimeOffRequest[] => [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Doe',
    type: 'vacation',
    startDate: '2025-02-15',
    endDate: '2025-02-20',
    days: 5,
    reason: 'Family vacation',
    status: 'pending',
    requestDate: '2025-01-10'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Alice Smith',
    type: 'sick',
    startDate: '2025-01-08',
    endDate: '2025-01-10',
    days: 3,
    reason: 'Flu symptoms',
    status: 'approved',
    requestDate: '2025-01-07',
    approvedBy: 'Sarah Johnson',
    approvalDate: '2025-01-07'
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Mike Johnson',
    type: 'personal',
    startDate: '2025-02-01',
    endDate: '2025-02-01',
    days: 1,
    reason: 'Medical appointment',
    status: 'approved',
    requestDate: '2025-01-15',
    approvedBy: 'Sarah Johnson',
    approvalDate: '2025-01-16'
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'Sarah Wilson',
    type: 'vacation',
    startDate: '2025-03-10',
    endDate: '2025-03-15',
    days: 5,
    reason: 'Spring break',
    status: 'pending',
    requestDate: '2025-01-20'
  }
];

export const generateMockInterviews = (): Interview[] => [
  {
    id: '1',
    candidateId: '1',
    candidateName: 'Emma Wilson',
    position: 'Frontend Developer',
    date: '2025-01-25',
    time: '10:00',
    interviewer: 'John Doe',
    status: 'scheduled',
    location: 'Conference Room A',
    type: 'in-person'
  },
  {
    id: '2',
    candidateId: '2',
    candidateName: 'David Brown',
    position: 'UX Designer',
    date: '2025-01-26',
    time: '14:00',
    interviewer: 'Sarah Wilson',
    status: 'scheduled',
    location: 'Video Call',
    type: 'video'
  },
  {
    id: '3',
    candidateId: '3',
    candidateName: 'Lisa Chen',
    position: 'Marketing Specialist',
    date: '2025-01-24',
    time: '11:00',
    interviewer: 'Alice Smith',
    status: 'completed',
    location: 'Phone Call',
    type: 'phone'
  },
  {
    id: '4',
    candidateId: '4',
    candidateName: 'Robert Taylor',
    position: 'Sales Manager',
    date: '2025-01-27',
    time: '15:30',
    interviewer: 'Mike Johnson',
    status: 'scheduled',
    location: 'Conference Room B',
    type: 'in-person'
  }
];

export const generateMockCandidates = (): Candidate[] => [
  {
    id: '1',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+1 (555) 678-9012',
    position: 'Frontend Developer',
    status: 'interviewing',
    applicationDate: '2025-01-05',
    source: 'LinkedIn',
    experience: 3,
    skills: ['React', 'Vue.js', 'CSS', 'JavaScript', 'TypeScript'],
    coverLetter: 'I am excited to apply for the Frontend Developer position...',
    interviews: []
  },
  {
    id: '2',
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '+1 (555) 789-0123',
    position: 'UX Designer',
    status: 'screening',
    applicationDate: '2025-01-08',
    source: 'Company Website',
    experience: 5,
    skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Adobe XD'],
    coverLetter: 'With over 5 years of UX design experience...',
    interviews: []
  },
  {
    id: '3',
    name: 'Lisa Chen',
    email: 'lisa.chen@email.com',
    phone: '+1 (555) 890-1234',
    position: 'Marketing Specialist',
    status: 'hired',
    applicationDate: '2025-01-03',
    source: 'Referral',
    experience: 4,
    skills: ['Digital Marketing', 'SEO', 'Content Marketing', 'Analytics', 'Social Media'],
    coverLetter: 'I am passionate about digital marketing...',
    interviews: []
  },
  {
    id: '4',
    name: 'Robert Taylor',
    email: 'robert.taylor@email.com',
    phone: '+1 (555) 901-2345',
    position: 'Sales Manager',
    status: 'applied',
    applicationDate: '2025-01-12',
    source: 'Job Board',
    experience: 7,
    skills: ['Sales Management', 'Team Leadership', 'CRM', 'Business Development'],
    coverLetter: 'With extensive sales management experience...',
    interviews: []
  },
  {
    id: '5',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@email.com',
    phone: '+1 (555) 012-3456',
    position: 'Data Analyst',
    status: 'rejected',
    applicationDate: '2025-01-01',
    source: 'LinkedIn',
    experience: 2,
    skills: ['Python', 'SQL', 'Tableau', 'Excel', 'Statistics'],
    coverLetter: 'I am interested in the Data Analyst position...',
    interviews: []
  }
];

export const generateMockGoals = (): Goal[] => [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Doe',
    title: 'Complete React Certification',
    description: 'Obtain advanced React certification from reputable online platform',
    category: 'skill',
    priority: 'high',
    status: 'in-progress',
    progress: 60,
    targetDate: '2025-03-31',
    createdDate: '2025-01-01',
    assignedBy: 'Sarah Johnson',
    milestones: [
      { id: '1', title: 'Complete React Fundamentals', completed: true, completedDate: '2025-01-15' },
      { id: '2', title: 'Complete Advanced React Concepts', completed: true, completedDate: '2025-01-25' },
      { id: '3', title: 'Complete Final Project', completed: false },
      { id: '4', title: 'Pass Certification Exam', completed: false }
    ]
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Alice Smith',
    title: 'Launch Q1 Marketing Campaign',
    description: 'Plan and execute comprehensive marketing campaign for new product launch',
    category: 'project',
    priority: 'high',
    status: 'in-progress',
    progress: 75,
    targetDate: '2025-03-15',
    createdDate: '2024-12-01',
    assignedBy: 'Sarah Johnson',
    milestones: [
      { id: '1', title: 'Market Research', completed: true, completedDate: '2024-12-15' },
      { id: '2', title: 'Campaign Strategy', completed: true, completedDate: '2025-01-05' },
      { id: '3', title: 'Creative Development', completed: true, completedDate: '2025-01-20' },
      { id: '4', title: 'Campaign Launch', completed: false }
    ]
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Mike Johnson',
    title: 'Increase Sales by 20%',
    description: 'Achieve 20% increase in quarterly sales compared to previous quarter',
    category: 'performance',
    priority: 'high',
    status: 'in-progress',
    progress: 45,
    targetDate: '2025-03-31',
    createdDate: '2025-01-01',
    assignedBy: 'Sarah Johnson',
    milestones: [
      { id: '1', title: 'Identify new prospects', completed: true, completedDate: '2025-01-10' },
      { id: '2', title: 'Develop sales strategy', completed: true, completedDate: '2025-01-20' },
      { id: '3', title: 'Execute outreach campaign', completed: false },
      { id: '4', title: 'Close deals', completed: false }
    ]
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'Sarah Wilson',
    title: 'Complete UX Research Course',
    description: 'Enhance UX research skills through comprehensive online course',
    category: 'skill',
    priority: 'medium',
    status: 'completed',
    progress: 100,
    targetDate: '2025-02-28',
    createdDate: '2024-12-15',
    assignedBy: 'Sarah Johnson',
    milestones: [
      { id: '1', title: 'Complete course modules', completed: true, completedDate: '2025-02-15' },
      { id: '2', title: 'Submit final project', completed: true, completedDate: '2025-02-25' },
      { id: '3', title: 'Receive certification', completed: true, completedDate: '2025-02-28' }
    ]
  },
  {
    id: '5',
    employeeId: '1',
    employeeName: 'John Doe',
    title: 'Lead Team Project',
    description: 'Take leadership role in upcoming product development project',
    category: 'career',
    priority: 'medium',
    status: 'not-started',
    progress: 0,
    targetDate: '2025-06-30',
    createdDate: '2025-01-15',
    assignedBy: 'Sarah Johnson',
    milestones: [
      { id: '1', title: 'Project planning', completed: false },
      { id: '2', title: 'Team coordination', completed: false },
      { id: '3', title: 'Project delivery', completed: false }
    ]
  }
];