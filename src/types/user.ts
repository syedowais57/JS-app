// User types for better type safety
export interface User {
  id: number;
  name: string;
  email: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserRequest {
  name: string;
  email?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}


