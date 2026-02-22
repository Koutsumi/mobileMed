import fs from 'fs';

type UserAuth = {
  userId: string;
  userName: string;
  userEmail: string;
  expiresIn: number;
  accessToken: string;
  expiresAt: string;
};

type StorageState = {
  origins: {
    origin: string;
    localStorage: {
      name: string;
      value: UserAuth | string;
    }[];
  }[];
};

export function getUserData(path: string): UserAuth | null {
  const file = fs.readFileSync(path, 'utf-8');
  const storage: StorageState = JSON.parse(file);

  for (const origin of storage.origins) {
    const authItem = origin.localStorage.find(
      item => item.name === 'auth_token'
    );

    if (authItem) {
      if (typeof authItem.value === 'string') {
        return JSON.parse(authItem.value) as UserAuth;
      }

      return authItem.value;
    }
  }

  return null;
}
