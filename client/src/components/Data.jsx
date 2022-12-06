import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import "./Data.css";

function Data() {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const currentGardenId = Number(location.pathname.split("/")[2]);

  const getDataByGardenId = async () => {
    const option = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    const response = await fetch(
      `http://localhost:5000/api/data/${currentGardenId}`,
      option
    );
    const data = await response.json();
    setData(data);
    setAllData(data);
  };

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleChangeDate = (e) => {
    const newData = allData.filter((item) =>
      isSameDate(new Date(item.date), new Date(e.target.value))
    );
    setData(newData);
  };

  useEffect(() => {
    getDataByGardenId();
  }, []);

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
          <p>Pump Status: {item.pump_status}</p>
          <p>Door Status: {item.door_status}</p>
          <p>High Threshold: {item.high_threshold}</p>
          <p>Low Threshold: {item.low_threshold}</p>
        </div>
      ))}
    </div>
  );
}

export default Data;
