import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '../../context/AuthContext';
import { UserIcon, PhoneIcon, CameraIcon } from '@heroicons/react/24/outline'; // Added CameraIcon

const SettingPage: React.FC = () => {
  const { user, isLoading, updateProfile, error } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePictureUrl || null); // New state for profile picture
  const [formErrors, setFormErrors] = useState<{ fullName?: string; phoneNumber?: string; profilePicture?: string; api?: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhoneNumber(user.phoneNumber);
      setProfilePicture(user.profilePictureUrl || null);
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      setFormErrors(prev => ({ ...prev, api: error }));
    } else {
      setFormErrors(prev => ({ ...prev, api: undefined }));
    }
  }, [error]);

  const validate = (): boolean => {
    const newErrors: typeof formErrors = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name cannot be empty.';
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number cannot be empty.';
    } else if (!/^\d+$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Phone Number must be numeric.';
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const MAX_FILE_SIZE_MB = 2;
      const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
      const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
      const MIN_WIDTH = 200;
      const MIN_HEIGHT = 200;

      // 1. Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        setFormErrors(prev => ({ ...prev, profilePicture: `Invalid format. Please use JPG, PNG, or GIF.` }));
        return;
      }

      // 2. Validate file size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFormErrors(prev => ({ ...prev, profilePicture: `Image size should be less than ${MAX_FILE_SIZE_MB}MB.` }));
        return;
      }

      // 3. Validate image dimensions
      const reader = new FileReader();
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);

      image.onload = () => {
        // Clean up the object URL as it's no longer needed
        URL.revokeObjectURL(objectUrl);

        if (image.width < MIN_WIDTH || image.height < MIN_HEIGHT) {
          setFormErrors(prev => ({ ...prev, profilePicture: `Image dimensions must be at least ${MIN_WIDTH}x${MIN_HEIGHT} pixels.` }));
          return;
        }

        // All validations passed, now read the file for preview
        reader.onloadend = () => {
          setProfilePicture(reader.result as string);
          setFormErrors(prev => ({ ...prev, profilePicture: undefined, api: undefined }));
        };
        reader.readAsDataURL(file);
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl); // Clean up on error
        setFormErrors(prev => ({ ...prev, profilePicture: 'Could not read the image file.' }));
      };

      image.src = objectUrl;
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setFormErrors({});

    if (!user) {
      setFormErrors(prev => ({ ...prev, api: 'No user logged in.' }));
      return;
    }

    if (!validate()) {
      return;
    }

    const success = await updateProfile({ fullName, phoneNumber, profilePictureUrl: profilePicture || undefined });

    if (success) {
      setSuccessMessage('Profile updated successfully!');
    } else {
      setFormErrors(prev => ({ ...prev, api: formErrors.api || error || 'Failed to update profile.' }));
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Settings</h2>
      <div className="bg-darkblue2 p-6 rounded-lg shadow-md">
        <p className="text-gray-400 mb-4">
          Configure your personal profile information, notification preferences,
          and other application settings.
        </p>
        <p className="text-gray-500 mb-6">
          Example: Edit profile, manage notifications, language settings.
        </p>

        <h3 className="text-xl font-semibold text-white mb-4">Edit Profile</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          {formErrors.api && (
            <div className="bg-danger/20 text-danger p-3 rounded-md text-sm">
              {formErrors.api}
            </div>
          )}
          {successMessage && (
            <div className="bg-success/20 text-success p-3 rounded-md text-sm">
              {successMessage}
            </div>
          )}

          {/* Profile Picture Upload */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Profile Picture</label>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="h-24 w-24 rounded-full object-cover border-2 border-primary shadow-lg" />
                ) : (
                  <UserIcon className="h-24 w-24 text-gray-500 rounded-full border-2 border-gray-700 p-2" />
                )}
              </div>
              <label htmlFor="profilePictureInput" className="cursor-pointer bg-primary hover:bg-secondary text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200">
                <CameraIcon className="h-5 w-5 mr-2" />
                Upload New Photo
              </label>
              <input
                id="profilePictureInput"
                type="file"
                accept="image/jpeg, image/png, image/gif"
                className="hidden"
                onChange={handleImageChange}
                disabled={isLoading}
              />
            </div>
            {formErrors.profilePicture && <p className="mt-2 text-sm text-danger">{formErrors.profilePicture}</p>}
            <p className="mt-2 text-xs text-gray-500">Max file size: 2MB. Formats: JPG, PNG, GIF. Min dimensions: 200x200px.</p>
          </div>

          <Input
            id="fullName"
            label="Full Name"
            type="text"
            icon={<UserIcon />}
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setFormErrors(prev => ({ ...prev, fullName: undefined, api: undefined }));
            }}
            error={formErrors.fullName}
            disabled={isLoading}
          />
          <Input
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            icon={<PhoneIcon />}
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setFormErrors(prev => ({ ...prev, phoneNumber: undefined, api: undefined }));
            }}
            error={formErrors.phoneNumber}
            disabled={isLoading}
          />

          <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SettingPage;