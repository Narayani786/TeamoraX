import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Task", taskSchema);
