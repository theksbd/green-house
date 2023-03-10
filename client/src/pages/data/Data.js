import Header from "../../utils/header/Header";
import { RiDoorOpenFill, RiDoorClosedFill } from "react-icons/ri";
import "./Data.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import TemperatureIcon from "./temperature.png";
import HumidityIcon from "./humid.png";
import MoistureIcon from "./moisture.png";

// const mqttClient = require("../../utils/MQTTClient");
import { mqttClient } from "../../utils/MQTTClient";

const Data = () => {
  const navigation = useNavigate();
  const [temperature, setTemperature] = useState(0);
  const [humid, setHumid] = useState(0);
  const [moisture, setMoisture] = useState(0);
  const [door, setDoor] = useState(0);
  const [pump, setPump] = useState(0);
  const [handle, setHandle] = useState(true);

  const check = (moisture) => {
    fetch(
      `http://localhost:5000/api/gardens/${localStorage.getItem("garden_id")}`
    )
      .then((res) => res.json())
      .then((data) => {
        setHandle(
          moisture < data.high_threshold && moisture >= data.low_threshold
        );
      });
  };

  const initData = () => {
    mqttClient.feeds.forEach((feed, index) => {
      fetch(
        `https://io.adafruit.com/api/v2/${mqttClient.username}/feeds/${feed}/data/last?X-AIO-Key=${mqttClient.key}`
      )
        .then((res) => res.json())
        .then((data) => {
          switch (feed) {
            case "temperature":
              setTemperature(data.value);
              break;
            case "moisture":
              setMoisture(data.value);
              check(data.value);
              break;
            case "humid":
              setHumid(data.value);
              break;
            case "door":
              setDoor(data.value);
              break;
            case "pump":
              setPump(data.value);
              break;
            default:
              break;
          }
        });
    });
  };

  useEffect(() => {
    if (localStorage.getItem("garden_id") == null) {
      navigation("/");
    } else {
      initData();
      mqttClient.on("message", (topic, message) => {
        const feed = topic.split("/")[2];
        switch (feed) {
          case "temperature":
            setTemperature(parseInt(message.toString()));
            break;
          case "humid":
            setHumid(parseInt(message.toString()));
            break;
          case "moisture":
            setMoisture(parseInt(message.toString()));
            check(parseInt(message.toString()));
            break;
          case "pump":
            setPump(parseInt(message.toString()));
            break;
          case "door":
            setDoor(parseInt(message.toString()));
            break;
          default:
        }
      });
    }
  }, []);

  const togglePump = () => {
    var data = (pump + 1) % 2;
    mqttClient.publish(`${mqttClient.username}/feeds/pump`, "" + data);
  };
  const toggleDoor = () => {
    var data = (door + 1) % 2;
    mqttClient.publish(`${mqttClient.username}/feeds/door`, "" + data);
  };

  return (
    <div className="data-container">
      <Header data="DỮ LIỆU" />
      <div className="data-body">
        <div className="data-banner">
          <div className="data-item temperature">
            <div className="title">Nhiệt độ:</div>
            <div className="value">
              <div className="text">
                {temperature} <sup>o</sup>C
              </div>
              <div className="icon">
                <img src={TemperatureIcon} />
              </div>
            </div>
          </div>
          <div className="data-item humidity">
            <div className="title">Độ ẩm khí:</div>
            <div className="value">
              <div className="text">{humid}% </div>
              <div className="icon">
                <img src={HumidityIcon} />
              </div>
            </div>
          </div>
          <div className="data-item moisture">
            <div className="title">Độ ẩm đất:</div>
            <div className="value">
              <div className="text">{moisture}%</div>
              <div className="icon">
                <img src={MoistureIcon} />
              </div>
            </div>
          </div>
          <div className="data-item pump">
            <div className="title">Máy bơm:</div>
            <div className="value">
              {pump == 1 ? (
                <div className="text">&nbsp;Bật</div>
              ) : (
                <div className="text">&nbsp;Tắt</div>
              )}
              {handle ? (
                <div className="icon button" onClick={togglePump}>
                  {pump == 0 ? (
                    <FontAwesomeIcon icon={faToggleOff} />
                  ) : (
                    <FontAwesomeIcon icon={faToggleOn} />
                  )}
                </div>
              ) : null}
            </div>
          </div>
          <div className="data-item door">
            <div className="title">Cửa:</div>
            <div className="value">
              {door == 1 ? (
                <>
                  <div className="text">Mở</div>
                  <div className="icon button">
                    <RiDoorOpenFill />
                  </div>
                </>
              ) : (
                <>
                  <div className="text">Đóng</div>
                  <div className="icon button">
                    <RiDoorClosedFill />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Data;
