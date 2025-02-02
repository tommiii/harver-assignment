import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { MatchCard } from './match-card';
import { MatchOutput } from '../../types';

describe('MatchCard', () => {
  const mockMatch: MatchOutput = {
    vacancyId: '507f1f77bcf86cd799439011',
    hiringLimit: 2,
    candidates: [
      {
        id: '507f1f77bcf86cd799439012',
        vacancyId: '507f1f77bcf86cd799439011',
        averageModuleScores: 90,
        applicationOrder: 0
      },
      {
        id: '507f1f77bcf86cd799439013',
        vacancyId: '507f1f77bcf86cd799439011',
        averageModuleScores: 85,
        applicationOrder: 1
      }
    ]
  };

  it('renders vacancy ID and hiring limit', () => {
    render(<MatchCard match={mockMatch} />);
    
    expect(screen.getByText(`Vacancy Id: ${mockMatch.vacancyId}`)).toBeInTheDocument();
    expect(screen.getByText('Hiring Limit:')).toBeInTheDocument();
    expect(screen.getByText(mockMatch.hiringLimit.toString())).toBeInTheDocument();
  });

  it('renders all candidates with their scores', () => {
    render(<MatchCard match={mockMatch} />);
    
    mockMatch.candidates.forEach(candidate => {
      expect(screen.getByText(`Candidate Id: ${candidate.id}`)).toBeInTheDocument();
      expect(screen.getByText(`${candidate.averageModuleScores}%`)).toBeInTheDocument();
    });
  });

  it('renders candidates in order', () => {
    render(<MatchCard match={mockMatch} />);
    
    const candidateElements = screen.getAllByText(/Candidate Id:/);
    expect(candidateElements).toHaveLength(2);
    
    // Check that candidates are rendered in the correct order
    expect(candidateElements[0]).toHaveTextContent(mockMatch.candidates[0].id);
    expect(candidateElements[1]).toHaveTextContent(mockMatch.candidates[1].id);
  });

  it('handles empty candidates array', () => {
    const emptyMatch: MatchOutput = {
      ...mockMatch,
      candidates: []
    };
    
    render(<MatchCard match={emptyMatch} />);
    
    expect(screen.getByText(`Vacancy Id: ${emptyMatch.vacancyId}`)).toBeInTheDocument();
    expect(screen.queryByText(/Candidate Id:/)).not.toBeInTheDocument();
  });
}); 