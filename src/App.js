import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import CrudApi from "./components/CrudApi";
import Home from "./components/Home";
import About from "./components/About";

function App() {
  return (
    <Router>
      <>
        <h1>React App</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/crud">CRUD User</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/crud" element={<CrudApi />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;