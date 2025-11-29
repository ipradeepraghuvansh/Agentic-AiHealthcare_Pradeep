
import React, { useState, useCallback } from 'react';
import { getDoctors, suggestAppointmentSlots } from '../services/geminiService';
import type { Doctor } from '../types';
import { ClockIcon } from './IconComponents';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingConfirmed: (details: { doctor: Doctor; dateTime: Date; reason: string }) => void;
}

interface SuggestedSlot {
    time: string;
    doctor: Doctor;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onBookingConfirmed }) => {
  const [reason, setReason] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedSlots, setSuggestedSlots] = useState<SuggestedSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SuggestedSlot | null>(null);
  
  const doctors = getDoctors();

  const handleFindSlots = useCallback(async () => {
    if (!reason || !doctorId || !date) {
      alert('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setSuggestedSlots([]);
    setSelectedSlot(null);
    try {
      const slots = await suggestAppointmentSlots(reason, doctorId, date);
      setSuggestedSlots(slots);
    } catch (error) {
      console.error("Failed to fetch slots:", error);
      alert("Failed to fetch appointment slots. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [reason, doctorId, date]);

  const handleConfirmBooking = () => {
    if (selectedSlot) {
        const [hours, minutes] = selectedSlot.time.match(/\d+/g)!.map(Number);
        const isPM = selectedSlot.time.toLowerCase().includes('pm');
        const finalHours = isPM && hours < 12 ? hours + 12 : (hours === 12 && !isPM ? 0 : hours);
        
        const appointmentDateTime = new Date(date);
        appointmentDateTime.setHours(finalHours, minutes, 0, 0);

      onBookingConfirmed({
        doctor: selectedSlot.doctor,
        dateTime: appointmentDateTime,
        reason,
      });
      resetAndClose();
    }
  };
  
  const resetAndClose = () => {
      setReason('');
      setDoctorId('');
      setDate(new Date().toISOString().split('T')[0]);
      setSuggestedSlots([]);
      setSelectedSlot(null);
      setIsLoading(false);
      onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Book New Appointment</h2>
            <button onClick={resetAndClose} className="text-gray-400 hover:text-gray-600">&times;</button>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for visit</label>
              <input type="text" id="reason" value={reason} onChange={e => setReason(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-black bg-white" placeholder="e.g., Annual Check-up"/>
            </div>
            <div>
              <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">Doctor</label>
              <select id="doctor" value={doctorId} onChange={e => setDoctorId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-black bg-white">
                <option value="" disabled>Select a doctor</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialization}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Preferred Date</label>
              <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-black bg-white"/>
            </div>
            <button onClick={handleFindSlots} disabled={isLoading || !reason || !doctorId || !date} className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-700 disabled:bg-gray-300 transition-colors flex items-center justify-center">
              {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : "Find Available Slots with AI"}
            </button>
          </div>

          {suggestedSlots.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800">AI Suggested Slots:</h3>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {suggestedSlots.map((slot, index) => (
                  <button key={index} onClick={() => setSelectedSlot(slot)} className={`p-3 rounded-md border text-center transition-colors ${selectedSlot === slot ? 'bg-teal-600 text-white border-teal-600' : 'bg-white hover:bg-teal-50 border-gray-300'}`}>
                    <span className="font-semibold">{slot.time}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button onClick={resetAndClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={handleConfirmBooking} disabled={!selectedSlot} className="px-4 py-2 bg-teal-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-teal-700 disabled:bg-gray-300">Confirm Booking</button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
