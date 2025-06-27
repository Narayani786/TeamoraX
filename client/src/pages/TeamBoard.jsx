import React, { useEffect, useState, useContext } from "react";
import API from "../api";
import TaskColumn from "../components/TaskColumn";
import { DragDropContext } from "@hello-pangea/dnd";
import { useNavigate } from 'react-router-dom';
// Socket.IO support
import { io } from "socket.io-client";

const socket = io('https://teamorax-backend.onrender.com');

const TeamBoard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [team, setTeam] = useState(null);

  const token = localStorage.getItem("token");

  // Load team from localStorage safely
  useEffect(() => {
    try {
      const teamData = localStorage.getItem("team");
      if (teamData) {
        const parsed = JSON.parse(teamData);
        if (parsed && parsed._id) {
          setTeam(parsed);
        } else {
          console.warn("Invalid team data in localStorage.");
        }
      } else {
        console.warn("No team found in localStorage.");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error parsing team from localStorage:", err);
    }
  }, []);

  // Fetch tasks when team is available
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!team || !team._id) return;
        const res = await API.get(
          `/api/tasks/team/${team._id}`,
          {
            headers: { Authorization: `Bearer ${token}`
          },
          });
        setTasks(res.data);
      } catch (err) {
        console.error("Error in fetchTasks:", err.response?.data || err.message);
      }
    };
    fetchTasks();
  }, [team, token]);


  // Handle task creation
  const handleCreateTask = async () => {
  if (!newTask.trim()) return; // Ignore empty input
  try {
    const res = await API.post(
      `/api/tasks/create`,
      {
        title: newTask,
        teamId: team._id,
        status: "todo",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    const createdTask = res.data;

    setNewTask(""); // Clear input
    socket.emit("taskCreated", createdTask);
  } catch (err) {
    console.error('Task creation failed:', err);
  }
};

  // Handle task drag/drop status change
  const handleStatusChange = async ({taskId, newStatus}) => {
    try {
      await API.put(
        `/api/tasks/${taskId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}`
      }
    });
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      socket.broadcast.emit("statusChanged", { taskId, newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };


  // Handle Drag/End
 const handleDragEnd = async (result) => {
  const { destination, source, draggableId } = result;

  // If dropped outside or in the same column, do nothing
  if (!destination || destination.droppableId === source.droppableId)
    return;

  const taskId = draggableId;
  const newStatus = destination.droppableId;

  try {
    // Update task status on the server
    const token = localStorage.getItem('token');
    const res = await API.put(
      `/api/tasks/${taskId}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}`
    }
  });

    // Update the task in the frontend state
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // Notify other users via socket
    socket.emit("statusChanged", {
      taskId,
      newStatus
    });
  } catch (err) {
    console.error('Failed to update status', err?.response?.data || err.message);
  }
};


// Handle Deleting task
const handleDeleteTask = async (taskId) => {
  try {
    await API.delete(`/api/tasks/${taskId}`,
      {
      headers: { Authorization: `Bearer ${token}`
    },
  });
    setTasks((prev) => prev.filter((task) => task._id !== taskId));
    socket.emit('taskdeleted', taskId);
  } catch (err) {
    console.error('Error deleting task:', err.response?.data || err.message);
  }
};


const handleSwitchTeam = () => {
  localStorage.removeItem('team');
  navigate('/dashboard');
};


const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('team');
  navigate('/login');
};


 useEffect(() => {
  if (!team || !team._id) return;

  const socket = io("https://teamorax-backend.onrender.com");

  socket.on("taskCreated", (task) => {
    if (task.teamId === team._id) {
      setTasks((prev) => [...prev, task]);
    }
  });

  socket.on("statusChanged", ({ taskId, newStatus }) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );
  });

  return () => {
    socket.disconnect(); // Clean up
  };
}, [team?._id, token]);


return (
  <div className="teamboard-container">
    <div className="top-bar">
    <button onClick={handleLogout} className="logout-btn" >Logout</button>
    </div>
    <h1>Welcome to {team?.name} Board </h1>
    <hr/>
    {team ? (
      <>
          <strong className="badge">Team: {team.name} | Code: {team.code}</strong>
        <button onClick={handleSwitchTeam} className="switch-team-btn">Switch team</button>
        <div className="input-btn-wrapper">
        <input
          type="text"
          placeholder="Enter new task"
          value={newTask}
          className="teamboard-input"
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleCreateTask} className="add-btn">Add</button>
        </div>
        <hr/>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="board-columns">
            <TaskColumn
              status="todo"
              title="To Do"
              tasks={tasks.filter((t) => t && t.status === "todo")}
              onStatusChange={handleStatusChange}
              className="task-column"
              onDelete={handleDeleteTask}
            />
            <TaskColumn
              status="in-progress"
              title="In Progress"
              tasks={tasks.filter((t) => t && t.status === "in-progress")}
              onStatusChange={handleStatusChange}
              className="task-column"
              onDelete={handleDeleteTask}
            />
            <TaskColumn
              status="done"
              title="Done"
              tasks={tasks.filter((t) => t && t.status === "done")}
              onStatusChange={handleStatusChange}
              className="task-column"
              onDelete={handleDeleteTask}
            />
          </div>
        </DragDropContext>
      </>
    ) : (
      <p>No team selected. Please join a team first.</p>
    )}
  </div>
  );
};

export default TeamBoard;
