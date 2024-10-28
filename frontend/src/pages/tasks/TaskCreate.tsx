import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Alert from "../../components/Alert";
import TaskForm from "../../forms/TaskForm";
import getAccessToken from "../../hooks/getAccessToken";
import Header from "../../components/Header";
import useAuth from "../../hooks/useAuth";

function TaskCreate() {
  // Doing state
  const [isCreating, setIsCreating] = useState(false);

  // Redirect
  const [toTasksList, setToTasksList] = useState("");
  const [toLogin, setToLogin] = useState(false);

  // Error state
  const [error, setError] = useState("");

  // useAuth to refresh on not authenticated
  const { isAuthenticated, isValidating } = useAuth();
  useEffect(() => {
    if (!isAuthenticated && !isValidating) setToLogin(true);
  }, [isAuthenticated, isValidating]);

  const handleSubmit = async (taskData: any) => {
    setIsCreating(true);

    const accessToken = getAccessToken();
    const response = await fetch("http://localhost:3333/tasks/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(taskData),
    });
    const content = await response.json();

    if (response.ok) {
      setToTasksList(`Task "${taskData.taskName}" created`);
    } else setError(content.message);

    setIsCreating(false);
  };

  if (isCreating)
    return <div className="h1 ms-3 mt-3">Creating new task...</div>;

  if (toTasksList)
    return (
      <Navigate to="/tasks" state={{ message: toTasksList, alertType: 2 }} />
    );

  if (toLogin)
    return (
      <Navigate
        to="/login"
        state={{ message: "Token expired", alertType: 3 }}
      />
    );

  return (
    <>
      <Header />
      {error && <Alert alertType={3}>{error}</Alert>}
      <div className="container mt-3">
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-item-center mb-3">
              <Link to="/tasks" className="btn btn-outline-dark me-2">
                <i className="bi bi-arrow-left"></i>
              </Link>
              <h4>Create new task</h4>
            </div>
          </div>
        </div>

        <TaskForm initData={{}} onSubmit={handleSubmit} isEditMode={true} />
      </div>
    </>
  );
}

export default TaskCreate;
