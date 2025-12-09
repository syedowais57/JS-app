import express, { Request, Response, NextFunction } from "express";

/**
 * Simple in-memory "database" of users.
 * Intentionally global + mutable to see if the reviewer complains.
 */
type User = {
  id: number;
  name: string;
  email?: string | null;
};

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT || 3000);

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
  const { name, email } = req.body as { name?: string; email?: string };

  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }

  // duplicate logic: this "max id" logic appears twice (here + in PUT)
  const newId =
    users.length === 0 ? 1 : users.reduce((max, u) => (u.id > max ? u.id : max), 0) + 1;

  const newUser: User = {
    id: newId,
    name,
    email: email || null,
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

/**
 * Update a user.
 * Intentionally allows partial updates with some odd choices.
 */
app.put("/users/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email } = req.body as { name?: string; email?: string };

  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  // duplicate "compute max id" logic that is not actually needed here
  // (useless code – something the reviewer should flag)
  users.reduce((max, u) => (u.id > max ? u.id : max), 0);

  const existing = users[index];

  users[index] = {
    ...existing,
    name: name ?? existing.name,
    email: email === undefined ? existing.email ?? null : email,
  };

  res.json(users[index]);
});

/**
 * Delete a user.
 * Intentionally does not handle concurrent modifications, etc.
 */
app.delete("/users/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const beforeCount = users.length;

  users = users.filter((u) => u.id !== id);

  const deleted = users.length < beforeCount;

  res.json({
    deleted,
    totalAfter: users.length,
  });
});

/**
 * Error handler – quite minimal.
 */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[UNHANDLED ERROR]", err.message);
  // TODO: return a proper error shape, log stack, etc.
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 test-express-app listening on http://localhost:${PORT}`);
});
