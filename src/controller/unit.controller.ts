import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createUnit = async (req: Request, res: Response) => {
  try {
    const { name, type, status } = req.body;

    const unit = await prisma.unit.create({
      data: {
        name,
        type,
        status,
      },
    });
    res.status(201).json({
      success: true,
      data: unit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllUnit = async (req: Request, res: Response) => {
  try {
    const unit = await prisma.unit.findMany();

    res.json({
      success: true,
      data: unit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get all data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getUnitById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const unit = await prisma.unit.findUnique({ where: { id: id as string } });
    res.json({
      success: true,
      data: unit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get all data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteUnit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.unit.delete({
      where: { id: id as string },
    });

    res.json({
      success: true,
      message: "Unit deleted was successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get all data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateUnit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const unit = await prisma.unit.update({
      where: { id: id as string },
      data: { ...(status !== undefined && { status }) },
    });

    res.json({
      success: true,
      data: unit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update post",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
