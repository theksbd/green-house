import { useEffect, useState } from "react";
import "./Modal.css";

function Modal() {
  const [garden, setGarden] = useState({
    
  });
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
          tree_id: data.tree_id,
          start_date: new Date().toISOString().slice(0,10),
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
    var now = new Date().toISOString().slice(0,10);
    if (e.target.value > now) alert("Không thể chọn ngày trong tương lai.")
    else { 
      setGarden({
        ...garden,
        start_date: e.target.value,
      });
    }
  };

  const handleChangeTree = (e) => {
    setGarden({
      ...garden,
      tree_id: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (garden.tree_id === "0" || garden.garden_name === "" || garden.start_date === "") {
      alert("Vui lòng kiểm tra lại thông tin");
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
      <div className="modal-header">
        <h1>KHỞI TẠO</h1>
      </div>
      <div className="form">
        <div className="form-item">
          <div>
            <label htmlFor="garden-name">Tên vườn</label>
          </div>
          <input
            type="text"
            id="garden-name"
            name="garden_name"
            value={garden.garden_name || ""}
            onChange={handleInputText}
          />
        </div>
        <div className="form-item space-between">
          <div>
            <label htmlFor="start-date">Ngày gieo hạt</label>
          </div>
          <input
            type="date"
            id="start-date"
            onChange={handleChangeDate}
            value={garden.start_date || ""}
          />
        </div>
        <div className="form-item space-between">
          <div>
            <label htmlFor="tree_id">Cây trồng</label>
          </div>
          <select
            name="tree_id"
            id="tree_id"
            onChange={handleChangeTree}
            value={garden.tree_id}
          >
            {trees.map((tree, index) => (
              <option key={index} value={tree.id}>{tree.name}</option>
            ))}
          </select>
        </div>
        <div className="form-item">
          <div>
            <label htmlFor="garden-description">Mô tả</label>
          </div>
          <textarea
            type="text"
            id="garden-description"
            name="description"
            onChange={handleInputText}
            value={garden.description || ""}
            rows={2}
          >
          </textarea>
        </div>
      </div>
      <div className="modal-footer">
        <div className="form-submit-btn">
          <button onClick={handleSubmit}>Thiết lập</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
