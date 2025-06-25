import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, status, teamId } = req.body;

    if (!title || !teamId) {
      return res.status(400).json({ error: 'Title and teamId are required' });
    }
    const newTask = await Task.create ({
      title,
      description,
      status: status || 'todo',
      teamId,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
};


export const getTasksByTeam = async (req, res) => {
  try {
    const {teamId} = req.params.teamId;
    const tasks = await Task.find({ teamId });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in getTasksByTeamId:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};


export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      taskId
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task.status = status;
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    console.error('Error updating task status:', err);
    res.status(500).json({ message: 'Failed to update task status', error: err.message});
  }
};


export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.deleteOne();

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
