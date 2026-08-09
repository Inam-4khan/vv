import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import {
  appStateReducer,
  initialState,
  AppStateProvider,
  useAppState,
} from '../AppStateContext';
import { User } from '../../../types';
import { getDevUser } from '../../utils/devHelpers';

describe('appStateReducer unit tests', () => {
  it('should return initial state by default', () => {
    // @ts-expect-error testing unknown action type
    const state = appStateReducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  it('should handle SET_CURRENT_PAGE navigation action', () => {
    const newState = appStateReducer(initialState, {
      type: 'SET_CURRENT_PAGE',
      payload: 'home',
    });
    expect(newState.currentPage).toBe('home');
  });

  it('should handle SET_USER login and logout flow', () => {
    const mockUser: User = {
      id: 'usr_123',
      displayName: 'Alice',
      username: 'alice_v',
      avatar: 'https://example.com/avatar.jpg',
      bio: 'Vizu explorer',
      isPrivate: false,
      status: 'online',
    };

    // Login action
    const loggedInState = appStateReducer(initialState, {
      type: 'SET_USER',
      payload: mockUser,
    });
    expect(loggedInState.user).toEqual(mockUser);

    // Logout action
    const loggedOutState = appStateReducer(loggedInState, {
      type: 'SET_USER',
      payload: null,
    });
    expect(loggedOutState.user).toBeNull();
  });

  it('should handle SET_IS_LOADING', () => {
    const newState = appStateReducer(initialState, {
      type: 'SET_IS_LOADING',
      payload: true,
    });
    expect(newState.isLoading).toBe(true);
  });

  it('should handle SET_IS_GLOBAL_GHOST_MODE with boolean or function updater', () => {
    const ghostState = appStateReducer(initialState, {
      type: 'SET_IS_GLOBAL_GHOST_MODE',
      payload: true,
    });
    expect(ghostState.isGlobalGhostMode).toBe(true);

    const toggledState = appStateReducer(ghostState, {
      type: 'SET_IS_GLOBAL_GHOST_MODE',
      payload: (prev) => !prev,
    });
    expect(toggledState.isGlobalGhostMode).toBe(false);
  });
});

describe('AppStateProvider integration tests', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppStateProvider>{children}</AppStateProvider>
  );

  it('provides initial state and allows page navigation and user login via hook', () => {
    const { result } = renderHook(() => useAppState(), { wrapper });

    expect(result.current.currentPage).toBe('launch');
    expect(result.current.user).toEqual(getDevUser());

    // Navigate to 'hush'
    act(() => {
      result.current.setCurrentPage('hush');
    });
    expect(result.current.currentPage).toBe('hush');

    // Login user
    const user: User = {
      id: 'u_test',
      displayName: 'Test User',
      username: 'tester',
      avatar: 'https://example.com/test.jpg',
      bio: 'Bio text',
      isPrivate: false,
      status: 'online',
    };

    act(() => {
      result.current.setUser(user);
    });
    expect(result.current.user).toEqual(user);
  });
});
