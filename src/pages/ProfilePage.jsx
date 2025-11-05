import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircleIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/solid';

function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  return (
    <div className="container max-w-2xl p-8 mx-auto">
      <div className="p-8 bg-white rounded-lg shadow-lg border">
        <div className="flex flex-col items-center">
          <UserCircleIcon className="w-24 h-24 text-gray-300" />
          <h1 className="mt-4 text-3xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-lg text-gray-500">{user.userType}</p>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Contact Information</h2>
          <dl className="space-y-4">
            <div className="flex items-center gap-4">
              <EnvelopeIcon className="w-6 h-6 text-red-500" />
              <span className="text-lg text-gray-800">{user.email}</span>
            </div>
            <div className="flex items-center gap-4">
              <PhoneIcon className="w-6 h-6 text-red-500" />
              <span className="text-lg text-gray-800">
                {user.phone ? user.phone : 'No phone number provided'}
              </span>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;