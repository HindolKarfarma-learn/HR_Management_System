import {
  CalendarCheck,
  CircleDollarSign,
  LayoutDashboard,
  Settings,
  UserRound,
  UsersRound,
  Waves,
} from 'lucide-react';

export const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Employees', path: '/employees', icon: UsersRound, roles: ['admin'] },
  { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
  { label: 'Leave', path: '/leave', icon: Waves },
  { label: 'Payroll', path: '/payroll', icon: CircleDollarSign },
  { label: 'Profile', path: '/profile', icon: UserRound },
  { label: 'Settings', path: '/settings', icon: Settings },
];
