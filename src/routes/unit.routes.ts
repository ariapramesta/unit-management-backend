import { Router } from "express";
import {
  createUnit,
  getAllUnit,
  getUnitById,
} from "../controller/unit.controller";

const router = Router();

router.post("/", createUnit);
router.get("/", getAllUnit);
router.get("/:id", getUnitById);

export default router;
