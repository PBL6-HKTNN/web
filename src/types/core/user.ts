export interface User {
  id: string;
  name: string;
  bio: string;
  avatar: string; 
  contact: {
    email: string;
    phone: string;
  };
  birthDate?: string; 
  motto?: string; 
};

export type UserTab =
  | 'Profile'
  | 'Photos'
  | 'Account Security'
  | 'Subscription'
  | 'Payment Methods'
  | 'Privacy'
  | 'Notification Preferences'
  | 'API Access'
  | 'Close Account';