import { MOCK_USERS } from '../../constants';
import { User } from '../../types';

export { MOCK_USERS };

const nodeEnv = typeof process !== 'undefined' && process.env ? process.env.NODE_ENV : undefined;
const isDev = nodeEnv === 'development' || import.meta.env?.MODE === 'development';
const devAutoLoginVal = import.meta.env?.VITE_DEV_AUTO_LOGIN ?? (typeof process !== 'undefined' ? process.env?.VITE_DEV_AUTO_LOGIN : undefined);

export const DEV_AUTO_LOGIN: boolean = Boolean(isDev && devAutoLoginVal === 'true');

export function getDevUser(): User | null {
  if (DEV_AUTO_LOGIN) {
    return MOCK_USERS[0] ?? null;
  }
  return null;
}
