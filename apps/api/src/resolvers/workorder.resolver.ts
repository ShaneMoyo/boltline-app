import { Context } from '../lib/context.js';
import { requireAuth } from '../lib/requireAuth.js';

interface CreateWorkOrderInput {
  title: string;
  partId: string;
  steps: string[];
}

type WorkOrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETE';

export const workOrderResolvers = {
  Query: {
    workOrders: (_: unknown, { status }: { status?: WorkOrderStatus }, { prisma }: Context) =>
      prisma.workOrder.findMany({
        where: status ? { status } : {},
        include: { part: true, steps: true },
        orderBy: { createdAt: 'desc' },
      }),

    workOrder: (_: unknown, { id }: { id: string }, { prisma }: Context) =>
      prisma.workOrder.findUnique({
        where: { id },
        include: { part: true, steps: true },
      }),
  },

  Mutation: {
    createWorkOrder: async (
      _: unknown,
      { input }: { input: CreateWorkOrderInput },
      ctx: Context,
    ) => {
      requireAuth(ctx);
      return ctx.prisma.workOrder.create({
        data: {
          title: input.title,
          partId: input.partId,
          steps: {
            create: input.steps.map((description) => ({ description })),
          },
        },
        include: { part: true, steps: true },
      });
    },

    updateWorkOrderStatus: async (
      _: unknown,
      { id, status }: { id: string; status: WorkOrderStatus },
      ctx: Context,
    ) => {
      requireAuth(ctx);
      return ctx.prisma.workOrder.update({
        where: { id },
        data: { status },
        include: { part: true, steps: true },
      });
    },

    completeStep: async (_: unknown, { stepId }: { stepId: string }, ctx: Context) => {
      requireAuth(ctx);
      const step = await ctx.prisma.step.update({
        where: { id: stepId },
        data: { completed: true },
      });

      const allSteps = await ctx.prisma.step.findMany({
        where: { workOrderId: step.workOrderId },
      });
      const allDone = allSteps.every((s) => s.completed);

      if (allDone) {
        await ctx.prisma.workOrder.update({
          where: { id: step.workOrderId },
          data: { status: 'COMPLETE' },
        });
      } else {
        await ctx.prisma.workOrder.update({
          where: { id: step.workOrderId, status: 'PENDING' },
          data: { status: 'IN_PROGRESS' },
        });
      }

      return step;
    },
  },

  WorkOrder: {
    part: (parent: { partId: string }, _: unknown, { prisma }: Context) =>
      prisma.part.findUniqueOrThrow({ where: { id: parent.partId } }),
    steps: (parent: { id: string }, _: unknown, { prisma }: Context) =>
      prisma.step.findMany({ where: { workOrderId: parent.id } }),
  },
};
