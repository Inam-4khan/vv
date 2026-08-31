import { MOCK_USERS } from '../../constants';
import { User } from '../../types';

export { MOCK_USERS };

export function getDevUser(): User | null {
  try {
    const saved = localStorage.getItem('vizu_current_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.id) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return MOCK_USERS[0] ?? null;
}
