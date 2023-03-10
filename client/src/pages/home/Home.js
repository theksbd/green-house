import Header from "../../utils/header/Header";
import Percent from "./Percent";
import { AiOutlineArrowDown, AiFillSetting } from "react-icons/ai";
import "./Home.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneEdit } from "react-icons/ai";
import axios from "axios";
import Modal from "./Modal";

const Home = () => {
  const navigation = useNavigate();
  const [threshold, setThreshold] = useState({ low: 0, high: 5 });
  const [thresholdSetting, setThresholdSetting] = useState({ low: 0, high: 5 });
  const [settingMode, setSettingMode] = useState(false);
  const [garden, setGarden] = useState({});
  const [modal, setModal] = useState(false);

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/gardens/${localStorage.getItem("garden_id")}`
    )
      .then((res) => res.json())
      .then((data) => {
        setThreshold({ low: data.low_threshold, high: data.high_threshold });
        setThresholdSetting({
          low: data.low_threshold,
          high: data.high_threshold,
        });
        setGarden({
          tree: data.name,
          img: data.img_url,
          day: data.differentInDay,
          phase: data.phase.name,
        });
      });
  }, []);

  const setLowThreshold = (e) => {
    setThresholdSetting({
      low: e.target.value,
      high: thresholdSetting.high,
    });
  };

  const setHighThreshold = (e) => {
    setThresholdSetting({
      low: thresholdSetting.low,
      high: e.target.value,
    });
  };

  const checkThreshold = () => {
    return thresholdSetting.low < thresholdSetting.high;
  };

  const updateThreshold = () => {
    axios
      .put(
        `http://localhost:5000/api/pump-threshold/${localStorage.getItem(
          "garden_id"
        )}`,
        {
          high_threshold: thresholdSetting.high,
          low_threshold: thresholdSetting.low,
        }
      )
      .then((res) => {
        setThreshold(thresholdSetting);
        setSettingMode(!settingMode);
        alert("Đã cập nhật.");
      })
      .catch((error) => {
        alert("Có lỗi. Vui lòng tải lại trang.");
      });
  };

  const openModal = () => {
    setModal(true);
  };

  useEffect(() => {
    if (localStorage.getItem("garden_id") == null) navigation("/");
    setThreshold({ low: 30, high: 50 });
  }, []);

  return (
    <div className="home-container">
      <Header data="Thông tin" />
      <div className="home-body">
        <div className="home-tree-info">
          <button className="btn-initialize-garden" onClick={openModal}>
            <AiTwotoneEdit />
          </button>
          <div className="tree-image">
            <img src={garden.img} />
          </div>
          <div className="home-tree-name">{garden.tree}</div>
        </div>
        <div className="home-row">
          <div className="home-row-title">Thời gian trồng:</div>
          <div className="home-row-value">{garden.day} ngày</div>
        </div>
        <div className="home-row">
          <div className="home-row-title">Giai đoạn:</div>
          <div className="home-row-value">{garden.phase}</div>
        </div>

        <div className="home-row home-threshold">
          <div className="threshold-title">
            <div className="threshold-name">Ngưỡng độ ẩm đất:</div>
            <div
              className="threshold-setting"
              onClick={() => setSettingMode(!settingMode)}
            >
              {settingMode ? <AiOutlineArrowDown /> : <AiFillSetting />}
            </div>
          </div>
          <div
            className={
              "threshold-value " + (settingMode ? "setting-hidden" : "")
            }
          >
            <div className="low-threshold threshold-span">
              <Percent data={threshold.low} />
              <div className="threshold-value-title">DƯỚI</div>
            </div>
            <div className="high-threshold threshold-span">
              <Percent data={threshold.high} />
              <div className="threshold-value-title">TRÊN</div>
            </div>
          </div>
          <div
            className={
              "threshold-value " + (settingMode ? "" : "setting-hidden")
            }
          >
            <div className="low-threshold threshold-span">
              <div className="threshold-value-title">
                DƯỚI: {thresholdSetting.low} %
              </div>
              <input
                className="threshold-input"
                type="range"
                min={0}
                max={100}
                step={5}
                onChange={setLowThreshold}
                value={thresholdSetting.low}
              />
            </div>
            <div className="low-threshold threshold-span">
              <div className="threshold-value-title">
                TRÊN: {thresholdSetting.high} %
              </div>
              <input
                className="threshold-input"
                type={"range"}
                min={0}
                max={100}
                step={5}
                onChange={setHighThreshold}
                value={thresholdSetting.high}
              />
            </div>
            {!checkThreshold() ? null : (
              <div className="setting-save-button" onClick={updateThreshold}>
                Lưu
              </div>
            )}
          </div>
        </div>
      </div>
      {modal && 
        <>
          <Modal />
          <div className="overlay" onClick={() => setModal(false)}></div>
        </>
      }
    </div>
  );
};

export default Home;
