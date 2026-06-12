import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../src/App';
import { vi } from 'vitest';

// Mock the global fetch
global.fetch = vi.fn();

describe('App Integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the initial form', () => {
    render(<App />);
    expect(screen.getByText('Harmony Analyzer')).toBeInTheDocument();
    expect(screen.getByLabelText('Tonal Center')).toBeInTheDocument();
  });

  it('handles a successful progression analysis', async () => {
    const mockSuccessResponse = {
      success: true,
      data: {
        tonalCenter: 'C',
        chords: [
          {
            symbol: 'Dm7',
            harmonicFunction: 'II',
            isIIVI: true,
            tensions: {
              available: true,
              data: {
                availableTensions: ['9', '11'],
                avoidNotes: ['b13']
              }
            },
            tritoneSubstitutions: {
              available: false,
              reason: 'Not a dominant 7th chord'
            }
          }
        ]
      }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    });

    render(<App />);

    const tonalCenterInput = screen.getByLabelText('Tonal Center');
    fireEvent.change(tonalCenterInput, { target: { value: 'C' } });

    // Assuming first chord is Dm7
    const analyzeButton = screen.getByText('Analyze Progression');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Analysis Results')).toBeInTheDocument();
      // Should show the chord
      expect(screen.getByText('Dm7')).toBeInTheDocument();
      // Should show the roman numeral
      expect(screen.getByText('II')).toBeInTheDocument();
    });
  });

  it('handles 422 validation errors and shows field errors', async () => {
    const mockErrorResponse = {
      error: {
        message: 'Invalid chord symbol',
        chordIndex: 0
      }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 422,
      json: async () => mockErrorResponse,
    });

    render(<App />);

    const analyzeButton = screen.getByText('Analyze Progression');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      // Global error banner
      expect(screen.getByText('Please correct the highlighted fields.')).toBeInTheDocument();
      // Field error
      expect(screen.getByText('Invalid chord symbol')).toBeInTheDocument();
    });
  });

  it('handles 500 server errors', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<App />);

    const analyzeButton = screen.getByText('Analyze Progression');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('An unexpected server error occurred. Please try again later.')).toBeInTheDocument();
    });
  });
});
