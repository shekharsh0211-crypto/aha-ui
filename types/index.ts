export type UserRole = 'ROLE_ADMIN' | 'ROLE_CUSTOMER' | 'ROLE_AGENT';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REBOOKED';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  active: boolean;
  emailVerified: boolean;
  companyId?: number;
  companyName?: string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string>;
  timestamp?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface StatusHistory {
  id: number;
  fromStatus?: BookingStatus;
  toStatus: BookingStatus;
  changedBy?: string;
  remarks?: string;
  createdAt: string;
}

export interface Booking {
  id: number;
  referenceNumber: string;
  status: BookingStatus;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDatetime: string;
  dropoffDatetime?: string;
  passengerCount?: number;
  specialInstructions?: string;
  totalAmount?: number;
  currency?: string;
  cancellationReason?: string;
  userId: number;
  userFullName: string;
  vehicleId?: number;
  vehiclePlate?: string;
  vehicleDescription?: string;
  rebookedFromId?: number;
  statusHistory?: StatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  inProgressBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  recentBookings: number;
}

export interface Feedback {
  id: number;
  bookingId?: number;
  bookingReference?: string;
  userId: number;
  userFullName: string;
  subject: string;
  message: string;
  rating?: number;
  ticketStatus: TicketStatus;
  isFeedback: boolean;
  parentId?: number;
  replies?: Feedback[];
  createdAt: string;
  updatedAt: string;
}

export interface RefData {
  id: number;
  category: string;
  code: string;
  label: string;
  description?: string;
  sortOrder?: number;
}

export interface BookingFilter {
  status?: BookingStatus;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}
