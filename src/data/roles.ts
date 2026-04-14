import type { Role } from '@/types';

export const ROLES: Role[] = [
  {
    id: 'employee',
    label: 'Employee',
    description: 'Handle day-to-day tasks and communications while staying vigilant against common threats.',
    icon: '👤',
    focusAreas: ['phishing', 'social-engineering', 'password-security'],
  },
  {
    id: 'manager',
    label: 'Manager',
    description: 'Lead your team securely and make decisions that protect company data and people.',
    icon: '📋',
    focusAreas: ['social-engineering', 'data-handling', 'physical-security'],
  },
  {
    id: 'it-admin',
    label: 'IT Admin',
    description: 'Defend the technical infrastructure and respond to incidents quickly and correctly.',
    icon: '🖥️',
    focusAreas: ['incident-response', 'password-security', 'phishing'],
  },
  {
    id: 'executive',
    label: 'Executive',
    description: 'High-value target. Recognise sophisticated attacks designed specifically for leadership.',
    icon: '🏢',
    focusAreas: ['social-engineering', 'data-handling', 'phishing'],
  },
];
