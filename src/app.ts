import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import unitRoutes from "./routes/unit.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Backend server is running." });
});

app.use("/api/units", unitRoutes);

app.use(errorHandler);

export default app;
