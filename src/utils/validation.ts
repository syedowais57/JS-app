/**
 * Validation utilities
 */

export function isValidString(value: any): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

