import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorFallback } from './error-fallback';

describe('ErrorFallback', () => {
  const mockError = new Error('Test error message');
  const mockResetErrorBoundary = vi.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock window.location.reload
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true
    });
  });

  it('renders the error fallback component', () => {
    render(
      <ErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
        isDevelopment={false}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Reload page')).toBeInTheDocument();
  });

  it('shows error message in development mode', () => {
    render(
      <ErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
        isDevelopment={true}
      />
    );

    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('hides error message in production mode', () => {
    render(
      <ErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
        isDevelopment={false}
      />
    );

    expect(screen.queryByText('Test error message')).not.toBeInTheDocument();
  });

  it('reloads the page when clicking the reload button', async () => {
    const user = userEvent.setup();
    
    render(
      <ErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
        isDevelopment={false}
      />
    );

    const reloadButton = screen.getByText('Reload page');
    await user.click(reloadButton);

    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
}); 