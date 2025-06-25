import axios from 'axios';

  const API_BASE = 'http://localhost:5000/api';

  // AUTHS
export const loginUser = async (email, password) => {

  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password,
    });
    return res.data;
  } catch (err) {
    return { error: err.response?.data?.error || 'Login failed' };
  }
};

export const registerUser = async ({ username, email, password }) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/register`, {
      username,
      email,
      password,
    });
    return res.data;
  } catch (err) {
    return { error: err.response?.data?.error || 'Registration failed' };
  }
};


// TEAMS
export const createTeam = async (teamName, token) => {
  try {
    const res = await axios.post(
      `${API_BASE}/team/create`,
      { name: teamName },
      {
        headers: { Authorization: `Bearer ${token}`
      },
    });
    return res.data;
  } catch (err) {
    return { error: err.response?.data?.error || 'Team creation failed' };
  }
};


export const joinTeam = async (teamCode) => {
    const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      "http://localhost:5000/api/team/join",
      { code: teamCode },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  } catch (err) {
    console.error("Join team error:", err.response?.data || err.message);
  }
};


export const getTeamInfo = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/team/info`, {
      headers: { Authorization: `Bearer ${token}`
    },
  });
    return res.data;
  } catch (err) {
    return { error: err.response?.data?.error || 'Fetching team info failed' };
  }
};


// TASKS
export const createTask = async (taskData, token) => {
  try {
    const res = await axios.post(`${API_BASE}/task/create`, taskData, {
      headers: { Authorization: `Bearer ${token}`
    },
  });
    return res.data;
  } catch (err) {
    return { error: err.response?.data?.error || 'Creating task failed' };
  }
};


export const updateTaskStatus = async (taskId, status, token) => {
  try {
    const res = await axios.put(
      `${API_BASE}/task/status/${taskId}`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}`
      },
      });
    return res.data;
  } catch (err) {
    return { error: err.response?.data?.error || 'Updating task failed' };
  }
};


export const getTasksByTeam = async (teamId, token) => {
  try {
    const res = await axios.get(`${API_BASE}/task/team/${teamId}`, {
      headers: { Authorization: `Bearer ${token}`
    },
  });
    return res.data;
  } catch (err) {
    return { error: err.response?.data?.error || 'Getting tasks failed' };
  }
};
