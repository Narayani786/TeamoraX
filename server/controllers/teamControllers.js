import Team from '../models/Team.js';
import Task from '../models/Task.js';

export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;

    if (!name|| !userId) {
      return res.status(400).json({ message: "Team name is required" });
    }
    // Generate a random unique 6-character code
    const code = Math.random().toString(36).substring(2, 8);
    const newTeam = new Team({
      name,
      code,
      members: [userId], // assuming verifyToken adds req.userId
    });
    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (err) {
    console.error(" Error in createTeam:", err);
    res.status(500).json({ message: "Server error while creating team" });
  }
};


export const joinTeam = async (req, res) => {
  const { code } = req.body;
  const userId = req.userId;

  if (!code) return res.status(400).json({ message: "Code is required" });
  try {
    const team = await Team.findOne({ code });
    if (!team) return res.status(404).json({ message: "Team not found" });

    // Check if user is already a member
    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
    }
    res.status(200).json({ team });
  } catch (error) {
    console.error("Join team error:", error);
    res.status(500).json({ message: "Failed to join team" });
  }
};

// Get team info and tasks
export const getTeamAndTasks = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    const tasks = await Task.find({ teamId });
    res.status(200).json({ team, tasks });
  } catch (err) {
    console.error('Get team and tasks error:', err);
    res.status(500).json({ message: 'Failed to get team info or tasks' });
  }
};


export const getJoinedTeams = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. No user ID.' });
    }
    const teams = await Team.find({ members: userId });
    res.status(200).json(teams);
  } catch (error) {
    console.error("Error in getJoinedTeams:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const leaveTeam = async (req, res) => {
  try {
    const userId = req.userId;
    const { teamId } = req.body;

    if (!userId || !teamId) {
      return res.status(400).json({ message: "Missing user or team ID" });
    }
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Remove user from team members
    team.members = team.members.filter(
      (memberId) => memberId.toString() !== userId
    );
    await team.save();
    res.status(200).json({ message: "Left the team successfully" });
  } catch (error) {
    console.error("Error in leaveTeam:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
