import { describe, it, expect, vi } from 'vitest';
import { GraphQLError } from 'graphql';
import { formatError } from './formatError.js';

describe('formatError', () => {
  it('maps Prisma P2002 to user-friendly message', () => {
    const formatted = { message: 'Original error', extensions: { code: 'INTERNAL_SERVER_ERROR' } };
    const prismaError = Object.assign(new Error('unique constraint'), { code: 'P2002' });
    const gqlError = new GraphQLError('error', { originalError: prismaError });

    const result = formatError(formatted, gqlError);

    expect(result.message).toBe('A record with that value already exists.');
    expect(result.extensions?.code).toBe('BAD_USER_INPUT');
  });

  it('maps Prisma P2025 to user-friendly message', () => {
    const formatted = { message: 'Original error', extensions: { code: 'INTERNAL_SERVER_ERROR' } };
    const prismaError = Object.assign(new Error('not found'), { code: 'P2025' });
    const gqlError = new GraphQLError('error', { originalError: prismaError });

    const result = formatError(formatted, gqlError);

    expect(result.message).toBe('Record not found.');
  });

  it('masks INTERNAL_SERVER_ERROR with generic message', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const formatted = { message: 'Sensitive details', extensions: { code: 'INTERNAL_SERVER_ERROR' } };
    const gqlError = new GraphQLError('Sensitive details', {
      originalError: new Error('db connection failed'),
    });

    const result = formatError(formatted, gqlError);

    expect(result.message).toBe('An internal error occurred.');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('passes through user-facing errors unchanged', () => {
    const formatted = { message: 'Invalid input', extensions: { code: 'BAD_USER_INPUT' } };
    const gqlError = new GraphQLError('Invalid input', {
      extensions: { code: 'BAD_USER_INPUT' },
    });

    const result = formatError(formatted, gqlError);

    expect(result.message).toBe('Invalid input');
  });
});
