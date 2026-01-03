import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftOnRectangleIcon, UserCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { DASHBOARD_MENU_ITEMS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { MenuItem } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({ 'wallet': true }); // Default wallet open

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSubmenu = (id: string) => {
    setOpenSubmenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredMenuItems = DASHBOARD_MENU_ITEMS.filter(item => {
    if (item.id === 'admin') {
      return user?.isAdmin;
    }
    return true;
  });

  const renderMenuItem = (item: MenuItem, isSubItem = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = location.pathname === item.path || (hasChildren && location.pathname.startsWith(item.path));
    const isSubmenuOpen = openSubmenus[item.id];

    return (
      <div key={item.id}>
        <div
          className={`flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 cursor-pointer group ${
            isActive && !hasChildren
              ? 'text-blue-400 font-medium'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          } ${isSubItem ? 'pl-12' : ''}`}
          onClick={() => {
            if (hasChildren) {
              toggleSubmenu(item.id);
            } else {
              navigate(item.path);
              onClose();
            }
          }}
        >
          <div className="flex items-center">
             <div className="mr-3">
                {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
                   className: `w-5 h-5 transition-colors ${ 
                     isActive && !hasChildren
                     ? 'text-blue-400' 
                     : 'text-gray-500 group-hover:text-gray-300'
                   }`
                })}
              </div>
              <span className="tracking-wide">{item.name}</span>
          </div>

          {hasChildren && (
            <span className="text-gray-500">
               {isSubmenuOpen ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
            </span>
          )}
        </div>

        {hasChildren && isSubmenuOpen && (
          <div className="bg-[#0f1218]">
            {item.children?.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 bg-[#151922] w-64 flex flex-col z-[60] transform shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Sidebar Header / Profile Section */}
        <div className="flex flex-col items-center py-8 border-b border-gray-800 bg-[#1A1F29]">
          <h2 className="text-blue-400 text-lg font-bold mb-4 uppercase tracking-tighter">WELCOME</h2>
          <div className="relative mb-3">
              {user?.profilePictureUrl ? (
                <img 
                  src={user.profilePictureUrl} 
                  alt="Profile" 
                  className="h-20 w-20 rounded-full object-cover border-2 border-gray-600 shadow-md" 
                />
              ) : (
                <UserCircleIcon className="h-20 w-20 text-gray-400 rounded-full border-2 border-gray-600 p-1" />
              )}
          </div>
          <div className="text-center px-4">
              <h3 className="text-white font-semibold text-sm tracking-wider uppercase truncate max-w-[180px]">{user?.fullName || 'GUEST'}</h3>
              <p className="text-gray-500 text-xs mt-1">({user?.username || 'guest'})</p>
          </div>
        </div>

        <div className="flex-grow py-4 overflow-y-auto">
          <nav className="space-y-1">
            {filteredMenuItems.map(item => renderMenuItem(item))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800 bg-[#151922]">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200 text-sm"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;