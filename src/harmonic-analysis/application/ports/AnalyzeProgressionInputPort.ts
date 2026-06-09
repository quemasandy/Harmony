import { ProgressionInputDTO } from '../../use-cases/dtos/ProgressionInputDTO';

export interface AnalyzeProgressionInputPort {
  execute(input: ProgressionInputDTO): Promise<string> | string;
}
