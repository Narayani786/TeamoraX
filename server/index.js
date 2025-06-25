import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend
    methods: ["GET", "POST", "PUT"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/tasks", taskRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("taskCreated", (task) => {
    socket.broadcast.emit("taskCreated", task);
  });

  socket.on("statusChanged", ({ taskId, newStatus }) => {
    socket.broadcast.emit("statusChanged", { taskId, newStatus });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
