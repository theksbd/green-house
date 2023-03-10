import Header from "../../utils/header/Header";
import React, { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import "./History.css";
import TableRow from "./components/TableRow";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigation = useNavigate();
  const [value, setValue] = React.useState(dayjs());
  const [data, setData] = useState([]);
  const showData = () => {
    return data.map((data, key) => {
      return <TableRow key={key} data={data}></TableRow>;
    });
  };

  useEffect(()=>{
    fetch(`http://localhost:5000/api/data/${localStorage.getItem("garden_id")}/${value.format("YYYY-MM-DD")}`)
    .then(res => res.json())
    .then(data => setData(data))
  }, [value]);

  useEffect(()=>{
    if (localStorage.getItem("garden_id") == null) navigation("/");
  },[])

  return (
    <div className="history-container">
      <Header data="LỊCH SỬ" />
      <div className="history-body">
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
        <div className="history-body-content">
          <table>
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Nhiệt độ</th>
                <th>Độ ẩm đất</th>
                <th>Độ ẩm không khí</th>
              </tr>
            </thead>
            <tbody>{showData()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
