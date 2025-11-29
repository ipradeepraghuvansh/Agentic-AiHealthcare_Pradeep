
import React, { useState } from 'react';
import { DOCTORS } from '../services/mockBackend';
import { 
    StethoscopeIcon, 
    GeneralIcon, 
    BrainIcon, 
    ChildIcon, 
    SkinIcon, 
    UserCircleIcon 
} from './IconComponents';

interface LandingPageProps {
    onNavigateToLogin: () => void;
    onNavigateToSignup: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin, onNavigateToSignup }) => {
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

    // Filter doctors based on selection
    const filteredDoctors = selectedSpecialty === 'All' 
        ? DOCTORS 
        : DOCTORS.filter(d => d.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase()));

    const specialties = [
        { name: 'General physician', icon: GeneralIcon },
        { name: 'Gynecologist', icon: StethoscopeIcon },
        { name: 'Dermatologist', icon: SkinIcon },
        { name: 'Pediatrician', icon: ChildIcon },
        { name: 'Neurologist', icon: BrainIcon },
        { name: 'Gastroenterologist', icon: GeneralIcon }, // Reusing generic icon for now
    ];

    return (
        <div className="bg-white min-h-screen font-sans text-gray-800">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                             <div className="p-2 bg-teal-50 rounded-lg">
                                <StethoscopeIcon className="h-7 w-7 text-teal-600" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900">Prescripto</span>
                        </div>

                        {/* Nav Links */}
                        <div className="hidden md:flex space-x-8">
                            <a href="#" className="text-sm font-semibold text-gray-900 border-b-2 border-teal-600 pb-1">Home</a>
                            <a href="#doctors" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">All Doctors</a>
                            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">About</a>
                            <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
                        </div>

                        {/* CTA / Profile */}
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={onNavigateToLogin}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block"
                            >
                                Login
                            </button>
                            <button 
                                onClick={onNavigateToSignup}
                                className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2.5 px-5 rounded-full shadow-md hover:shadow-lg transition-all"
                            >
                                Create account
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-teal-600 rounded-b-3xl md:rounded-3xl mx-0 md:mx-6 lg:mx-10 mt-0 md:mt-4 overflow-hidden relative shadow-xl">
                <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 lg:py-32 flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 text-center md:text-left z-10 text-white">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            Book Appointment <br /> With Trusted Doctors
                        </h1>
                        <p className="text-teal-100 text-lg mb-8 max-w-lg mx-auto md:mx-0 font-light">
                            Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
                        </p>
                        <button 
                            onClick={() => document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-white text-teal-600 font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform animate-fade-in-up"
                        >
                            Book appointment
                        </button>
                    </div>
                    {/* Hero Image Illustration */}
                    <div className="w-full md:w-1/2 mt-10 md:mt-0 relative">
                        <div className="relative w-full h-64 md:h-96">
                             {/* Abstract representation of doctors group */}
                            <div className="absolute bottom-0 right-0 w-4/5 h-full bg-contain bg-no-repeat bg-bottom z-0 opacity-90"
                                 style={{ backgroundImage: 'url("https://img.freepik.com/free-photo/team-young-specialist-doctors-standing-corridor-hospital_1303-21199.jpg?t=st=1716390000~exp=1716393600~hmac=abcdef")', backgroundSize: 'cover', maskImage: 'linear-gradient(to top, black 80%, transparent 100%)', borderRadius: '20px' }}>
                                 {/* Placeholder if image fails: Abstract shapes */}
                                 <div className="w-full h-full bg-gradient-to-t from-teal-800/50 to-transparent rounded-2xl"></div>
                            </div>
                             {/* Decorative Circles */}
                             <div className="absolute top-0 right-10 w-20 h-20 bg-teal-400/30 rounded-full blur-xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Specialties Section */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Find by Speciality</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                    {specialties.map((spec) => (
                        <div 
                            key={spec.name}
                            onClick={() => setSelectedSpecialty(spec.name === selectedSpecialty ? 'All' : spec.name)}
                            className={`flex flex-col items-center cursor-pointer transition-all hover:-translate-y-2 group ${selectedSpecialty === spec.name ? 'scale-110' : ''}`}
                        >
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-sm mb-3 transition-colors ${selectedSpecialty === spec.name ? 'bg-teal-100 ring-2 ring-teal-500' : 'bg-teal-50 group-hover:bg-teal-100'}`}>
                                <spec.icon className="w-10 h-10 text-teal-600" />
                            </div>
                            <span className={`text-xs text-center font-medium ${selectedSpecialty === spec.name ? 'text-teal-700 font-bold' : 'text-gray-600'}`}>{spec.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Top Doctors Section */}
            <section id="doctors" className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Top Doctors to Book</h2>
                        <p className="text-gray-500 mt-2">Simply browse through our extensive list of trusted doctors.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredDoctors.slice(0, 10).map((doc) => (
                            <div 
                                key={doc.id} 
                                onClick={onNavigateToLogin}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
                            >
                                {/* Doctor Image Placeholder */}
                                <div className="h-56 bg-teal-50 flex items-end justify-center overflow-hidden relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-teal-200">
                                         <UserCircleIcon className="w-32 h-32" />
                                    </div>
                                    <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-teal-900/10 to-transparent"></div>
                                </div>
                                
                                <div className="p-5">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-green-500 text-xs font-semibold">Available</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">{doc.name}</h3>
                                    <p className="text-sm text-gray-500 mb-3">{doc.specialization}</p>
                                    
                                    <div className="flex items-center text-xs text-yellow-500 mb-4">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                        <span className="text-gray-600 ml-1 font-medium">4.8 ({Math.floor(Math.random() * 50) + 10})</span>
                                    </div>

                                    <div className="flex justify-between items-center mt-2 pt-4 border-t border-gray-50">
                                        <span className="text-xs text-gray-400">{doc.yearsExperience ? `${doc.yearsExperience} yrs exp` : 'Experienced'}</span>
                                        <button className="text-sm font-medium text-teal-600 hover:underline">Book Now &rarr;</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                         <button 
                            onClick={() => setSelectedSpecialty('All')} 
                            className="bg-gray-200 text-gray-700 font-semibold py-3 px-10 rounded-full hover:bg-gray-300 transition-colors"
                         >
                            Show all doctors
                         </button>
                    </div>
                </div>
            </section>

             {/* Banner Section */}
            <section className="py-16 px-4 md:px-10">
                <div className="max-w-7xl mx-auto bg-teal-600 rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between text-white shadow-xl relative overflow-hidden">
                    <div className="z-10 text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Book Appointment <br/> With 100+ Trusted Doctors</h2>
                        <button onClick={onNavigateToSignup} className="bg-white text-teal-600 font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform">
                            Create account
                        </button>
                    </div>
                    {/* Decorative */}
                    <div className="absolute right-0 top-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                         <div className="col-span-1 md:col-span-2">
                             <div className="flex items-center space-x-2 mb-4">
                                <StethoscopeIcon className="h-6 w-6 text-teal-600" />
                                <span className="text-lg font-bold text-gray-900">Prescripto</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                                Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                            </p>
                         </div>
                         <div>
                             <h4 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Company</h4>
                             <ul className="space-y-2 text-sm text-gray-600">
                                 <li><a href="#" className="hover:text-teal-600">Home</a></li>
                                 <li><a href="#" className="hover:text-teal-600">About us</a></li>
                                 <li><a href="#" className="hover:text-teal-600">Delivery</a></li>
                                 <li><a href="#" className="hover:text-teal-600">Privacy policy</a></li>
                             </ul>
                         </div>
                         <div>
                             <h4 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Get in Touch</h4>
                             <ul className="space-y-2 text-sm text-gray-600">
                                 <li>+1-212-456-7890</li>
                                 <li>greatstackdev@gmail.com</li>
                             </ul>
                         </div>
                    </div>
                    <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-400">
                        Copyright 2024 @ Prescripto - All Right Reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
