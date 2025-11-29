
import { Appointment, AppointmentStatus, Doctor, User, UserRole } from '../types';

// Internal type for data storage with password
interface StoredUser extends User {
    password?: string;
}

// Initial Mock Data
export const DOCTORS: Doctor[] = [
    { 
        id: 'doc1', 
        name: 'Dr. Emily Carter', 
        specialization: 'Cardiology', 
        email: 'carter@clinic.com',
        bio: 'Dr. Emily Carter is a friendly Cardiologist with extensive experience in preventive care.',
        clinicName: 'Sunnyvale Heart Clinic',
        clinicAddress: '123 Main St, Sunnyvale, CA',
        clinicContact: '(555) 123-4567',
        consultationHours: 'Mon-Fri, 9AM-5PM',
        yearsExperience: '12'
    },
    { 
        id: 'doc2', 
        name: 'Dr. Ben Adams', 
        specialization: 'Neurologist', 
        email: 'adams@clinic.com', 
        bio: 'Specialist in migraines and neurological disorders.', 
        clinicName: 'Adams Neuro Center', 
        consultationHours: 'Mon-Thu, 8AM-4PM',
        yearsExperience: '8'
    },
    { 
        id: 'doc3', 
        name: 'Dr. Chloe Davis', 
        specialization: 'Pediatrician', 
        email: 'davis@clinic.com', 
        bio: 'Caring for children from infancy through adolescence.', 
        clinicName: 'Little Stars Pediatrics', 
        consultationHours: 'Mon-Fri, 8AM-6PM',
        yearsExperience: '5'
    },
    { 
        id: 'doc4', 
        name: 'Dr. Pradeep Raghuvanshi', 
        specialization: 'General physician', 
        email: 'pradeep@clinic.com', 
        bio: 'Comprehensive primary care for the whole family.', 
        clinicName: 'City General Health', 
        consultationHours: 'Daily, 9AM-9PM',
        yearsExperience: '15'
    },
    { 
        id: 'doc5', 
        name: 'Dr. Lokesh', 
        specialization: 'Gastroenterologist', 
        email: 'lokesh@clinic.com', 
        bio: 'Expert in digestive health and endoscopic procedures.', 
        clinicName: 'Digestive Health Inst', 
        consultationHours: 'Mon-Sat, 10AM-4PM',
        yearsExperience: '10'
    },
    { 
        id: 'doc6', 
        name: 'Dr. Anmol Alhawat', 
        specialization: 'Dermatologist', 
        email: 'anmol@clinic.com', 
        bio: 'Specializing in medical and cosmetic dermatology.', 
        clinicName: 'Clear Skin Institute', 
        consultationHours: 'Tue-Sat, 10AM-6PM',
        yearsExperience: '7'
    },
     { 
        id: 'doc7', 
        name: 'Dr. Sarah Smith', 
        specialization: 'Gynecologist', 
        email: 'sarah@clinic.com', 
        bio: 'Dedicated to women\'s health and wellness.', 
        clinicName: 'Women\'s Wellness Center', 
        consultationHours: 'Mon-Fri, 9AM-5PM',
        yearsExperience: '14'
    },
     { 
        id: 'doc8', 
        name: 'Dr. James Wilson', 
        specialization: 'General physician', 
        email: 'james@clinic.com', 
        bio: 'Experienced in treating chronic conditions.', 
        clinicName: 'Wilson Family Practice', 
        consultationHours: 'Mon-Sat, 8AM-12PM',
        yearsExperience: '20'
    },
];

const USERS: StoredUser[] = [
    { 
        id: 'user1', 
        name: 'Alex Johnson', 
        email: 'alex@patient.com', 
        role: UserRole.Patient,
        password: 'password123' 
    },
    ...DOCTORS.map(d => ({ 
        id: d.id, 
        name: d.name, 
        email: d.email, 
        role: UserRole.Doctor, 
        specialization: d.specialization,
        password: 'password123',
        bio: d.bio,
        clinicName: d.clinicName,
        clinicAddress: d.clinicAddress,
        clinicContact: d.clinicContact,
        consultationHours: d.consultationHours,
        yearsExperience: d.yearsExperience
    }))
];

let appointments: Appointment[] = [
  {
    id: 'appt1',
    doctorId: 'doc1',
    doctorName: 'Dr. Emily Carter',
    doctorSpecialization: 'Cardiology',
    userId: 'user1',
    userName: 'Alex Johnson',
    dateTime: new Date(new Date().setHours(14, 0, 0, 0) + 86400000), // Tomorrow 2 PM
    reason: 'Follow-up consultation',
    status: AppointmentStatus.Booked,
  },
  {
    id: 'appt2',
    doctorId: 'doc2',
    doctorName: 'Dr. Ben Adams',
    doctorSpecialization: 'Neurologist',
    userId: 'user1',
    userName: 'Alex Johnson',
    dateTime: new Date(new Date().setHours(10, 0, 0, 0) - 172800000), // 2 days ago 10 AM
    reason: 'Migraine Check',
    status: AppointmentStatus.Completed,
  },
  {
    id: 'appt3',
    doctorId: 'doc1',
    doctorName: 'Dr. Emily Carter',
    doctorSpecialization: 'Cardiology',
    userId: 'user1',
    userName: 'Alex Johnson',
    dateTime: new Date(new Date().setHours(9, 0, 0, 0)), // Today 9 AM
    reason: 'Routine Checkup',
    status: AppointmentStatus.Booked,
  }
];

export const BackendService = {
    login: async (email: string, password: string): Promise<User | null> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const user = USERS.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === password
        );

        if (!user) return null;

        const { password: _, ...safeUser } = user;
        return safeUser;
    },

    register: async (name: string, email: string, password: string, role: UserRole, details: Partial<User> = {}): Promise<User> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const existingUser = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            throw new Error("Email already in use.");
        }

        const newUser: StoredUser = {
            id: `user-${Date.now()}`,
            name,
            email,
            role,
            password, 
            ...details
        };

        USERS.push(newUser);
        
        if (role === UserRole.Doctor) {
            DOCTORS.push({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                specialization: newUser.specialization || 'General Practice',
                bio: newUser.bio,
                clinicName: newUser.clinicName,
                clinicAddress: newUser.clinicAddress,
                clinicContact: newUser.clinicContact,
                consultationHours: newUser.consultationHours,
                yearsExperience: newUser.yearsExperience
            });
        }

        const { password: _, ...safeUser } = newUser;
        return safeUser;
    },

    updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const userIndex = USERS.findIndex(u => u.id === id);
        if (userIndex === -1) throw new Error("User not found");

        const updatedUser = { ...USERS[userIndex], ...updates };
        USERS[userIndex] = updatedUser;

        // If doctor, update DOCTORS list too
        if (updatedUser.role === UserRole.Doctor) {
            const docIndex = DOCTORS.findIndex(d => d.id === id);
            if (docIndex !== -1) {
                DOCTORS[docIndex] = {
                    ...DOCTORS[docIndex],
                    ...updates as any
                };
            }
        }

        const { password: _, ...safeUser } = updatedUser;
        return safeUser;
    },

    getDoctors: (): Doctor[] => {
        return DOCTORS;
    },

    getAppointments: (user: User): Appointment[] => {
        if (user.role === UserRole.Patient) {
            return appointments.filter(a => a.userId === user.id);
        } else {
            return appointments.filter(a => a.doctorId === user.id);
        }
    },

    createAppointment: async (appt: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> => {
        await new Promise(resolve => setTimeout(resolve, 800)); 
        const newAppt: Appointment = {
            ...appt,
            id: `appt-${Date.now()}`,
            status: AppointmentStatus.Booked
        };
        appointments.push(newAppt);
        return newAppt;
    },

    updateAppointmentStatus: async (id: string, status: AppointmentStatus): Promise<void> => {
        const idx = appointments.findIndex(a => a.id === id);
        if (idx !== -1) {
            appointments[idx].status = status;
        }
    }
};
