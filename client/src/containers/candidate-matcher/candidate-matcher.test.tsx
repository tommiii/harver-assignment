import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import { CandidateMatcher } from './candidate-matcher';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('CandidateMatcher', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    vi.clearAllMocks();
  });

  it('renders the initial state correctly', () => {
    render(<CandidateMatcher />);
    
    expect(screen.getByText('Candidate Matcher')).toBeInTheDocument();
    expect(screen.getByText('Upload and Match')).toBeInTheDocument();
    expect(screen.getByLabelText('Choose file')).toBeInTheDocument();
  });

  it('shows error when no file is selected', async () => {
    render(<CandidateMatcher />);
    const submitButton = screen.getByText('Upload and Match');
    
    await userEvent.click(submitButton);
    
    expect(screen.getByText('Please select a file')).toBeInTheDocument();
  });

  it('shows error for empty file', async () => {
    render(<CandidateMatcher />);
    const fileInput = screen.getByLabelText('Choose file');
    
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    await userEvent.upload(fileInput, file);
    
    const submitButton = screen.getByText('Upload and Match');
    await userEvent.click(submitButton);
    
    expect(screen.getByText('The file is empty')).toBeInTheDocument();
  });

  it('handles successful file upload and matching', async () => {
    const mockResults = [
      {
        vacancyId: '507f1f77bcf86cd799439011',
        hiringLimit: 2,
        candidates: [
          {
            id: '507f1f77bcf86cd799439012',
            vacancyId: '507f1f77bcf86cd799439011',
            averageModuleScores: 90,
            applicationOrder: 0
          }
        ]
      }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: {
        get: () => 'application/json'
      },
      json: () => Promise.resolve({ results: mockResults })
    });

    render(<CandidateMatcher />);
    const fileInput = screen.getByLabelText('Choose file');
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    Object.defineProperty(file, 'text', {
      value: () => Promise.resolve('test content')
    });
    
    await userEvent.upload(fileInput, file);
    const submitButton = screen.getByText('Upload and Match');
    await userEvent.click(submitButton);

    expect(await screen.findByText(`Vacancy Id: ${mockResults[0].vacancyId}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockResults[0].candidates[0].averageModuleScores}%`)).toBeInTheDocument();
  });

  it('handles server error response', async () => {
    const errorMessage = 'Invalid file format';
    mockFetch.mockResolvedValueOnce({
      ok: false,
      headers: {
        get: () => 'application/json'
      },
      json: () => Promise.resolve({ error: errorMessage })
    });

    render(<CandidateMatcher />);
    const fileInput = screen.getByLabelText('Choose file');
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    Object.defineProperty(file, 'text', {
      value: () => Promise.resolve('test content')
    });
    
    await userEvent.upload(fileInput, file);
    const submitButton = screen.getByText('Upload and Match');
    await userEvent.click(submitButton);

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it('handles network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<CandidateMatcher />);
    const fileInput = screen.getByLabelText('Choose file');
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    Object.defineProperty(file, 'text', {
      value: () => Promise.resolve('test content')
    });
    
    await userEvent.upload(fileInput, file);
    const submitButton = screen.getByText('Upload and Match');
    await userEvent.click(submitButton);

    expect(await screen.findByText('Network error')).toBeInTheDocument();
  });

  it('handles invalid server response format', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: {
        get: () => 'text/plain'
      },
      text: () => Promise.resolve('Some text')
    });

    render(<CandidateMatcher />);
    const fileInput = screen.getByLabelText('Choose file');
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    Object.defineProperty(file, 'text', {
      value: () => Promise.resolve('test content')
    });
    
    await userEvent.upload(fileInput, file);
    const submitButton = screen.getByText('Upload and Match');
    await userEvent.click(submitButton);

    expect(await screen.findByText('Invalid response format from server')).toBeInTheDocument();
  });
}); 