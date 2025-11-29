
import React, { useState } from 'react';
import { parseAgenticRequest } from '../services/geminiService';
import { BackendService } from '../services/mockBackend';
import { User, Doctor } from '../types';

interface AgenticBookingProps {
    user: User;
    onBookingComplete: () => void;
}

const AgenticBooking: React.FC<AgenticBookingProps> = ({ user, onBookingComplete }) => {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'idle' | 'thinking' | 'confirming' | 'booking'>('idle');
    const [proposedBooking, setProposedBooking] = useState<any>(null);
    const [doctorDetails, setDoctorDetails] = useState<Doctor | undefined>(undefined);

    const handleAgentRequest = async () => {
        if (!input.trim()) return;
        setStatus('thinking');
        
        const result = await parseAgenticRequest(input);
        
        if (result && result.confidence > 0.6) {
            const doctors = BackendService.getDoctors();
            const doc = doctors.find(d => d.id === result.foundDoctorId);
            
            if (doc) {
                setDoctorDetails(doc);
                setProposedBooking(result);
                setStatus('confirming');
            } else {
                alert("AI identified a doctor ID that doesn't exist.");
                setStatus('idle');
            }
        } else {
            alert("I couldn't quite understand your request. Please specify the reason and a preferred time.");
            setStatus('idle');
        }
    };

    const confirmBooking = async () => {
        if (!proposedBooking || !doctorDetails) return;
        setStatus('booking');

        await BackendService.createAppointment({
            doctorId: doctorDetails.id,
            doctorName: doctorDetails.name,
            doctorSpecialization: doctorDetails.specialization,
            userId: user.id,
            userName: user.name,
            dateTime: new Date(proposedBooking.suggestedDateISO),
            reason: proposedBooking.reason
        });

        setInput('');
        setProposedBooking(null);
        setStatus('idle');
        onBookingComplete();
    };

    return (
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl shadow-lg p-6 mb-8 text-white">
            <h3 className="text-lg font-bold mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                AI Scheduling Agent
            </h3>
            
            {status === 'idle' && (
                <div>
                    <p className="text-teal-100 mb-4 text-sm">Tell me what you need, and I'll organize the appointment for you.</p>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g., I need to see a neurologist next Monday for migraines..."
                            className="flex-1 px-4 py-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-300"
                            onKeyDown={(e) => e.key === 'Enter' && handleAgentRequest()}
                        />
                        <button 
                            onClick={handleAgentRequest}
                            className="bg-white text-teal-600 font-bold px-4 py-2 rounded-lg hover:bg-teal-50 transition-colors"
                        >
                            Ask AI
                        </button>
                    </div>
                </div>
            )}

            {status === 'thinking' && (
                <div className="flex items-center space-x-3 py-4">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-medium">Consulting schedule...</span>
                </div>
            )}

            {status === 'confirming' && proposedBooking && doctorDetails && (
                <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                    <p className="font-semibold mb-2">I found a slot for you:</p>
                    <div className="text-sm space-y-1 mb-4">
                        <p><span className="opacity-75">Doctor:</span> {doctorDetails.name} ({doctorDetails.specialization})</p>
                        <p><span className="opacity-75">Time:</span> {new Date(proposedBooking.suggestedDateISO).toLocaleString()}</p>
                        <p><span className="opacity-75">Reason:</span> {proposedBooking.reason}</p>
                    </div>
                    <div className="flex space-x-3">
                        <button 
                            onClick={confirmBooking}
                            className="bg-white text-teal-600 font-bold px-4 py-1.5 rounded-md hover:bg-teal-50 text-sm"
                        >
                            Confirm & Book
                        </button>
                        <button 
                            onClick={() => { setStatus('idle'); setProposedBooking(null); }}
                            className="bg-transparent border border-white text-white font-medium px-4 py-1.5 rounded-md hover:bg-white/10 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {status === 'booking' && (
                 <div className="flex items-center space-x-3 py-4">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-medium">Finalizing appointment...</span>
                </div>
            )}
        </div>
    );
};

export default AgenticBooking;
