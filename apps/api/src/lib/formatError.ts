import { GraphQLFormattedError } from 'graphql';
import { unwrapResolverError } from '@apollo/server';

const PRISMA_USER_FACING: Record<string, string> = {
  P2002: 'A record with that value already exists.',
  P2025: 'Record not found.',
};

export function formatError(
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  const originalError = unwrapResolverError(error) as { code?: string } | undefined;
  const prismaCode = originalError?.code;

  if (prismaCode && PRISMA_USER_FACING[prismaCode]) {
    return {
      ...formattedError,
      message: PRISMA_USER_FACING[prismaCode],
      extensions: { ...formattedError.extensions, code: 'BAD_USER_INPUT' },
    };
  }

  if (formattedError.extensions?.code === 'INTERNAL_SERVER_ERROR') {
    console.error('[GraphQL Error]', error);
    return {
      ...formattedError,
      message: 'An internal error occurred.',
    };
  }

  return formattedError;
}
