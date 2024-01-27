import { Controller } from '../lib/controller';
import { SampleController } from './sample/sample.controller';
import { systemController } from './system/system.controller';

export const controllers: Controller[] = [systemController, SampleController];
