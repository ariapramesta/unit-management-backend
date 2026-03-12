import { Router } from "express";
import { createUnit } from "../controller/unit.controller";

const router = Router();

router.post("/", createUnit);

export default router;
