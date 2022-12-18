import Header from "../../utils/header/Header";
import { RiDoorOpenFill, RiDoorClosedFill } from "react-icons/ri";
import "./Data.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import mqttClient from "../../utils/MQTTClient";

const Data = () => {
  const navigation = useNavigate();
  const [temperature, setTemperature] = useState(0);
  const [humid, setHumid] = useState(0);
  const [moisture, setMoisture] = useState(0);
  const [door, setDoor] = useState(0);
  const [pump, setPump] = useState(0);
  const [handle, setHandle] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("garden_id") == null) navigation("/");
  }, []);

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
        <div className="data-body-items">
          <div className="data-body-item danger">
            <p>
              Nhiệt độ: {temperature} <sup>o</sup>C
            </p>
          </div>
          <div className="data-body-item normal">
            <p>Độ ẩm không khí: {humid}% </p>
          </div>
          <div className="data-body-item normal">
            <p>Độ ẩm đất: {moisture}% </p>
          </div>
          <div className="data-body-item door">
            <p>
              Máy bơm:
              {pump == 1 ? <span>&nbsp;Bật</span> : <span>&nbsp;Tắt</span>}
            </p>
            {handle ? (
              <div onClick={togglePump}>
                {pump == 0 ? (
                  <FontAwesomeIcon icon={faToggleOff} />
                ) : (
                  <FontAwesomeIcon icon={faToggleOn} />
                )}
              </div>
            ) : null}
          </div>
          <div className="data-body-item door">
            <p>Cửa:</p>
            <span onClick={toggleDoor}>
              {door == 1 ? (
                <>
                  <p>Mở</p>
                  <RiDoorOpenFill />
                </>
              ) : (
                <>
                  <p>Đóng</p>
                  <RiDoorClosedFill />
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Data;
