
import React, { useState } from 'react';
import { BackendService } from '../services/mockBackend';
import { User, UserRole } from '../types';
import { StethoscopeIcon } from './IconComponents';

interface SignupPageProps {
    onSignup: (user: User) => void;
    onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onSwitchToLogin }) => {
    const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Shared Fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');

    // Doctor Specific Fields
    const [license, setLicense] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [experience, setExperience] = useState('');
    const [school, setSchool] = useState('');
    const [clinicName, setClinicName] = useState('');
    const [clinicAddress, setClinicAddress] = useState('');
    const [clinicPhone, setClinicPhone] = useState('');
    const [consultationHours, setConsultationHours] = useState('');
    
    // Patient Specific Fields
    const [bloodType, setBloodType] = useState('');
    const [allergies, setAllergies] = useState('');
    const [emergencyName, setEmergencyName] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    
    // Agreements
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!agreedToTerms) {
            setError("You must agree to the Terms of Service.");
            return;
        }

        setIsLoading(true);

        try {
            const role = activeTab === 'patient' ? UserRole.Patient : UserRole.Doctor;
            const fullName = `${firstName} ${lastName}`;
            
            if (role === UserRole.Doctor && !specialty.trim()) {
                setError("Specialization is required for doctors.");
                setIsLoading(false);
                return;
            }

            const details: Partial<User> = {
                phone,
                dob,
            };

            if (role === UserRole.Doctor) {
                Object.assign(details, {
                    specialization: specialty,
                    licenseNumber: license,
                    yearsExperience: experience,
                    medicalSchool: school,
                    clinicName: clinicName,
                    clinicAddress: clinicAddress,
                    clinicContact: clinicPhone,
                    consultationHours: consultationHours,
                    bio: `Dr. ${lastName} is a specialist in ${specialty} at ${clinicName || 'our clinic'}.`
                });
            } else {
                // Add patient details
                Object.assign(details, {
                    bloodType,
                    allergies,
                    emergencyContactName: emergencyName,
                    emergencyContactPhone: emergencyPhone
                });
            }

            const user = await BackendService.register(fullName, email, password, role, details);
            onSignup(user);
        } catch (e: any) {
            setError(e.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const switchTab = (tab: 'patient' | 'doctor') => {
        setActiveTab(tab);
        setError('');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row shadow-2xl overflow-hidden rounded-xl">
             {/* Left Panel - Intro & Animation */}
            <div className="w-full md:w-5/12 bg-gradient-to-br from-[#0f4c5c] to-[#1a6b7d] p-10 flex flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                         <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>

                <div className="z-10">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                            <StethoscopeIcon className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">AI Healthcare Manager</h1>
                    </div>
                    
                    <h2 className="text-4xl font-extrabold leading-tight mb-6">
                        {activeTab === 'patient' ? "Your Health," : "Manage Practice,"} <br/>
                        <span className="text-teal-300">Reimagined.</span>
                    </h2>
                    
                    <p className="text-lg text-teal-50 leading-relaxed mb-8">
                        {activeTab === 'patient' 
                            ? "Join thousands of patients using AI to schedule appointments, track history, and manage wellness effortlessly."
                            : "Streamline your clinic's workflow with intelligent scheduling, patient records, and real-time dashboard insights."
                        }
                    </p>
                    
                    <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        <div className="w-2 h-2 rounded-full bg-white/50"></div>
                        <div className="w-2 h-2 rounded-full bg-white/50"></div>
                    </div>
                </div>
                
                <div className="z-10 mt-12">
                    <p className="text-sm opacity-80">Trusted by top healthcare providers worldwide.</p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full md:w-7/12 bg-white flex flex-col h-full max-h-screen overflow-y-auto custom-scrollbar">
                <div className="p-8 md:p-12 lg:p-16">
                     <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {activeTab === 'doctor' ? 'Doctor Registration' : 'Create Patient Account'}
                        </h2>
                        
                         {/* Toggle Tabs */}
                        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                            <button 
                                onClick={() => switchTab('patient')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'patient' ? 'bg-white text-[#0f4c5c] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Patient
                            </button>
                            <button 
                                onClick={() => switchTab('doctor')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'doctor' ? 'bg-white text-[#0f4c5c] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Doctor
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-start">
                                <span className="mr-2">⚠️</span> {error}
                            </div>
                        )}

                        {/* Personal Details Section */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center">
                                <span className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">First Name</label>
                                    <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Last Name</label>
                                    <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email Address</label>
                                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone Number</label>
                                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" placeholder="(555) 000-0000" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date of Birth</label>
                                    <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Password</label>
                                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" minLength={6} placeholder="Min. 6 characters" />
                                </div>
                            </div>
                        </div>

                        {/* Patient Specific: Medical History */}
                        {activeTab === 'patient' && (
                            <>
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                                        Medical Profile
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Blood Type</label>
                                            <select value={bloodType} onChange={e => setBloodType(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black">
                                                <option value="">Select...</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Allergies</label>
                                            <input type="text" value={allergies} onChange={e => setAllergies(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" placeholder="e.g. Peanuts, Penicillin" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs mr-2">3</span>
                                        Emergency Contact
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Contact Name</label>
                                            <input type="text" value={emergencyName} onChange={e => setEmergencyName(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Contact Phone</label>
                                            <input type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Doctor Specific Sections */}
                        {activeTab === 'doctor' && (
                            <>
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                                        Professional Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Medical License #</label>
                                            <input type="text" value={license} onChange={e => setLicense(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Specialty</label>
                                            <input type="text" required value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" placeholder="e.g. Cardiology" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Years of Experience</label>
                                            <input type="number" value={experience} onChange={e => setExperience(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Medical School</label>
                                            <input type="text" value={school} onChange={e => setSchool(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs mr-2">3</span>
                                        Clinic Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Clinic Name</label>
                                            <input type="text" value={clinicName} onChange={e => setClinicName(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Clinic Address</label>
                                            <input type="text" value={clinicAddress} onChange={e => setClinicAddress(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Clinic Phone</label>
                                            <input type="tel" value={clinicPhone} onChange={e => setClinicPhone(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Consultation Hours</label>
                                            <input type="text" value={consultationHours} onChange={e => setConsultationHours(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent outline-none transition-all text-black" placeholder="e.g., Mon-Fri, 9AM-5PM" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center">
                                <input 
                                    id="terms" 
                                    type="checkbox" 
                                    checked={agreedToTerms}
                                    onChange={e => setAgreedToTerms(e.target.checked)}
                                    className="h-4 w-4 text-[#0f4c5c] focus:ring-[#0f4c5c] border-gray-300 rounded cursor-pointer" 
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                                    I agree to the <a href="#" className="text-[#0f4c5c] hover:underline font-medium">Terms of Service</a> & Privacy Policy
                                </label>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-[#0f4c5c] hover:bg-[#156073] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center transform hover:translate-y-[-1px]"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center pb-4">
                        <p className="text-gray-500">
                            Already have an account?{' '}
                            <button 
                                onClick={onSwitchToLogin} 
                                className="text-[#0f4c5c] font-bold hover:underline focus:outline-none"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
