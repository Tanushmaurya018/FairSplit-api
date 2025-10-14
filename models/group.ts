import mongoose, { Document, Schema, Model, model } from "mongoose";
import type { IGroup } from "../interfaces/group.d";

export interface IGroupDocument extends IGroup, Document {}

const groupSchema = new Schema<IGroupDocument>(
  {
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  },
  { timestamps: true }
);

const Group: Model<IGroupDocument> = model<IGroupDocument>("Group", groupSchema);
export default Group;
