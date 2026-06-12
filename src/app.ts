import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

import { ProgressionAnalyzer } from './harmonic-analysis/use-cases/ProgressionAnalyzer';
import { JsonProgressionPresenter } from './harmonic-analysis/interface-adapters/JsonProgressionPresenter';
import { createProgressionRouter } from './harmonic-analysis/frameworks/web/ExpressWiring';
import { AnalyzeProgressionInputPort } from './harmonic-analysis/application/ports/AnalyzeProgressionInputPort';
import { ProgressionInputDTO } from './harmonic-analysis/use-cases/dtos/ProgressionInputDTO';

export const app = express();

// T010: Configure CORS for same-origin posture
app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : false
}));

app.use(express.json());

// T005: Implement GET /health endpoint responding with 200 OK
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

class ProgressionAnalyzerWrapper implements AnalyzeProgressionInputPort {
  constructor(
    private readonly useCase: ProgressionAnalyzer,
    private readonly presenter: JsonProgressionPresenter
  ) {}

  execute(input: ProgressionInputDTO): string {
    const result = this.useCase.execute(input);
    return this.presenter.present(result);
  }
}

// T008: Wire ProgressionAnalyzer and Express router under /api/v1
const progressionAnalyzer = new ProgressionAnalyzer();
const progressionPresenter = new JsonProgressionPresenter();
const progressionInputPort = new ProgressionAnalyzerWrapper(progressionAnalyzer, progressionPresenter);

const progressionRouter = createProgressionRouter(progressionInputPort);
app.use('/api/v1/analyze', progressionRouter);

// T009: Add static file serving middleware
app.use(express.static(path.join(__dirname, '../public')));

// Basic catch-all to serve index.html for SPA if not an API route
app.get('*', (req: Request, res: Response, next: express.NextFunction) => {
  if (req.path.startsWith('/api/') || req.path === '/health') {
    return next();
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
