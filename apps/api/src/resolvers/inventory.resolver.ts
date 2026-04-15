import { Context } from '../lib/context.js';
import { requireAuth } from '../lib/requireAuth.js';

interface AddInventoryItemInput {
  partId: string;
  location: string;
  quantity: number;
}

export const inventoryResolvers = {
  Query: {
    inventoryItems: (
      _: unknown,
      { partId, location }: { partId?: string; location?: string },
      { prisma }: Context,
    ) =>
      prisma.inventoryItem.findMany({
        where: {
          ...(partId ? { partId } : {}),
          ...(location ? { location } : {}),
        },
        include: { part: true },
        orderBy: { part: { name: 'asc' } },
      }),
  },

  Mutation: {
    addInventoryItem: (
      _: unknown,
      { input }: { input: AddInventoryItemInput },
      ctx: Context,
    ) => {
      requireAuth(ctx);
      return ctx.prisma.inventoryItem.create({ data: input, include: { part: true } });
    },
  },

  InventoryItem: {
    part: (parent: { partId: string }, _: unknown, { prisma }: Context) =>
      prisma.part.findUniqueOrThrow({ where: { id: parent.partId } }),
  },
};
