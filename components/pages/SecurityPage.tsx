import React from 'react';
import Button from '../common/Button';

const SecurityPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-white mb-6">Security Settings</h2>
      <div className="bg-darkblue2 p-6 rounded-lg shadow-md">
        <p className="text-gray-400 mb-4">
          Manage your account's security features, such as changing your password,
          enabling two-factor authentication (2FA), and reviewing login activity.
        </p>
        <p className="text-gray-500 mb-6">
          Example: Change password, setup 2FA, view recent logins.
        </p>
        <Button variant="primary">
          Change Password
        </Button>
        <Button variant="secondary" className="ml-4">
          Enable 2FA
        </Button>
      </div>
    </div>
  );
};

export default SecurityPage;