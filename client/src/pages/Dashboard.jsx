import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [joinedTeams, setJoinedTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

    const fetchJoinedTeams = async () => {
      const token = localStorage.getItem('token');

      if(!token) {
        console.error('No token is found in localStorage');
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/team/joined', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJoinedTeams(res.data);
      } catch (err) {
        console.error('Failed to fetch joined teams:', err.response?.data || err.message );
      }
    };
    
    useEffect(() => {
      fetchJoinedTeams();
    }, []);
  

  const handleSelectTeam = (team) => {
    localStorage.setItem('team', JSON.stringify(team));
    navigate('/teamboard');
  };


  // Handle Create Team
 const handleCreateTeam = async () => {
  
  try {
    const res = await axios.post(
      "http://localhost:5000/api/team/create",
      { name: teamName },
      { headers: { Authorization: `Bearer ${token}`
    },
  });
  
  const createdTeam = res.data;

  localStorage.setItem('team', JSON.stringify(createdTeam));

  fetchJoinedTeams();
  navigate("/teamboard");
  } catch (err) {
    console.error("Error creating team:", err.response?.data || err.message);
  }
};


  // Handle Join Team
  const handleJoinTeam = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        'http://localhost:5000/api/team/join',
        { code: joinCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
          
      if (res.data && res.data.team) {
        localStorage.setItem('team', JSON.stringify(res.data.team));
        alert(`Joined team: ${res.data}`);
        navigate('/teamboard');
      } else {
        alert('Failed to join team');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to join team');
    }
  };


  // Handle Leave Team
const handleLeaveTeam = async (teamToLeave) => {
  const token = localStorage.getItem("token");
  if (!teamToLeave || !teamToLeave._id) {
    alert("No team selected to leave.");
    return;
  }

  const confirmLeave = window.confirm(`Are you sure you want to leave ${teamToLeave.name}?`);
  if (!confirmLeave) return;

  try {
    const res = await axios.post(
      "http://localhost:5000/api/team/leave",
      { teamId: teamToLeave._id },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

    // If this is the selected team, clear localStorage
    const currentTeam = JSON.parse(localStorage.getItem("team"));
    if (currentTeam && currentTeam._id === teamToLeave._id) {
      localStorage.removeItem("team");
    }

    alert(`Left the team: ${teamToLeave.name}`);
    setJoinedTeams((prev) => prev.filter((team) => team._id !== teamToLeave._id));
  } catch (err) {
    console.error("Error leaving team:", err.response?.data || err.message);
    alert("Failed to leave the team.");
  }
};


const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('team');
  navigate('/login');
};



  return (
      <div className="dashboard-form-container">
        <div className='top-bar'>
        <button onClick={handleLogout} className="logout-btn" >Logout</button>
      </div>
      <h1>Dashboard</h1>
      <hr/>
        {/* Create Team */}
        <div className="dashboard-form-grp">
          <h2>Create a Team</h2>
          <input
            type="text"
            placeholder="Team Name"
            className="dashboard-input"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <button
            className="dashboard-btn"
            onClick={handleCreateTeam}
          >
            Create Team
          </button>
        </div>

        {/* Join Team */}
        <div className='dashboard-form-grp'>
          <h2>Join a Team</h2>
          <input
            type="text"
            placeholder="Enter Team Code"
            className="dashboard-input"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
          <button
            className="dashboard-btn"
            onClick={handleJoinTeam}
          >
            Join Team
          </button>
        </div>
          <br/>
        <hr/>
          <h3>Your joined teams:</h3>
          <div className='dashboard-team-section'>
          {joinedTeams.length > 0 ? (
            <ul className='team-list'>
              {joinedTeams.map((team) => (
                <li key={team._id} className='list-item'>
                  <strong>{team.name}</strong>
                  ({team.code})
                <button onClick={() => 
                handleSelectTeam(team)} className='btn-small-safe'>Open</button>
                <button onClick={() => 
                handleLeaveTeam(team)} className='btn-small-danger'>Leave</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't joined any teams yet.</p>
          )}
        </div>
      </div>
  );
};

export default Dashboard;
