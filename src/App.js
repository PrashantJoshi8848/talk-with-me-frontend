import Home from "./components/Homepage/Home";
import { Routes, Route } from "react-router-dom";
import Chatpage from "./components/chatPage/Chatpage";
import "./app.css";
function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chatpage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
