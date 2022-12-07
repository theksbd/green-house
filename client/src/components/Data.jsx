import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import "./Data.css";

function Data() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const currentGardenId = Number(location.pathname.split("/")[2]);

  const getDataByDate = async (date) => {
    const res = await fetch(
      `http://localhost:5000/api/data/${currentGardenId}/${date}`
    );
    const data = await res.json();
    setData(data);
  };

  const handleChangeDate = (e) => {
    getDataByDate(e.target.value);
  };

  return (
    <div>
      <h1>Data</h1>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          Return to Homepage
        </button>
      </div>
      <input
        type="date"
        name="date"
        id="input_date"
        onChange={handleChangeDate}
      />
      {data.map((item) => (
        <div className="container" key={item.id}>
          <h3>Data ID: {item.id}</h3>
          <p>Garden ID: {item.garden_id}</p>
          <p>Time: {item.time}</p>
          <p>Date: {moment(item.date).format("DD/MM/YYYY")}</p>
          <p>Temperature: {item.temperature}</p>
          <p>Humidity: {item.humidity}</p>
          <p>Soil Moisture: {item.soil_moisture}</p>
          <p>Pump Status: {item.pump_status ? "Open" : "Close"}</p>
          <p>Door Status: {item.door_status ? "Open" : "Close"}</p>
        </div>
      ))}
    </div>
  );
}

export default Data;
