import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const axios = require("axios");

const Login = () => {
  const navigation = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(()=>{
    if (localStorage.getItem("garden_id") != null) navigation("/dashboard");
  },[])
  
  const loginHandler = () => {
    if (username!= "" && password!=""){
      axios.post("http://localhost:5000/api/login",{
          "username": username,
          "password": password
      })
      .then(res => {
        localStorage.setItem("garden_id", res.data.user.garden_id);
        navigation("/dashboard");
      })
      .catch(error => alert(error.response.data.message + "\nPlease try again."))
    }
    else {
      alert("Vui lòng nhập đầy đủ");
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-header">Đăng nhập</div>
        <div className="login-body">
          <div className="login-body-form">
            <input type="text" placeholder="Tài khoản" value={username} onChange={(e)=> setUsername(e.target.value)}/>
            <input type="password" placeholder="Mật khẩu" value={password} onChange={(e)=> setPassword(e.target.value)} />
          </div>
        </div>
        <div className="login-body-footer">
          <button onClick={loginHandler}>Đăng nhập</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
