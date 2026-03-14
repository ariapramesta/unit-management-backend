import { Router } from "express";
import {
  createUnit,
  deleteUnit,
  getAllUnit,
  getUnitById,
  updateUnit,
} from "../controller/unit.controller";

const router = Router();

router.post("/", createUnit);
router.get("/", getAllUnit);
router.get("/:id", getUnitById);
router.delete("/:id", deleteUnit);
router.patch("/:id/status", updateUnit);

export default router;
