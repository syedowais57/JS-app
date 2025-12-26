import express, { Request, Response, NextFunction } from "express";
import { greet, validateEmail, formatDate } from "./utils";
import { getConfig, AppConfig } from "./config";

/**
 *
 * Intentionally global + mutable to see if the reviewer complains.
 */
type User = {
  id: number;
  name: string;
  email?: string | null;
};

const app = express();
app.use(express.json());

// Use config from new config module
const config: AppConfig = getConfig();
const PORT = config.port;

// 👇 Global mutable state (bad for production, good for testing reviews)
let users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: null },
];

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
 */
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
  });
});

/**
 * Get all users.
 * Intentionally calls a blocking function to simulate bad performance.
 */
app.get("/users", (_req: Request, res: Response) => {
  // bad idea: blocking the event loop for 200ms on every request
  simulateSlowOperation(200);

  res.json({
    count: users.length,
    users,
  });
});

/**
 * Get a single user by ID.
 * Error handling is a bit messy on purpose.
 */
app.get("/users/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  // fragile parsing & checks – intentional
  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id parameter" });
  }

  const user = users.find((u) => u.id === id);

  if (!user) {
    // returns 200 even when not found – subtle bug for reviewer
    return res.json({ message: "User not found" });
  }

  res.json(user);
});

/**
 * Create a new user.
 * Intentionally does minimal validation and duplicates some logic.
 */
app.post("/users", (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  // Use new validateEmail utility
  if (email && !validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const newUser: User = {
    id: users.length + 1,
    name,
    email: email || null,
  };

  users.push(newUser);

  res.status(201).json({
    message: "User created successfully",
    user: newUser,
    createdAt: formatDate(new Date()),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Environment: ${config.environment}`);
  console.log(`API Version: ${config.apiVersion}`);
});
