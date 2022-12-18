import Header from "../../utils/header/Header";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import "./Statistic.css";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Statistic = () => {
  const navigation = useNavigate();
  const [value, setValue] = useState(dayjs());
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/chart/${localStorage.getItem(
        "garden_id"
      )}/${value.format("YYYY-MM-DD")}`
    )
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [value]);

  useEffect(() => {
    if (localStorage.getItem("garden_id") == null) navigation("/");
  }, []);

  const temperatureOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Thống kê nhiệt độ trong ngày",
      },
    },
  };

  const moistureOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Thống kê độ ẩm đất trong ngày",
      },
    },
  };

  const humidityOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Thống kê độ ẩm không khí trong ngày",
      },
    },
  };

  const labels = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ];

  const temperatureData = {
    labels,
    datasets: [
      {
        label: "Nhiệt độ",
        data: data.temperature,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const moistureData = {
    labels,
    datasets: [
      {
        label: "Độ ẩm đất",
        data: data.moisture,
        borderColor: "rgb(166, 55, 55)",
        backgroundColor: "rgba(166, 55, 55, 0.5)",
      },
    ],
  };

  const humidityData = {
    labels,
    datasets: [
      {
        label: "Độ ẩm không khí",
        data: data.humidity,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return (
    <div className="statistic-container">
      <Header data="THỐNG KÊ" />
      <div className="statistic-body">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Lọc theo ngày"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <div className="statistic-body-chart">
          <Line
            style={{ width: "95%" }}
            options={temperatureOptions}
            data={temperatureData}
          />
        </div>
        <div className="statistic-body-chart">
          <Line
            style={{ width: "95%" }}
            options={moistureOptions}
            data={moistureData}
          />
        </div>
        <div className="statistic-body-chart">
          <Line
            style={{ width: "95%" }}
            options={humidityOptions}
            data={humidityData}
          />
        </div>
      </div>
    </div>
  );
};

export default Statistic;
