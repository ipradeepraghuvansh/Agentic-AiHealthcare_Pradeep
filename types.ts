
export enum AppointmentStatus {
  Booked = 'Booked',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export enum UserRole {
  Patient = 'Patient',
  Doctor = 'Doctor',
}

export interface DoctorProfile {
  licenseNumber?: string;
  yearsExperience?: string;
  medicalSchool?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicContact?: string;
  consultationHours?: string;
  bio?: string;
}

export interface Doctor extends DoctorProfile {
  id: string;
  name: string;
  specialization: string;
  email: string;
}

export interface PatientProfile {
    bloodType?: string;
    allergies?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
}

export interface User extends DoctorProfile, PatientProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  specialization?: string; // Only for doctors
  phone?: string;
  dob?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  userId: string;
  userName: string;
  dateTime: Date;
  reason: string;
  status: AppointmentStatus;
}
