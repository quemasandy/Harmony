import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../../src/app';

describe('Composition Root API Smoke Tests', () => {
  describe('GET /health', () => {
    it('returns 200 OK for readiness check', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('POST /api/v1/analyze/progression', () => {
    it('returns 200 OK and analysis JSON for valid progression', async () => {
      const validPayload = {
        tonalCenter: 'C',
        chords: [
          { symbol: 'Cmaj7' },
          { symbol: 'Dm7' },
          { symbol: 'G7' },
          { symbol: 'Cmaj7' }
        ]
      };

      const response = await request(app)
        .post('/api/v1/analyze/progression')
        .send(validPayload);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.chords).toBeDefined();
      expect(Array.isArray(response.body.data.chords)).toBe(true);
    });
  });
});
