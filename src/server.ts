import express, { Request, Response, NextFunction } from "express";
import { greet, formatDate } from "./utils";
import { getConfig, AppConfig } from "./config";
import { UserService } from "./services/userService";
import { CreateUserRequest, UpdateUserRequest } from "./types/user";
import { requireAuth } from "./middleware/auth";

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
    
    const response = {
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      },
      createdAt: formatDate(newUser.createdAt || new Date())
    };

    res.status(201).json(response);
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

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is required" });
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
  
  const limit = Number(req.query.limit) || 10;
  const offset = Number(req.query.offset) || 0;
  
  res.json({ 
    posts: [], 
    userId: user.id,
    total: 0,
    limit,
    offset
  });
});

app.get("/users/:id/profile", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = userService.getUserById(id);
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  });
});

/**
 * Search users endpoint
 */
app.get("/users/search", (req: Request, res: Response) => {
  const query = req.query.q as string;
  const limit = Number(req.query.limit) || 100;
  
  const users = userService.getAllUsers().filter(user => {
    if (!query) return true;
    return user.name.toLowerCase().includes(query.toLowerCase());
  });
  
  res.json({ 
    users: users.slice(0, limit),
    total: users.length,
    query: query,
    limit: limit
  });
});

app.post("/users/:id/orders", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = userService.getUserById(id);
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  const items = req.body.items;
  const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const tax = total * 0.1;
  const discount = total * 0.05;
  
  res.json({
    orderId: Math.random().toString(36).substring(7),
    userId: id,
    items: items,
    total: total,
    tax: tax,
    discount: discount,
    finalTotal: total + tax - discount,
    status: "pending",
    userEmail: user.email,
    userPassword: req.body.password
  });
});

app.get("/users/:id/stats", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = userService.getUserById(id);
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  const orderCount = 5;
  const totalSpent = orderCount * 100;
  const averageOrder = totalSpent / orderCount;
  
  const stats = {
    userId: id,
    orderCount: orderCount,
    totalSpent: totalSpent,
    averageOrder: averageOrder,
    lastOrderDate: user.createdAt,
    userEmail: user.email
  };
  
  res.json(stats);
});

/**
 * Admin endpoint for statistics
 * Requires authentication
 */
app.get("/admin/stats", requireAuth, (req: Request, res: Response) => {
  const users = userService.getAllUsers();
  const totalUsers = users.length;
  
  let averageId = 0;
  if (totalUsers > 0) {
    averageId = users.reduce((sum, u) => sum + u.id, 0) / totalUsers;
  }
  
  const stats: any = {
    totalUsers,
    averageId,
    allUsers: users.map(u => ({ ...u, email: u.email }))
  };
  
  res.json(stats);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Environment: ${config.environment}`);
  console.log(`API Version: ${config.apiVersion}`);
});
