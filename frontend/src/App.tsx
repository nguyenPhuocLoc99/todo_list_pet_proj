import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Login from "./components/Login";
import Home from "./components/Home";
import Signup from "./components/Signup";
import User from "./components/User";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
        </Routes>
        <main className="form-signin w-100 m-auto">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
