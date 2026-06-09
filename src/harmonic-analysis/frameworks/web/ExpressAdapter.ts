import { Request, Response } from 'express';
import { AnalyzeProgressionInputPort } from '../../application/ports/AnalyzeProgressionInputPort';

export class ExpressAdapter {
  constructor(private readonly port: AnalyzeProgressionInputPort) {}

  async handleAnalyzeProgression(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.port.execute(req.body);
      
      try {
        const parsed = JSON.parse(result);
        if (parsed.success === false) {
          res.status(422).type('application/json').send(result);
          return;
        }
      } catch (e) {
        // Ignored. If it's not JSON or parsing fails, we assume it's successful raw output (or handle as 200).
      }
      
      res.status(200).type('application/json').send(result);
    } catch (err) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  }
}
