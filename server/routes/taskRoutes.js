import express from "express";
import { createTask,
    getTasksByTeam,
    updateTaskStatus,
    deleteTask
} from "../controllers/taskControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createTask);
router.put("/:taskId/status", verifyToken, updateTaskStatus);
router.get("/team/:teamId", verifyToken, getTasksByTeam);
router.delete('/:taskId', verifyToken, deleteTask);

export default router;
