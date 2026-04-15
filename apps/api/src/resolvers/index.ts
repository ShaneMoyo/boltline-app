import { partsResolvers } from './parts.resolver.js';
import { bomResolvers } from './bom.resolver.js';
import { inventoryResolvers } from './inventory.resolver.js';
import { workOrderResolvers } from './workorder.resolver.js';
import { dashboardResolvers } from './dashboard.resolver.js';

export const resolvers = {
  Query: {
    health: () => 'ok',
    ...partsResolvers.Query,
    ...bomResolvers.Query,
    ...inventoryResolvers.Query,
    ...workOrderResolvers.Query,
    ...dashboardResolvers.Query,
  },
  Mutation: {
    ...partsResolvers.Mutation,
    ...bomResolvers.Mutation,
    ...inventoryResolvers.Mutation,
    ...workOrderResolvers.Mutation,
  },
  InventoryItem: inventoryResolvers.InventoryItem,
  WorkOrder: workOrderResolvers.WorkOrder,
};
