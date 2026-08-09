import { useAppState } from '../context/AppStateContext';
import { apiClient } from '../api/client';

export const useGhostMode = () => {
  const { isGlobalGhostMode, setIsGlobalGhostMode } = useAppState();

  const toggleGhostMode = async () => {
    const next = !isGlobalGhostMode;
    try {
      await apiClient.patch('/users/me/ghost-mode', { enabled: next });
    } catch {
      // Fallback local toggle for offline/dev
    }
    setIsGlobalGhostMode(next);
  };

  return { isGhost: isGlobalGhostMode, toggleGhostMode };
};

