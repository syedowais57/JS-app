export type UserRole = "user" | "admin";

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
}

const users: CreateUserInput[] = [];

export function createUser(input: CreateUserInput): CreateUserInput {
  const exists = users.find(u => u.email === input.email);
  if (exists) throw new Error("Email already exists");
  users.push(input);
  return input;
}

export function listUsers(): CreateUserInput[] {
  return users;
}
