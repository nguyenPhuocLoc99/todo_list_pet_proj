import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import User from "./pages/User";
import { GroupList, GroupDetail, GroupCreate } from "./pages/groups";
import { TasksList, TaskDetail, TaskCreate } from "./pages/tasks";
function App() {
  return (
    <>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
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
