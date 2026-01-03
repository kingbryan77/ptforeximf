import React, { useRef, useEffect } from 'react';
import { NotificationItem } from '../../types';
import { useTransactions } from '../../context/TransactionContext';

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { markNotificationAsRead } = useTransactions();

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

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-darkblue2 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-[450px] overflow-hidden flex flex-col animate-fade-in"
    >
      <div className="p-4 border-b border-gray-700 bg-darkblue flex justify-between items-center">
        <h3 className="text-base font-bold text-white">Notifikasi</h3>
        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">Terbaru</span>
      </div>
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm">Tidak ada notifikasi baru.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className={`p-4 cursor-pointer transition-colors ${
                  notif.read ? 'opacity-60 grayscale-[0.5]' : 'bg-white/[0.02] hover:bg-white/[0.05]'
                }`}
                onClick={() => handleNotificationClick(notif.id)}
              >
                <p className={`text-sm leading-relaxed ${notif.read ? 'text-gray-400' : 'text-gray-200 font-medium'}`}>
                  {notif.message}
                </p>
                <p className="text-[10px] text-gray-500 mt-2 font-mono tabular-nums">
                  {new Date(notif.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-700 text-center bg-darkblue/50">
              <button className="text-xs text-primary hover:text-blue-400 font-bold transition-colors">
                  Tandai Semua Sudah Dibaca
              </button>
          </div>
      )}
    </div>
  );
};

export default NotificationDropdown;