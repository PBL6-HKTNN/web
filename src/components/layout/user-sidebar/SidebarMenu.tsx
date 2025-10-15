import React from 'react';
import type { User } from '@/types';
import type { UserTab } from '@/types/core/user';

interface SidebarMenuProps {
  user: Pick<User, 'name' | 'avatar'>;
  activeTab: UserTab;
  setActiveTab: React.Dispatch<React.SetStateAction<UserTab>>;
}

export function SidebarMenu({ user, activeTab, setActiveTab }: SidebarMenuProps) {
  const menuItems: UserTab[] = [
    'Profile',
    'Photos',
    'Account Security',
    'Subscription',
    'Payment Methods',
    'Privacy',
    'Notification Preferences',
    'API Access',
    'Close Account',
  ];

  return (
    <div className="w-1/4 pr-6 border-r flex flex-col items-center">
      {/* Avatar + Name */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover mb-3 shadow"
        />
        <p className="text-center font-semibold text-gray-800">{user.name}</p>
        <p className="text-sm text-gray-500">View public profile</p>
      </div>

      {/* Menu */}
      <ul className="space-y-2 w-full">
        {menuItems.map((item) => (
          <li
            key={item}
            className={`px-3 py-2 rounded-md cursor-pointer ${
              item === activeTab
                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
