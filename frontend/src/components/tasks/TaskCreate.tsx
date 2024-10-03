import { useState } from "react";
import { Navigate } from "react-router-dom";
import Alert from "../Alert";
import TaskForm from "./TaskForm";

function TaskCreate() {
  // Doing state
  const [isCreating, setIsCreating] = useState(false);

  // Redirect back to Tasks List
  const [redirect, setRedirect] = useState("");

  // Error state
  const [error, setError] = useState("");

  const handleSubmit = async (taskData: any) => {
    setIsCreating(true);

    const token = sessionStorage.getItem("accessToken");
    const response = await fetch("http://localhost:3333/tasks/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
    const content = await response.json();

    if (response.ok) {
      setRedirect(`Task "${taskData.taskName}" created`);
    } else setError(content.message);

    setIsCreating(false);
  };

  if (isCreating)
    return <div className="h1 ms-3 mt-3">Creating new task...</div>;

  if (redirect)
    return <Navigate to="/tasks" state={{ message: redirect, alertType: 2 }} />;

  return (
    <>
      {error && <Alert alertType={3}>{error}</Alert>}
      <div className="container mt-3">
        <h2>Create new task</h2>
        <TaskForm initData={{}} onSubmit={handleSubmit} isEditMode={true} />
      </div>
    </>
  );
}

export default TaskCreate;
