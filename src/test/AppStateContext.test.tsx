import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppStateProvider, useAppState } from '../context/AppStateContext';

const TestAppStateComponent = () => {
  const {
    currentPage,
    setCurrentPage,
    isGlobalGhostMode,
    setIsGlobalGhostMode,
    isDarkMode,
    setIsDarkMode,
  } = useAppState();

  return (
    <div>
      <div data-testid="current-page">{currentPage}</div>
      <div data-testid="ghost-mode">{isGlobalGhostMode ? 'true' : 'false'}</div>
      <div data-testid="dark-mode">{isDarkMode ? 'true' : 'false'}</div>

      <button onClick={() => setCurrentPage('dashboard')}>Set Page Dashboard</button>
      <button onClick={() => setIsGlobalGhostMode(true)}>Enable Ghost Mode</button>
      <button onClick={() => setIsDarkMode((prev) => !prev)}>Toggle Dark Mode</button>
    </div>
  );
};

describe('AppStateContext', () => {
  it('starts with currentPage = launch', () => {
    render(
      <AppStateProvider>
        <TestAppStateComponent />
      </AppStateProvider>
    );

    expect(screen.getByTestId('current-page').textContent).toBe('launch');
  });

  it('setCurrentPage updates the page', () => {
    render(
      <AppStateProvider>
        <TestAppStateComponent />
      </AppStateProvider>
    );

    expect(screen.getByTestId('current-page').textContent).toBe('launch');

    fireEvent.click(screen.getByRole('button', { name: /set page dashboard/i }));

    expect(screen.getByTestId('current-page').textContent).toBe('dashboard');
  });

  it('ghost mode toggle works: isGlobalGhostMode starts false, setIsGlobalGhostMode(true) makes it true', () => {
    render(
      <AppStateProvider>
        <TestAppStateComponent />
      </AppStateProvider>
    );

    expect(screen.getByTestId('ghost-mode').textContent).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: /enable ghost mode/i }));

    expect(screen.getByTestId('ghost-mode').textContent).toBe('true');
  });

  it('isDarkMode toggles correctly', () => {
    render(
      <AppStateProvider>
        <TestAppStateComponent />
      </AppStateProvider>
    );

    expect(screen.getByTestId('dark-mode').textContent).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: /toggle dark mode/i }));
    expect(screen.getByTestId('dark-mode').textContent).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: /toggle dark mode/i }));
    expect(screen.getByTestId('dark-mode').textContent).toBe('false');
  });
});
