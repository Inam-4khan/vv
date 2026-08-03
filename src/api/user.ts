import apiClient from './client';

export interface UserProfileUpdates {
  displayName?: string;
  username?: string;
  bio?: string;
  personaBadge?: string;
  ghostMode?: boolean;
  [key: string]: any;
}

export async function getProfileApi(userId?: string) {
  try {
    const url = userId ? `/users/profile/${userId}` : '/users/profile/me';
    const response = await apiClient.get(url);
    return response.data;
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      return {
        id: userId || 'usr_vizu_1',
        username: 'alex_persona',
        displayName: 'Alex Rivers',
        bio: 'Creating spatial AR Vista experiences & Hush whisper nodes in NYC.',
        personaBadge: 'AR Creator & Proximity Streamer',
        ghostMode: false,
        followersCount: 1420,
        connectionsCount: 384,
      };
    }
    throw error.response?.data || error;
  }
}

export async function updateProfileApi(profileUpdates: UserProfileUpdates) {
  try {
    const response = await apiClient.patch('/users/profile/me', profileUpdates);
    return response.data;
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      const current = JSON.parse(localStorage.getItem('vizu_user') || '{}');
      const updated = { ...current, ...profileUpdates };
      localStorage.setItem('vizu_user', JSON.stringify(updated));
      return updated;
    }
    throw error.response?.data || error;
  }
}

export async function getConnectionsApi() {
  try {
    const response = await apiClient.get('/users/connections');
    return response.data;
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      return [
        { id: 'u1', name: 'Kai Vance', username: 'kai_vista', isGhost: false, distance: '37m' },
        { id: 'u2', name: 'Ghost_Z', username: 'ghost_77', isGhost: true, distance: '110m' },
        { id: 'u3', name: 'Aria Chen', username: 'aria_spatial', isGhost: false, distance: '250m' },
      ];
    }
    throw error.response?.data || error;
  }
}

export async function toggleGhostModeApi(enabled: boolean) {
  try {
    const response = await apiClient.post('/users/ghost-mode', { enabled });
    return response.data;
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      return { success: true, ghostMode: enabled };
    }
    throw error.response?.data || error;
  }
}
