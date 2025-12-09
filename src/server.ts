import express from "express";
import { json } from "express";
import { userRouter } from "./routes/userRoutes";

const app = express();
app.use(json());

const PORT = Number(process.env.PORT || 3000);

app.use("/api", userRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});
