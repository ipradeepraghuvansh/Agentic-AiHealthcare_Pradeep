
import React from 'react';
import type { Appointment, User } from '../types';
import { AppointmentStatus, UserRole } from '../types';
import { CalendarIcon, ClockIcon } from './IconComponents';

interface AppointmentCardProps {
  appointment: Appointment;
  currentUser: User;
  onStatusChange?: (id: string, status: AppointmentStatus) => void;
}

const getStatusClasses = (status: AppointmentStatus) => {
  switch (status) {
    case AppointmentStatus.Booked:
      return 'bg-blue-100 text-blue-800';
    case AppointmentStatus.Completed:
      return 'bg-green-100 text-green-800';
    case AppointmentStatus.Cancelled:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, currentUser, onStatusChange }) => {
  const { doctorName, doctorSpecialization, userName, dateTime, reason, status } = appointment;

  const formattedDate = dateTime.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const formattedTime = dateTime.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit',
  });

  const isDoctor = currentUser.role === UserRole.Doctor;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-100">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            {isDoctor ? (
                 <>
                    <h3 className="text-lg font-semibold text-gray-800">{userName}</h3>
                    <p className="text-teal-600 text-sm font-medium">Patient</p>
                 </>
            ) : (
                <>
                    <h3 className="text-lg font-semibold text-gray-800">{doctorSpecialization}</h3>
                    <p className="text-gray-600">with {doctorName}</p>
                </>
            )}
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(status)}`}>
            {status}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mt-3 bg-gray-50 p-2 rounded">Reason: {reason}</p>
        
        <div className="mt-4 border-t border-gray-200 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3 text-gray-700">
            <CalendarIcon className="w-5 h-5 text-teal-600" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <ClockIcon className="w-5 h-5 text-teal-600" />
            <span className="text-sm">{formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Doctor Actions */}
      {isDoctor && status === AppointmentStatus.Booked && onStatusChange && (
          <div className="bg-gray-50 px-5 py-3 flex space-x-3">
              <button 
                onClick={() => onStatusChange(appointment.id, AppointmentStatus.Completed)}
                className="flex-1 text-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
              >
                  Mark Complete
              </button>
              <button 
                onClick={() => onStatusChange(appointment.id, AppointmentStatus.Cancelled)}
                className="flex-1 text-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-red-50 hover:text-red-700"
              >
                  Cancel
              </button>
          </div>
      )}
    </div>
  );
};

export default AppointmentCard;
