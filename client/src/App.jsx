import "./App.css";
import Homepage from "./components/Homepage";
import Data from "./components/Data";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/data/:garden_id" element={<Data />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
