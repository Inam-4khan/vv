import { MOCK_USERS } from '../../constants';
import { User } from '../../types';

export { MOCK_USERS };

const isDev = import.meta.env.MODE === 'development';
const devAutoLoginVal = import.meta.env.VITE_DEV_AUTO_LOGIN;

export const DEV_AUTO_LOGIN: boolean = Boolean(isDev && devAutoLoginVal === 'true');

export function getDevUser(): User | null {
  if (DEV_AUTO_LOGIN) {
    return MOCK_USERS[0] ?? null;
  }
  return null;
}
