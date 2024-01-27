import { CommonSampleSchema } from './common-sample.zod';

export const CreateSampleBodySchema = CommonSampleSchema.omit({ id: true }); // use zod utilities as much as possible
