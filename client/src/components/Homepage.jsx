import React from "react";
import { useState } from "react";
import moment from "moment";
import "./Homepage.css";
import { Link } from "react-router-dom";

function Homepage() {
  const [welcome, setWelcome] = useState("Welcome to the Homepage");
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  const [users, setUsers] = useState([]);
  const [gardens, setGardens] = useState([]);
  const [data, setData] = useState([]);

  const getAllUsers = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/users");
    const users = await response.json();
    setUsers(users);
  };

  const getAllGarden = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/gardens");
    const gardens = await response.json();
    setGardens(gardens);
  };

  const getAllData = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/data");
    const data = await response.json();
    setData(data);
  };

  const login = (e) => {
    e.preventDefault();
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: account.username,
        password: account.password,
      }),
    };
    fetch("http://localhost:5000/api/login", option)
      .then((res) => res.json())
      .then((res) => {
        if (res.success === true) {
          localStorage.setItem("user", JSON.stringify(res.user));
          setWelcome("Welcome back, " + res.user.username);
        } else {
          setWelcome("Login Failed");
        }
      });
  };

  const getGardenByUserId = async (e) => {
    e.preventDefault();
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const response = await fetch(`http://localhost:5000/api/gardens/${userId}`);
    const gardens = await response.json();
    setGardens(gardens);
  };

  return (
    <div className="homepage-container">
      <h1 className="welcome">{welcome}</h1>
      <div className="form">
        <input
          type="text"
          name="username"
          id="input_username"
          onChange={(e) => {
            setAccount({ ...account, username: e.target.value });
          }}
        />
        <input
          type="password"
          name="password"
          id="input_password"
          onChange={(e) => {
            setAccount({ ...account, password: e.target.value });
          }}
        />
        <button onClick={login}>Login</button>
      </div>
      <div className="btn">
        <button onClick={getAllUsers}>Get All User</button>
        <button onClick={getAllGarden}>Get All Garden</button>
        <button onClick={getAllData}>Get All Data</button>
        <button onClick={getGardenByUserId}>Get Garden By User ID</button>
      </div>
      <div className="result">
        {users.map((user) => (
          <div className="item" key={user.id}>
            <h3>{user.id}</h3>
            <p>{user.username}</p>
            <p>{user.password}</p>
          </div>
        ))}
        {gardens.map((garden) => (
          <div className="item" key={garden.id}>
            <h3>{garden.id}</h3>
            <p>{garden.manager_id}</p>
            <p>{garden.name}</p>
            <p>{moment(garden.start_date).format("DD/MM/YYYY")}</p>
            <p>{garden.description}</p>
            <p>{garden.tree_id}</p>
            <p>{garden.AIO_Username}</p>
            <p>{garden.AIO_Key}</p>
            <p>{garden.high_threshold}</p>
            <p>{garden.low_threshold}</p>
            <button>
              <Link to={`/data/${garden.id}`} className="see-data">
                See Data
              </Link>
            </button>
          </div>
        ))}
        {data.map((item) => (
          <div className="item" key={item.id}>
            <h3>{item.id}</h3>
            <p>{item.garden_id}</p>
            <p>{item.time}</p>
            <p>{moment(item.date).format("DD/MM/YYYY")}</p>
            <p>{item.temperature}</p>
            <p>{item.humidity}</p>
            <p>{item.soil_moisture}</p>
            <p>{item.pump_status}</p>
            <p>{item.door_status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Homepage;
