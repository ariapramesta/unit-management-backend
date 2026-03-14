import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

import { Status, Type } from "../../generated/prisma/enums";
import { validateStatusUpdate } from "../utils/statusValidation";
import { toTitleCase } from "../utils/normalizeResponse";

export const createUnit = async (req: Request, res: Response) => {
  try {
    const { name, type, status } = req.body;

    const normalizedType = type?.trim().toLowerCase();
    const normalizedStatus = status?.trim().toLowerCase();

    const isTypeValid = Object.values(Type).includes(normalizedType as Type);
    const isStatusValid = Object.values(Status).includes(
      normalizedStatus as Status,
    );

    if (!name?.trim() || !type?.trim() || !status?.trim())
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });

    if (!isTypeValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid status! Only Capsule or Cabin are allowed",
      });
    }

    if (!isStatusValid) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status! Only Available, Occupied, Cleaning, or Maintenance are allowed",
      });
    }

    const unit = await prisma.unit.create({
      data: {
        name: name.trim(),
        type: normalizedType,
        status: normalizedStatus,
      },
    });

    const transformedUnit = {
      ...unit,
      type: toTitleCase(unit.type),
      status: toTitleCase(unit.status),
    };

    res.status(201).json({
      success: true,
      data: transformedUnit,
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

    let filterStatus: Status | undefined = undefined;

    if (status && typeof status === "string" && status !== "all") {
      const normalizedStatus = status.toLowerCase();

      const isValid = Object.values(Status).includes(
        normalizedStatus as Status,
      );

      if (isValid) {
        filterStatus = normalizedStatus as Status;
      }
    }

    const units = await prisma.unit.findMany({
      where: {
        status: filterStatus,
      },
      orderBy: { name: "asc" },
    });

    const transformedUnits = units.map((unit) => ({
      ...unit,
      status: toTitleCase(unit.status),
      type: toTitleCase(unit.type),
    }));

    res.json({
      success: true,
      data: transformedUnits,
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

    const transformedUnit = {
      ...unit,
      type: toTitleCase(unit.type),
      status: toTitleCase(unit.status),
    };

    res.json({
      success: true,
      data: transformedUnit,
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
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const normalizedStatus = status.toLowerCase();

    if (
      normalizedStatus &&
      typeof normalizedStatus === "string" &&
      normalizedStatus !== "all"
    ) {
      const isValid = Object.values(Status).includes(
        normalizedStatus as Status,
      );
      if (!isValid)
        return res
          .status(400)
          .json({ success: false, message: "Invalid status" });
    }

    const unit = await prisma.unit.findUnique({ where: { id: id as string } });

    if (!unit)
      return res
        .status(404)
        .json({ success: false, message: "Unit not found" });

    const validationResult = validateStatusUpdate(
      unit.status,
      normalizedStatus as Status,
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
        status: normalizedStatus.trim() as Status,
      },
    });

    const transformedUnit = {
      ...updatedUnit,
      type: toTitleCase(updatedUnit.type),
      status: toTitleCase(updatedUnit.status),
    };

    res.json({
      success: true,
      message: "Unit status updated successfully",
      data: transformedUnit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update unit",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
