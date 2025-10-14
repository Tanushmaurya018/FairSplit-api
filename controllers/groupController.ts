import type { Request, Response } from "express";
import Group from "../models/group.ts";
import ApiError from "../utils/ApiError.ts";

export const getGroups = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || (req.query.userId as string) || null;

    const query = userId
      ? { $or: [{ createdBy: userId }, { members: userId }] }
      : {};

    const groups = await Group.find(query)
      .populate("createdBy", "username email")
      .populate("members", "username email")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, data: groups });
  } catch (err: any) {
    res.status(err?.statusCode || 500).json({ success: false, message: err?.message || "Failed to fetch groups" });
  }
};

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, members } = req.body;
    const createdBy = req.user?._id
    if (!name || !createdBy) throw ApiError.badRequest("Name and createdBy are required");
    console.log(members)
    const group = await Group.create({
      name,
      createdBy,
      members: (members || []).map((id: string) => id),
    });

    const populatedGroup = await group.populate({ path: "members", select: "username email" });

    res.status(201).json({ success: true, data: populatedGroup });
  } catch (err: any) {
    res.status(err?.statusCode || 500).json({ success: false, message: err?.message || "Failed to create group" });
  }
};

export const addMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!id || !userId) throw ApiError.badRequest("Group ID and User ID are required");

    const group = await Group.findByIdAndUpdate(
      id,
      { $addToSet: { members: userId } },
      { new: true }
    ).populate("members", "username email");

    if (!group) throw ApiError.notFound("Group not found");

    res.status(200).json({ success: true, data: group });
  } catch (err: any) {
    res.status(err?.statusCode || 500).json({ success: false, message: err?.message || "Failed to add member" });
  }
};

export const getGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) throw ApiError.badRequest("Group ID is required");

    const group = await Group.findById(id)
      .populate("createdBy", "username email")
      .populate("members", "username email");

    if (!group) throw ApiError.notFound("Group not found");

    res.status(200).json({ success: true, data: group });
  } catch (err: any) {
    res.status(err?.statusCode || 500).json({ success: false, message: err?.message || "Failed to fetch group details" });
  }
};
