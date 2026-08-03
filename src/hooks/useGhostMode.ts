import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';

export const useGhostMode = () => {
  const { profile } = useAuth();
  const [isGhost, setIsGhost] = useState(profile?.ghostModeEnabled ?? false);

  const toggleGhostMode = async () => {
    const next = !isGhost;
    try {
      await apiClient.patch('/users/me/ghost-mode', { enabled: next });
    } catch {
      // Fallback local toggle for offline/dev
    }
    setIsGhost(next);
  };

  return { isGhost, toggleGhostMode };
};
