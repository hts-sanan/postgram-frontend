import type { Comment } from '@/types';
import { mockUsers } from './users';

const findUser = (id: string) => mockUsers.find((user) => user.id === id)!;
const minutesAgo = (m: number) => new Date(Date.now() - m * 60 * 1000).toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

export const mockComments: Comment[] = [
  {
    id: 'comment_1',
    postId: 'post_1',
    author: findUser('user_amelie_griffith'),
    content: 'Niceee....Loved It! ❤️',
    createdAt: minutesAgo(2),
    editedAt: null,
  },
  {
    id: 'comment_2',
    postId: 'post_1',
    author: findUser('user_ryan_alex'),
    content: 'Such a vibe! ❤️',
    createdAt: minutesAgo(2),
    editedAt: minutesAgo(1),
  },
  {
    id: 'comment_3',
    postId: 'post_1',
    author: findUser('user_maya'),
    content: 'Nothing beats a slow Sunday morning! ☕',
    createdAt: hoursAgo(4),
    editedAt: null,
  },
  {
    id: 'comment_4',
    postId: 'post_1',
    author: findUser('user_nina_sarah'),
    content: 'This is so true 😄',
    createdAt: daysAgo(2),
    editedAt: null,
  },
];
