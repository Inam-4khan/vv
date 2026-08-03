import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Page, User } from '../../types';
import { MOCK_USERS } from '../../constants';

export interface AppState {
  currentPage: Page;
  user: User | null;
  isLoading: boolean;
  splashIndex: number;
  isGlobalGhostMode: boolean;
  isDarkMode: boolean;
  selectedStoryId: string | null;
}

export type AppStateAction =
  | { type: 'SET_CURRENT_PAGE'; payload: Page }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_SPLASH_INDEX'; payload: number | ((prev: number) => number) }
  | { type: 'SET_IS_GLOBAL_GHOST_MODE'; payload: boolean | ((prev: boolean) => boolean) }
  | { type: 'SET_IS_DARK_MODE'; payload: boolean | ((prev: boolean) => boolean) }
  | { type: 'SET_SELECTED_STORY_ID'; payload: string | null };

const getInitialGhostMode = (): boolean => {
  try {
    const saved = localStorage.getItem('vizu_ghost_mode');
    return saved ? JSON.parse(saved) : false;
  } catch {
    return false;
  }
};

export const initialState: AppState = {
  currentPage: 'launch',
  user: MOCK_USERS[0] ?? null,
  isLoading: false,
  splashIndex: 0,
  isGlobalGhostMode: getInitialGhostMode(),
  isDarkMode: false,
  selectedStoryId: null,
};

export function appStateReducer(state: AppState, action: AppStateAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SPLASH_INDEX':
      return {
        ...state,
        splashIndex:
          typeof action.payload === 'function'
            ? action.payload(state.splashIndex)
            : action.payload,
      };
    case 'SET_IS_GLOBAL_GHOST_MODE': {
      const nextGhost =
        typeof action.payload === 'function'
          ? action.payload(state.isGlobalGhostMode)
          : action.payload;
      try {
        localStorage.setItem('vizu_ghost_mode', JSON.stringify(nextGhost));
      } catch (e) {
        console.error(e);
      }
      return {
        ...state,
        isGlobalGhostMode: nextGhost,
      };
    }
    case 'SET_IS_DARK_MODE':
      return {
        ...state,
        isDarkMode:
          typeof action.payload === 'function'
            ? action.payload(state.isDarkMode)
            : action.payload,
      };
    case 'SET_SELECTED_STORY_ID':
      return { ...state, selectedStoryId: action.payload };
    default:
      return state;
  }
}

export interface AppStateContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppStateAction>;
  currentPage: Page;
  user: User | null;
  isLoading: boolean;
  splashIndex: number;
  isGlobalGhostMode: boolean;
  isDarkMode: boolean;
  selectedStoryId: string | null;
  setCurrentPage: (page: Page) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  setSplashIndex: (index: number | ((prev: number) => number)) => void;
  setIsGlobalGhostMode: (ghostMode: boolean | ((prev: boolean) => boolean)) => void;
  setIsDarkMode: (darkMode: boolean | ((prev: boolean) => boolean)) => void;
  setSelectedStoryId: (id: string | null) => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  const setCurrentPage = (page: Page) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  };

  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const setIsLoading = (loading: boolean) => {
    dispatch({ type: 'SET_IS_LOADING', payload: loading });
  };

  const setSplashIndex = (index: number | ((prev: number) => number)) => {
    dispatch({ type: 'SET_SPLASH_INDEX', payload: index });
  };

  const setIsGlobalGhostMode = (ghostMode: boolean | ((prev: boolean) => boolean)) => {
    dispatch({ type: 'SET_IS_GLOBAL_GHOST_MODE', payload: ghostMode });
  };

  const setIsDarkMode = (darkMode: boolean | ((prev: boolean) => boolean)) => {
    dispatch({ type: 'SET_IS_DARK_MODE', payload: darkMode });
  };

  const setSelectedStoryId = (id: string | null) => {
    dispatch({ type: 'SET_SELECTED_STORY_ID', payload: id });
  };

  const value: AppStateContextValue = {
    state,
    dispatch,
    currentPage: state.currentPage,
    user: state.user,
    isLoading: state.isLoading,
    splashIndex: state.splashIndex,
    isGlobalGhostMode: state.isGlobalGhostMode,
    isDarkMode: state.isDarkMode,
    selectedStoryId: state.selectedStoryId,
    setCurrentPage,
    setUser,
    setIsLoading,
    setSplashIndex,
    setIsGlobalGhostMode,
    setIsDarkMode,
    setSelectedStoryId,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = (): AppStateContextValue => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
