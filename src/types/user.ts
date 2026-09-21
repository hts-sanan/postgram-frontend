export interface User {
  id: string;
  username: string;
  displayName: string;
  name?: string;
  avatarUrl: string | null;
  bio: string;
  birthDate: string | null;
}

export interface AuthenticatedUser extends User {
  email: string;
}
