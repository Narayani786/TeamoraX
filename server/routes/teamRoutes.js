import express from "express";
import {
  createTeam,
  joinTeam,
  getTeamAndTasks,
  getJoinedTeams,
  leaveTeam
} from "../controllers/teamControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/joined", verifyToken, getJoinedTeams);
router.post("/join", verifyToken, joinTeam);
router.post("/create", verifyToken, createTeam);
router.get("/:teamId", verifyToken, getTeamAndTasks);
router.post("/leave", verifyToken, leaveTeam);

export default router;
