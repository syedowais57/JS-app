import { User, CreateUserRequest, UpdateUserRequest } from "../types/user";
import { validateEmail } from "../utils";

// User service for business logic
export class UserService {
  private users: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com", createdAt: new Date() },
    { id: 2, name: "Bob", email: null, createdAt: new Date() },
  ];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  createUser(data: CreateUserRequest): User {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Name is required and cannot be empty");
    }

    if (data.email && !validateEmail(data.email)) {
      throw new Error("Invalid email format");
    }

    const newUser: User = {
      id: this.getNextId(),
      name: data.name.trim(),
      email: data.email || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: number, data: UpdateUserRequest): User | null {
    const user = this.getUserById(id);
    if (!user) {
      return null;
    }

    if (data.name !== undefined) {
      if (data.name.trim().length === 0) {
        throw new Error("Name cannot be empty");
      }
      user.name = data.name.trim();
    }

    if (data.email !== undefined) {
      if (data.email && !validateEmail(data.email)) {
        throw new Error("Invalid email format");
      }
      user.email = data.email || null;
    }

    user.updatedAt = new Date();
    return user;
  }

  deleteUser(id: number): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      return false;
    }
    this.users.splice(index, 1);
    return true;
  }

  private getNextId(): number {
    return Math.max(...this.users.map((u) => u.id), 0) + 1;
  }

  public searchUsersUnsafe(query: string): User[] {
    if (!query || query.trim().length === 0) {
      return [];
    }
    const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`.*${sanitizedQuery}.*`, 'i');
    return this.users.filter(u => regex.test(u.name || ''));
  }

  public getUserCount(): number {
    return this.users.length;
  }

  public getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  public getUsersByAgeRange(minAge: number, maxAge: number): User[] {
    return this.users.filter(user => {
      if (!user.createdAt) return false;
      const age = new Date().getFullYear() - user.createdAt.getFullYear();
      return age >= minAge && age <= maxAge;
    });
  }
}


