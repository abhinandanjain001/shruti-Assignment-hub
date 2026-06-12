export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  role: 'student' | 'professional' | 'admin';
  createdAt: string;
}

export type OrderStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface AcademicOrder {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  academicLevel: string;
  projectType: string;
  deadline: string;
  budgetRange: string;
  message: string;
  fileUrl?: string; // Optional path
  fileName?: string; // Optional display name
  status: OrderStatus;
  adminNotes?: string;
  quotedPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = 'new' | 'contacted' | 'closed';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

export interface FeaturedProject {
  id: string;
  title: string;
  description?: string;
  category: string;
  technologies: string[];
  academicLevel: string;
  gradeReceived: string;
  featured: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  studentName: string;
  course: string;
  academicLevel: string;
  rating: number;
  review: string;
  verified: boolean;
  createdAt: string;
}

export interface AcademicService {
  id: string;
  title: string;
  description: string;
  iconName: string;
  basePriceInquiry: string;
}
