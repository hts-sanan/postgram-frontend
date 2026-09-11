import type { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user_amelie_griffith',
    username: 'amelie_griffie123',
    displayName: 'Amelie Griffith',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    bio: 'Less scrolling, more living 🌱 Making every moment count ✨',
    birthDate: '1996-04-14',
  },
  {
    id: 'user_nina',
    username: 'niinaahh__',
    displayName: 'Nina',
    avatarUrl: null,
    bio: 'Weekend wanderer.',
    birthDate: null,
  },
  {
    id: 'user_amelie_hamilton',
    username: 'Amelie_sarahh_',
    displayName: 'Amelie Hamilton',
    avatarUrl: null,
    bio: 'Mountains over everything.',
    birthDate: null,
  },
  {
    id: 'user_ryan_alex',
    username: 'rayan_alex_',
    displayName: 'Ryan Alex',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    bio: '',
    birthDate: null,
  },
  {
    id: 'user_maya',
    username: 'maya_231',
    displayName: 'Maya',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    bio: '',
    birthDate: null,
  },
  {
    id: 'user_nina_sarah',
    username: 'nina_sarah',
    displayName: 'Nina Sarah',
    avatarUrl: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&h=200&fit=crop',
    bio: '',
    birthDate: null,
  },
];

export const CURRENT_USER_ID = 'user_amelie_griffith';
