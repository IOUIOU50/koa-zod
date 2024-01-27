import { z } from 'zod';
import { prisma } from '../../lib/prisma-client';
import { CommonSampleSchema } from './zod/common-sample.zod';
import { CreateSampleBodySchema } from './zod/create-sample.zod';
import {
  FindAllSamplesQuerySchema,
  FindAllSamplesResultSchema,
} from './zod/find-samples-all.zod';
import { CommonError } from '../../lib/errors';
import { UpdateSampleBodySchema } from './zod/update-sample.zod';

export type CommonSample = z.infer<typeof CommonSampleSchema>;
export type CreateSampleBody = z.infer<typeof CreateSampleBodySchema>;
export type FindAllSampleQuery = z.infer<typeof FindAllSamplesQuerySchema>;
export type FindAllSampleResult = z.infer<typeof FindAllSamplesResultSchema>;
export type UpdateSampleBody = z.infer<typeof UpdateSampleBodySchema>;

export class SampleService {
  async create(body: CreateSampleBody): Promise<CommonSample> {
    const [result] = await prisma.$transaction([
      prisma.sample.create({ data: body }),
    ]);
    return result;
  }

  async findAll(query: FindAllSampleQuery): Promise<FindAllSampleResult> {
    const { sort, order, page, size, ...where } = query;
    const [total, samples] = await Promise.all([
      prisma.sample.count({ where }),
      prisma.sample.findMany({
        orderBy: { [sort]: order },
        skip: (page - 1) * size,
        take: size,
        where,
      }),
    ]);
    return { total, samples };
  }

  async findOne(id: number): Promise<CommonSample> {
    const sample = await prisma.sample.findUnique({ where: { id } });
    if (!sample) {
      throw new CommonError(404, 'sample not found matches with id');
    }
    return sample;
  }

  async update(id: number, body: UpdateSampleBody): Promise<CommonSample> {
    const sample = await prisma.sample.update({ where: { id }, data: body });
    return sample;
  }

  async delete(id: number): Promise<void> {
    await prisma.sample.delete({ where: { id } });
  }
}
