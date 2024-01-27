import { CommonSampleSchema } from './common-sample.zod';

export const UpdateSampleBodySchema = CommonSampleSchema.pick({
  name: true,
  value: true,
}).partial();
