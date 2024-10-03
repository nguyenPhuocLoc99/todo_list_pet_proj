import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Login from "./components/Login";
import Home from "./components/Home";
import Signup from "./components/Signup";
import User from "./components/User";
import { GroupList, GroupDetail, GroupCreate } from "./components/groups";
import { TasksList, TaskDetail, TaskCreate } from "./components/tasks";
function App() {
  return (
    <>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/user" element={<User />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/tasks" element={<TasksList />} />
              <Route path="/tasks/:id" element={<TaskDetail />} />
              <Route path="/tasks/create" element={<TaskCreate />} />
              <Route path="/groups" element={<GroupList />} />
              <Route path="/groups/:id" element={<GroupDetail />} />
              <Route path="/groups/create" element={<GroupCreate />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
