
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Appointment, User } from '../types';
import { AppointmentStatus, UserRole } from '../types';
import Header from './Header';
import AppointmentCard from './AppointmentCard';
import BookingModal from './BookingModal';
import AgenticBooking from './AgenticBooking';
import { BackendService } from '../services/mockBackend';
import { PlusIcon, CalendarIcon, UserCircleIcon } from './IconComponents';

interface DashboardProps {
    currentUser: User;
    onLogout: () => void;
    onUserUpdate?: (user: User) => void;
}

type FilterType = 'All' | AppointmentStatus;

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onLogout, onUserUpdate }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('All');
  const [isLoading, setIsLoading] = useState(true);

  // Profile Edit State for Doctors
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
      bio: '',
      clinicName: '',
      clinicAddress: '',
      consultationHours: '',
      clinicContact: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const fetchAppointments = useCallback(async () => {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 300));
      const data = BackendService.getAppointments(currentUser);
      setAppointments([...data]);
      setIsLoading(false);
  }, [currentUser]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Initialize edit form when entering edit mode or user changes
  useEffect(() => {
    if (currentUser) {
        setEditForm({
            bio: currentUser.bio || '',
            clinicName: currentUser.clinicName || '',
            clinicAddress: currentUser.clinicAddress || '',
            consultationHours: currentUser.consultationHours || '',
            clinicContact: currentUser.clinicContact || ''
        });
    }
  }, [currentUser]);

  const handleBookingConfirmed = async (details: { doctor: any; dateTime: Date; reason: string }) => {
    await BackendService.createAppointment({
        doctorId: details.doctor.id,
        doctorName: details.doctor.name,
        doctorSpecialization: details.doctor.specialization,
        userId: currentUser.id,
        userName: currentUser.name,
        dateTime: details.dateTime,
        reason: details.reason,
    });
    fetchAppointments();
  };
  
  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
      await BackendService.updateAppointmentStatus(id, status);
      fetchAppointments();
  };

  const handleSaveProfile = async () => {
      setIsSavingProfile(true);
      try {
          const updatedUser = await BackendService.updateUser(currentUser.id, {
              bio: editForm.bio,
              clinicName: editForm.clinicName,
              clinicAddress: editForm.clinicAddress,
              consultationHours: editForm.consultationHours,
              clinicContact: editForm.clinicContact
          });
          if (onUserUpdate) onUserUpdate(updatedUser);
          setIsEditingProfile(false);
      } catch (error) {
          console.error("Failed to update profile", error);
          alert("Failed to save changes.");
      } finally {
          setIsSavingProfile(false);
      }
  };

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const now = new Date();
    let filteredAppointments = appointments;
    if (filter !== 'All') {
      filteredAppointments = appointments.filter(a => a.status === filter);
    }

    const upcoming = filteredAppointments
      .filter(a => new Date(a.dateTime) >= now)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
      
    const past = filteredAppointments
      .filter(a => new Date(a.dateTime) < now)
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
      
    return { upcomingAppointments: upcoming, pastAppointments: past };
  }, [appointments, filter]);

  const filterOptions: FilterType[] = ['All', AppointmentStatus.Booked, AppointmentStatus.Completed, AppointmentStatus.Cancelled];
  const isDoctor = currentUser.role === UserRole.Doctor;

  // Calendar Logic for Doctor View
  const calendarDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarSlots = [
      '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
      '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const getSlotContent = (dayIndex: number, timeStr: string) => {
      const slotAppt = appointments.find(a => {
          const d = new Date(a.dateTime);
          const [hStr, mStr, part] = timeStr.split(/[: ]/);
          let h = parseInt(hStr);
          if (part === 'PM' && h !== 12) h += 12;
          if (part === 'AM' && h === 12) h = 0;
          
          return d.getDay() === dayIndex && d.getHours() === h && a.status === AppointmentStatus.Booked;
      });

      if (slotAppt) {
          return (
              <div className="bg-gray-300 text-gray-800 text-xs font-semibold py-1 px-2 rounded w-full text-center truncate">
                  Booked
              </div>
          );
      }
      return <div className="text-gray-400 text-xs">{timeStr}</div>;
  };


  if (isDoctor) {
      return (
        <div className="bg-gray-100 min-h-screen pb-10">
            <Header user={currentUser} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8 relative">
                    {/* Edit Button */}
                    <div className="absolute top-6 right-6 z-10">
                        {isEditingProfile ? (
                            <div className="flex space-x-2">
                                <button 
                                    onClick={handleSaveProfile} 
                                    disabled={isSavingProfile}
                                    className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-teal-700 shadow-sm disabled:opacity-50"
                                >
                                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button 
                                    onClick={() => {
                                        setIsEditingProfile(false);
                                        // Reset form
                                        setEditForm({
                                            bio: currentUser.bio || '',
                                            clinicName: currentUser.clinicName || '',
                                            clinicAddress: currentUser.clinicAddress || '',
                                            consultationHours: currentUser.consultationHours || '',
                                            clinicContact: currentUser.clinicContact || ''
                                        });
                                    }} 
                                    disabled={isSavingProfile}
                                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-50 shadow-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsEditingProfile(true)}
                                className="text-teal-600 hover:text-teal-800 font-semibold text-sm flex items-center bg-teal-50 px-3 py-1.5 rounded-md border border-teal-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                                    {/* Mock Avatar */}
                                    <UserCircleIcon className="w-20 h-20" />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
                                <p className="text-xl text-gray-600 mb-4">{currentUser.specialization || 'General Practitioner'}</p>
                                
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">About {currentUser.name.split(' ')[1]}</h3>
                                    {isEditingProfile ? (
                                        <textarea 
                                            value={editForm.bio}
                                            onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-black bg-white"
                                            rows={4}
                                            placeholder="Tell patients about your experience..."
                                        />
                                    ) : (
                                        <p className="text-gray-600 leading-relaxed max-w-3xl whitespace-pre-line">
                                            {currentUser.bio || `${currentUser.name} is a dedicated ${currentUser.specialization} with over ${currentUser.yearsExperience || 5} years of experience.`}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col md:flex-row justify-between border-t border-gray-100 pt-6 gap-6">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Clinic Details</h4>
                                        <div className="space-y-2">
                                            {isEditingProfile ? (
                                                <>
                                                    <div>
                                                        <label className="text-xs text-gray-500 font-medium uppercase">Name</label>
                                                        <input 
                                                            type="text" 
                                                            value={editForm.clinicName}
                                                            onChange={(e) => setEditForm({...editForm, clinicName: e.target.value})}
                                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-teal-500 outline-none text-black bg-white"
                                                            placeholder="Clinic Name"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500 font-medium uppercase">Address</label>
                                                        <input 
                                                            type="text" 
                                                            value={editForm.clinicAddress}
                                                            onChange={(e) => setEditForm({...editForm, clinicAddress: e.target.value})}
                                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-teal-500 outline-none text-black bg-white"
                                                            placeholder="Clinic Address"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500 font-medium uppercase">Phone</label>
                                                        <input 
                                                            type="text" 
                                                            value={editForm.clinicContact}
                                                            onChange={(e) => setEditForm({...editForm, clinicContact: e.target.value})}
                                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-teal-500 outline-none text-black bg-white"
                                                            placeholder="Clinic Phone"
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-gray-600 font-medium">{currentUser.clinicName || 'Main Medical Center'}</p>
                                                    <p className="text-gray-500 text-sm">{currentUser.clinicAddress || '123 Health Ave, Wellness City'}</p>
                                                    {currentUser.clinicContact && <p className="text-gray-500 text-sm">Ph: {currentUser.clinicContact}</p>}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Consultation Hours</h4>
                                        {isEditingProfile ? (
                                             <div>
                                                <label className="text-xs text-gray-500 font-medium uppercase">Hours</label>
                                                <input 
                                                    type="text" 
                                                    value={editForm.consultationHours}
                                                    onChange={(e) => setEditForm({...editForm, consultationHours: e.target.value})}
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-teal-500 outline-none text-black bg-white"
                                                    placeholder="e.g. Mon-Fri, 9AM-5PM"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-gray-600">{currentUser.consultationHours || 'Mon-Fri, 9AM-5PM'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Calendar View */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Calendar</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="min-w-[800px]">
                            {/* Days Header */}
                            <div className="grid grid-cols-7 mb-4">
                                {calendarDays.map((day) => (
                                    <div key={day} className="text-center font-bold text-gray-800">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Slots Grid */}
                            <div className="space-y-3">
                                {calendarSlots.map((time) => (
                                    <div key={time} className="grid grid-cols-7 gap-3">
                                        {calendarDays.map((day, idx) => (
                                            <div key={`${day}-${time}`} className="bg-[#cbd5e1] bg-opacity-30 rounded h-10 flex items-center justify-center">
                                                {getSlotContent(idx, time)}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
      );
  }

  return (
    <>
      <Header user={currentUser} />
      <div className="bg-slate-50 min-h-screen"> 
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-end mb-4">
                <button onClick={onLogout} className="text-sm text-gray-500 hover:text-red-600 underline">Sign Out</button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">
                   Welcome, {currentUser.name}!
                </h2>
                <p className="text-gray-500 mt-1">
                    Manage your health journey.
                </p>
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 bg-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-teal-700 transition-colors"
            >
                <PlusIcon className="w-5 h-5"/>
                <span>Manual Booking</span>
            </button>
            </div>

            {/* Agentic Booking Section for Patients */}
            <AgenticBooking user={currentUser} onBookingComplete={fetchAppointments} />

            {/* Filter Controls */}
            <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex space-x-2">
                {filterOptions.map((option) => (
                <button
                    key={option}
                    onClick={() => setFilter(option)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                    filter === option
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                >
                    {option}
                </button>
                ))}
            </div>
            </div>
            
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
            ) : (
                <>
                    <section>
                    <div className="flex items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-700">Upcoming Appointments</h3>
                    </div>
                    {upcomingAppointments.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2">
                        {upcomingAppointments.map(app => (
                            <AppointmentCard 
                                key={app.id} 
                                appointment={app} 
                                currentUser={currentUser}
                                onStatusChange={handleStatusChange} 
                            />
                        ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-100">
                            <p className="text-gray-500">No upcoming appointments found.</p>
                        </div>
                    )}
                    </section>

                    <section className="mt-12">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Past Appointments</h3>
                    {pastAppointments.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2">
                        {pastAppointments.map(app => (
                            <AppointmentCard 
                                key={app.id} 
                                appointment={app} 
                                currentUser={currentUser}
                                onStatusChange={handleStatusChange} 
                            />
                        ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-100">
                            <p className="text-gray-500">No past appointment history.</p>
                        </div>
                    )}
                    </section>
                </>
            )}
        </main>
      </div>
      
      {!isDoctor && (
        <BookingModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onBookingConfirmed={handleBookingConfirmed}
        />
      )}
    </>
  );
};

export default Dashboard;
