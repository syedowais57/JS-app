import { Router, Request, Response } from "express";
import { createUser, listUsers, UserRole } from "../services/userService";

export const userRouter = Router();

userRouter.post("/users", (req: Request, res: Response) => {
  const { name, email, role } = req.body as {
    name?: string;
    email?: string;
    role?: UserRole;
  };

  if (!name || !email || !role)
    return res.status(400).json({ error: "name, email, role required" });

  try {
    const user = createUser({ name, email, role });
    return res.status(201).json(user);
  } catch (e) {
    return res.status(409).json({ error: (e as Error).message });
  }
});

userRouter.get("/users", (_req: Request, res: Response) => {
  res.json({ users: listUsers() });
});
