import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Layout from "./pages/Layout";
import Home from "./pages/home/Home";
import History from "./pages/history/History";
import Statistic from "./pages/statistic/Statistic";
import Data from "./pages/data/Data";
import { RequireLogin } from "./utils/RequireLogin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="dashboard"
        element={
          <RequireLogin>
            <Layout />
          </RequireLogin>
        }
      >
        <Route index element={<Home />} />
        <Route path="data" element={<Data />} />
        <Route path="history" element={<History />} />
        <Route path="statistic" element={<Statistic />} />
      </Route>
    </Routes>
  );
}

export default App;