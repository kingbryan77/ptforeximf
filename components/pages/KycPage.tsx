import React from 'react';
import Button from '../common/Button';

const KycPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-white mb-6">KYC (Know Your Customer)</h2>
      <div className="bg-darkblue2 p-6 rounded-lg shadow-md">
        <p className="text-gray-400 mb-4">
          To comply with regulations and enhance security, please complete your KYC verification.
          This usually involves uploading identification documents.
        </p>
        <p className="text-gray-500 mb-6">
          Example: Upload ID card, proof of address, selfie with ID.
        </p>
        <Button variant="primary">
          Start KYC Verification
        </Button>
      </div>
    </div>
  );
};

export default KycPage;
