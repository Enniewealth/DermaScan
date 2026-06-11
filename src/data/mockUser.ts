// ============================================
// DermaScan — Mock User Data
// ============================================

import type { User } from '../types';

export const mockUser: User = {
  id: 'usr_001',
  fullName: 'Salman Omolaja',
  email: 'salmanomolaja@gmail.com',
  avatarUrl: undefined,
  primarySkinConcern: 'Eczema',
  settings: {
    scanReminders: true,
    language: 'English - Nigeria',
    privacyMode: false,
  },
  createdAt: '2024-01-15T10:30:00Z',
};

export const skinConcernOptions = [
  'Eczema',
  'Acne',
  'Psoriasis',
  'Dermatitis',
  'Rosacea',
  'Fungal Infection',
  'Hyperpigmentation',
  'Other',
];

export const languageOptions = [
  'English - Nigeria',
  'English - US',
  'English - UK',
  'Yoruba',
  'Igbo',
  'Hausa',
];
