import { Context } from '../lib/context.js';

interface CreatePartInput {
  partNumber: string;
  name: string;
  description?: string;
  unit: string;
}

interface UpdatePartInput {
  partNumber?: string;
  name?: string;
  description?: string;
  unit?: string;
}

export const partsResolvers = {
  Query: {
    parts: (_: unknown, __: unknown, { prisma }: Context) =>
      prisma.part.findMany({ orderBy: { createdAt: 'desc' } }),

    part: (_: unknown, { id }: { id: string }, { prisma }: Context) =>
      prisma.part.findUnique({ where: { id } }),
  },

  Mutation: {
    createPart: (_: unknown, { input }: { input: CreatePartInput }, { prisma }: Context) =>
      prisma.part.create({ data: input }),

    updatePart: (
      _: unknown,
      { id, input }: { id: string; input: UpdatePartInput },
      { prisma }: Context,
    ) => prisma.part.update({ where: { id }, data: input }),
  },
};
