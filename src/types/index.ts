export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee' | 'candidate';
  department?: string;
  position?: string;
  avatar?: string;
  phone?: string;
  hireDate?: string;
  salary?: number;
  status: 'active' | 'inactive';
}

export interface Employee extends User {
  employeeId: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  skills?: string[];
  documents?: Document[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  url: string;
}

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  approvedBy?: string;
  approvalDate?: string;
  comments?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  location: string;
  type: 'phone' | 'video' | 'in-person';
  notes?: string;
  feedback?: InterviewFeedback;
}

export interface InterviewFeedback {
  rating: number;
  strengths: string;
  weaknesses: string;
  recommendation: 'hire' | 'reject' | 'second-round';
  comments: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'applied' | 'screening' | 'interviewing' | 'hired' | 'rejected';
  applicationDate: string;
  resume?: Document;
  coverLetter?: string;
  source: string;
  experience: number;
  skills: string[];
  interviews: Interview[];
}

export interface Goal {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  description: string;
  category: 'performance' | 'skill' | 'project' | 'career';
  priority: 'low' | 'medium' | 'high';
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  targetDate: string;
  createdDate: string;
  assignedBy: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedDate?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingTimeOff: number;
  upcomingInterviews: number;
  openPositions: number;
  newCandidates: number;
  completedGoals: number;
  averageRating: number;
}