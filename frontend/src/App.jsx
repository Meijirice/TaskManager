import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Boards from "./pages/Boards";
import BoardView from "./pages/BoardView";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/boards/:boardId" element={<BoardView />} />
      </Routes>
    </Router>
  );
}

export default App;
