import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { AnalyzeProgressionInputPort } from '../../../src/harmonic-analysis/application/ports/AnalyzeProgressionInputPort';
import { createProgressionRouter } from '../../../src/harmonic-analysis/frameworks/web/ExpressWiring';

describe('ExpressAdapter for Progression Analysis', () => {
  it('US1: Returns 200 OK and exact JSON string from the port on success', async () => {
    const mockJson = JSON.stringify({ success: true, data: { tonalCenter: 'C', chords: [] } }, null, 2);
    
    const mockPort: AnalyzeProgressionInputPort = {
      execute: vi.fn().mockResolvedValue(mockJson)
    };
    
    const app = express();
    app.use(express.json());
    app.use('/api/analysis', createProgressionRouter(mockPort));
    
    const response = await request(app)
      .post('/api/analysis/progression')
      .send({ tonalCenter: 'C', chords: [] });
      
    expect(response.status).toBe(200);
    expect(response.text).toBe(mockJson);
    expect(mockPort.execute).toHaveBeenCalledWith({ tonalCenter: 'C', chords: [] });
  });

  it('US2: Returns 422 Unprocessable Entity if input has a structured failure', async () => {
    const mockJson = JSON.stringify({ 
      success: false, 
      error: { code: 'INVALID_TONAL_CENTER', message: 'Invalid' } 
    }, null, 2);
    
    const mockPort: AnalyzeProgressionInputPort = {
      execute: vi.fn().mockResolvedValue(mockJson)
    };
    
    const app = express();
    app.use(express.json());
    app.use('/api/analysis', createProgressionRouter(mockPort));
    
    const response = await request(app)
      .post('/api/analysis/progression')
      .send({ tonalCenter: 'H', chords: [] });
      
    expect(response.status).toBe(422);
    expect(response.text).toBe(mockJson);
  });

  it('US3: Returns 500 Internal Server Error if port throws unexpected exception', async () => {
    const mockPort: AnalyzeProgressionInputPort = {
      execute: vi.fn().mockRejectedValue(new Error('Unexpected database failure'))
    };
    
    const app = express();
    app.use(express.json());
    app.use('/api/analysis', createProgressionRouter(mockPort));
    
    const response = await request(app)
      .post('/api/analysis/progression')
      .send({ tonalCenter: 'C', chords: [] });
      
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  });
});
