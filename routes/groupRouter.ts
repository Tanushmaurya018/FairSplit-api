import express from "express";
import { getGroups, createGroup, addMember, getGroupById } from "../controllers/groupController.ts";
import { verifyUserToken } from "../middlewares/verifyToken.ts";

const router = express.Router();

router.get("/", verifyUserToken, getGroups);
router.post("/", verifyUserToken, createGroup);
router.post("/:id/members", verifyUserToken, addMember);
router.get("/:id", verifyUserToken, getGroupById);

export default router;
