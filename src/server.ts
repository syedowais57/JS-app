import express, { Request, Response, NextFunction } from "express";
import { greet, formatDate } from "./utils";
import { getConfig, AppConfig } from "./config";
import { UserService } from "./services/userService";
import { CreateUserRequest, UpdateUserRequest } from "./types/user";

const app = express();
app.use(express.json());

// Use config from new config module
const config: AppConfig = getConfig();
const PORT = config.port;

// Initialize user service
const userService = new UserService();

// 👇 Very inefficient "slow" function to simulate blocking work
function simulateSlowOperation(milliseconds: number): void {
  const start = Date.now();
  while (Date.now() - start < milliseconds) {
    // busy loop – intentional bad pattern
  }
}

/**
 * Basic request logger middleware.
 * Has some "any" usage to see if PR reviewer complains.
 */
function requestLogger(req: Request, res: Response, next: NextFunction) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const method: any = req.method; // unnecessary any
  console.log(`[REQUEST] ${method} ${req.originalUrl}`);
  next();
}

app.use(requestLogger);

/**
 * Health check – good/simple endpoint.
 * Returns server status and environment info.
 */
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Get all users.
 * Now uses UserService for better separation of concerns.
 */
app.get("/users", (_req: Request, res: Response) => {
  try {
    const users = userService.getAllUsers();
    res.json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/**
 * Get a single user by ID.
 * Improved error handling with proper status codes.
 */
app.get("/users/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id parameter" });
  }

  const user = userService.getUserById(id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

/**
 * Create a new user.
 * Uses UserService for validation and business logic.
 */
app.post("/users", (req: Request, res: Response) => {
  try {
    const userData: CreateUserRequest = req.body;
    const newUser = userService.createUser(userData);

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      createdAt: formatDate(newUser.createdAt || new Date()),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create user";
    res.status(400).json({ error: message });
  }
});

/**
 * Update an existing user.
 * New endpoint using UserService.
 */
app.put("/users/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id parameter" });
  }

  try {
    const updateData: UpdateUserRequest = req.body;
    const updatedUser = userService.updateUser(id, updateData);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser,
      updatedAt: formatDate(updatedUser.updatedAt || new Date()),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update user";
    res.status(400).json({ error: message });
  }
});

/**
 * Delete a user.
 * New endpoint using UserService.
 */
app.delete("/users/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id parameter" });
  }

  const deleted = userService.deleteUser(id);

  if (!deleted) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ message: "User deleted successfully" });
});

app.get("/users/:id/posts", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = userService.getUserById(id);
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  res.json({ posts: [] });
});

/**
 * Search users endpoint
 */
app.get("/users/search", (req: Request, res: Response) => {
  const query = req.query.q as string;
  
  if (query) {
    const searchQuery = query.toLowerCase().trim();
    const users = userService.getAllUsers().filter(user => 
      user.name.toLowerCase().includes(searchQuery)
    );
    res.json({ users });
  } else {
    res.json({ users: [] });
  }
});

/**
 * Admin endpoint for statistics
 */
app.get("/admin/stats", (req: Request, res: Response) => {
  const users = userService.getAllUsers();
  const totalUsers = users.length;
  
  let averageId = 0;
  if (totalUsers > 0) {
    averageId = users.reduce((sum, u) => sum + u.id, 0) / totalUsers;
  }
  
  const stats: any = {
    totalUsers,
    averageId,
    allUsers: users
  };
  
  if (users.length > 0 && users[0].email) {
    stats.firstUserEmail = users[0].email.toLowerCase();
  }
  
  res.json(stats);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Environment: ${config.environment}`);
  console.log(`API Version: ${config.apiVersion}`);
});
