import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastProvider, useToast } from '../context/ToastContext';

const TestToastConsumer = () => {
  const { showToast, removeToast } = useToast();

  return (
    <div>
      <button onClick={() => showToast('Toast message created', 'success')}>
        Trigger Toast
      </button>
      <button onClick={() => removeToast('custom-id-123')}>
        Remove Custom Toast
      </button>
    </div>
  );
};

describe('ToastContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('showToast renders a toast with the correct message', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /trigger toast/i }));
    expect(screen.getByText('Toast message created')).toBeInTheDocument();
  });

  it('Toast auto-removes after 3 seconds (use vi.useFakeTimers())', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /trigger toast/i }));
    expect(screen.getByText('Toast message created')).toBeInTheDocument();

    // Advance timer by 3 seconds for auto-dismiss trigger
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Advance timer by 200ms for exit animation transition
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByText('Toast message created')).not.toBeInTheDocument();
  });

  it('removeToast removes the specific toast by id', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /trigger toast/i }));
    expect(screen.getByText('Toast message created')).toBeInTheDocument();

    // Click the close notification button rendered by ToastList which invokes removeToast
    const closeBtn = screen.getByRole('button', { name: /close notification/i });
    fireEvent.click(closeBtn);

    // Advance timer by 200ms for exit animation
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByText('Toast message created')).not.toBeInTheDocument();
  });
});
