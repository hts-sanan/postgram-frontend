import type { Post } from '@/types';
import { mockUsers } from './users';

const findUser = (id: string) => mockUsers.find((user) => user.id === id)!;

export const mockPosts: Post[] = [
  {
    id: 'post_1',
    author: findUser('user_amelie_griffith'),
    content:
      '🌟 Slow mornings just feel different.\nGood coffee, good music, and absolutely nowhere to rush to. ☕🎧',
    images: [],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    likeCount: 234,
    commentCount: 23,
    likedByCurrentUser: false,
  },
  {
    id: 'post_2',
    author: findUser('user_nina'),
    content: 'Weekend escape 🌿 Sometimes a change of place is all you need.',
    images: [
      {
        id: 'img_1',
        url: 'https://images.unsplash.com/photo-1499363536502-87642509e31b?w=1000&h=1200&fit=crop',
        alt: 'Woman sitting on a bench near flowers, holding a coffee',
      },
      {
        id: 'img_2',
        url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1000&h=1200&fit=crop',
        alt: 'Garden path',
      },
      {
        id: 'img_3',
        url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1000&h=1200&fit=crop',
        alt: 'Flowers close up',
      },
      {
        id: 'img_4',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000&h=1200&fit=crop',
        alt: 'Forest path',
      },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    likeCount: 234,
    commentCount: 23,
    likedByCurrentUser: false,
  },
  {
    id: 'post_3',
    author: findUser('user_amelie_hamilton'),
    content: 'Weekend escape 🌿 Sometimes a change of place is all you need.',
    images: [
      {
        id: 'img_5',
        url: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=1200&h=900&fit=crop',
        alt: 'Green mountain valley with a lake',
      },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    likeCount: 234,
    commentCount: 23,
    likedByCurrentUser: false,
  },
];
