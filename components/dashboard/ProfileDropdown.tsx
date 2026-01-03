import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserCircleIcon, Cog6ToothIcon, PhotoIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

interface ProfileDropdownProps {
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleLinkClick = () => {
    onClose();
  };

  if (!user) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-64 bg-darkblue2 border border-gray-700 rounded-lg shadow-2xl z-[70] animate-fade-in"
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          {user.profilePictureUrl ? (
            <img src={user.profilePictureUrl} alt="Profile" className="h-14 w-14 rounded-full object-cover border border-gray-600" />
          ) : (
            <UserCircleIcon className="h-14 w-14 text-gray-400" />
          )}
          <div className="overflow-hidden">
            <p className="font-bold text-white truncate">({user.username})</p>
            <p className="text-xs text-gray-400 truncate">{user.fullName}</p>
          </div>
        </div>
        <Link to="/setting" onClick={handleLinkClick}>
          <button className="w-full mt-4 bg-headerBlue hover:bg-[#00A5CC] text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm shadow-md">
            Lihat Profil
          </button>
        </Link>
      </div>
      <nav className="p-2">
        <Link
          to="/setting"
          onClick={handleLinkClick}
          className="flex items-center w-full px-3 py-2.5 text-sm text-gray-300 rounded-md hover:bg-white/10 hover:text-white transition-colors"
        >
          <Cog6ToothIcon className="w-5 h-5 mr-3 text-gray-500" />
          Profil Saya
        </Link>
        <Link
          to="/setting"
          onClick={handleLinkClick}
          className="flex items-center w-full px-3 py-2.5 text-sm text-gray-300 rounded-md hover:bg-white/10 hover:text-white transition-colors"
        >
          <PhotoIcon className="w-5 h-5 mr-3 text-gray-500" />
          Gambar Profil
        </Link>
        <div className="h-px bg-gray-700 my-1 mx-2"></div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-sm text-danger rounded-md hover:bg-danger/10 transition-colors font-medium"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
          Keluar
        </button>
      </nav>
    </div>
  );
};

export default ProfileDropdown;