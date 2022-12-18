import { useEffect, useState } from "react";
import "./Modal.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

function Modal() {
  const [garden, setGarden] = useState({});
  const [trees, setTrees] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/trees")
      .then((res) => res.json())
      .then((data) => {
        setTrees(data);
      });
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/gardens/${localStorage.getItem("garden_id")}`
    )
      .then((res) => res.json())
      .then((data) => {
        setGarden({
          garden_name: data.garden_name,
          description: data.description,
          tree_id: "0",
          start_date: "",
        });
      });
  }, []);

  const handleInputText = (e) => {
    setGarden({
      ...garden,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeDate = (e) => {
    setGarden({
      ...garden,
      start_date: e.target.value,
    });
  };

  const handleChangeTree = (e) => {
    setGarden({
      ...garden,
      tree_id: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (garden.tree_id === "0") {
      alert("Vui lòng chọn cây trồng");
      return;
    } else {
      fetch(
        `http://localhost:5000/api/garden-initialize/${localStorage.getItem(
          "garden_id"
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(garden),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          alert("Khởi tạo thành công");
          window.location.reload();
        })
        .catch((error) => {
          alert("Có lỗi. Vui lòng kiểm tra lại");
        });
    }
  };

  return (
    <div className="modal">
      <h1>KHỞI TẠO</h1>
      <div className="form">
        <div className="form-item">
          <label htmlFor="garden-name">Tên vườn</label>
          <input
            type="text"
            id="garden-name"
            name="garden_name"
            value={garden.garden_name}
            onChange={handleInputText}
          />
        </div>
        <div className="form-item">
          <label htmlFor="garden-description">Mô tả</label>
          <input
            type="text"
            id="garden-description"
            name="description"
            value={garden.description}
            onChange={handleInputText}
          />
        </div>
        <div className="form-item">
          <label htmlFor="start-date">Ngày bắt đầu</label>
          <input type="date" id="start-date" onChange={handleChangeDate} />
        </div>
        <div className="form-item">
          <label htmlFor="tree_id">Cây trồng</label>
          <select
            name="tree_id"
            id="tree_id"
            onChange={handleChangeTree}
            defaultValue={garden.tree_id}
          >
            <option value="0">Chọn cây trồng</option>
            {trees.map((tree) => (
              <option value={tree.id}>{tree.name}</option>
            ))}
          </select>
        </div>
        <div className="form-submit-btn">
          <button onClick={handleSubmit}>Thiết lập</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
