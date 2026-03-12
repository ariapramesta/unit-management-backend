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
