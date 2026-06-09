import { Router } from 'express';
import { AnalyzeProgressionInputPort } from '../../application/ports/AnalyzeProgressionInputPort';
import { ExpressAdapter } from './ExpressAdapter';

export const createProgressionRouter = (port: AnalyzeProgressionInputPort): Router => {
  const router = Router();
  const adapter = new ExpressAdapter(port);
  
  router.post('/progression', (req: import('express').Request, res: import('express').Response) => adapter.handleAnalyzeProgression(req, res));
  
  return router;
};
