
import React from 'react';
import type { User } from '../types';
import { StethoscopeIcon, UserCircleIcon } from './IconComponents';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <StethoscopeIcon className="h-8 w-8 text-teal-600" />
            <h1 className="text-xl font-bold text-gray-800">
              AI Healthcare Manager
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline text-gray-600 font-medium">{user.name}</span>
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
