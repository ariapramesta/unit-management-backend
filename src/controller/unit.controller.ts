import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

import { Status, Type } from "../../generated/prisma/enums";
import { validateStatusUpdate } from "../utils/statusValidation";

export const createUnit = async (req: Request, res: Response) => {
  try {
    const { name, type, status } = req.body;

    const normalizedType = type?.trim().toLowerCase();
    const normalizedStatus = status?.trim().toLowerCase();

    const isTypeValid = Object.values(Type).includes(normalizedType as Type);
    const isStatusValid = Object.values(Status).includes(
      normalizedStatus as Status,
    );

    if (!isTypeValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid status! Only Capsul or Cabin are allowed",
      });
    }

    if (!isStatusValid) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status! Only Available, Occupied, Cleaning, or Maintenance are allowed",
      });
    }

    if (!name?.trim() || !type?.trim() || !status?.trim())
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });

    const unit = await prisma.unit.create({
      data: {
        name: name.trim(),
        type: normalizedType,
        status: normalizedStatus,
      },
    });
    res.status(201).json({
      success: true,
      data: unit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create unit",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllUnit = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const isValidStatus = Object.values(Status).includes(status as Status);

    const unit = await prisma.unit.findMany({
      where: { status: isValidStatus ? (status as Status) : undefined },
      orderBy: { name: "asc" },
    });

    res.json({
      success: true,
      data: unit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get all unit",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getUnitById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const unit = await prisma.unit.findUnique({ where: { id: id as string } });

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    res.json({
      success: true,
      data: unit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get unit",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteUnit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const unit = await prisma.unit.findUnique({ where: { id: id as string } });

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Failed to delete: Unit not found or already deleted",
      });
    }

    await prisma.unit.delete({
      where: { id: id as string },
    });

    res.json({
      success: true,
      message: "Unit deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete unit",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateUnit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;

    const unit = await prisma.unit.findUnique({ where: { id: id as string } });

    if (!unit)
      return res
        .status(404)
        .json({ success: false, message: "Unit not found" });

    const validationResult = validateStatusUpdate(
      unit.status,
      newStatus as Status,
    );

    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: validationResult.error,
      });
    }

    const updatedUnit = await prisma.unit.update({
      where: { id: id as string },
      data: {
        status: newStatus.trim() as Status,
      },
    });

    res.json({
      success: true,
      message: "Status unit berhasil diperbarui",
      data: updatedUnit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update unit",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
