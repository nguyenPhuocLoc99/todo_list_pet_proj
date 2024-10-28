import React from "react";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Alert from "../../components/Alert";
import { Link } from "react-router-dom";
import getAccessToken from "../../hooks/getAccessToken";
import Header from "../../components/Header";
import useAuth from "../../hooks/useAuth";

type Task = {
  id: number;
  createAt: string;
  updateAt: string;
  status: string;
  taskName: string;
  description: string | null;
  estimation: string | null;
  startTime: string | null;
  dueTime: string | null;
  groupId: number | null;
  assigneeId: number | null;
};

function TasksList() {
  // Tasks list state
  const [tasksList, setTasksList] = useState([]);
  const [isHovered, setIsHovered] = useState(-1);

  // Get state from TaskDetail for 'Task deleted' alert
  const location = useLocation();

  // Redirect on Add Task click
  const [toCreateTask, setToCreateTask] = useState(false);
  const [toDetails, setToDetails] = useState(false);
  const [toLogin, setToLogin] = useState(false);

  // useAuth to refresh on not authenticated
  const { isAuthenticated, isValidating } = useAuth();
  useEffect(() => {
    if (!isAuthenticated && !isValidating) setToLogin(true);
  }, [isAuthenticated, isValidating]);

  useEffect(() => {
    const fetchTasksList = async () => {
      const accessToken = getAccessToken();

      const response = await fetch("http://localhost:3333/tasks", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const content = await response.json();

      if (content.length) setTasksList(content);
    };

    fetchTasksList();
  });

  // handle log work
  const handleLogWork = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    console.log("Log work button clicked");
  };

  const showTask = (task: Task) => {
    return (
      <div
        className="list-group-item list-group-item-action d-flex gap-3 py-3"
        aria-current="true"
        onClick={() => setToDetails(true)}
        onMouseEnter={() => setIsHovered(task.id)}
        onMouseLeave={() => setIsHovered(-1)}
      >
        <div className="d-flex w-100 gap-2 justify-content-between">
          <div>
            <h6 className="mb-0">{task.taskName}</h6>
            <p className="mb-0 opacity-75">
              Description:{" "}
              {task.description ? task.description : "<No description>"}
            </p>
          </div>

          <div className="d-flex flex-column">
            {isHovered === task.id ? (
              <>
                <button
                  className="btn btn-primary me-2"
                  onClick={handleLogWork}
                >
                  Log work
                </button>
              </>
            ) : (
              <>
                <small className="opacity-50 text-nowrap">
                  Created: {new Date(task.createAt).toLocaleDateString()}
                </small>
                <small className="opacity-50 text-nowrap">
                  Updated: {new Date(task.updateAt).toLocaleDateString()}
                </small>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (toCreateTask) {
    return <Navigate to="/tasks/create" />;
  }

  if (toDetails) {
    return <Navigate to={`/tasks/${isHovered}`} />;
  }

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
      {location.state && (
        <Alert alertType={location.state.alertType}>
          {location.state.message}
        </Alert>
      )}

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="text-center mb-4">
            <h1>Tasks list</h1>
          </div>
        </div>

        <div className="row justify-content-center align-items-center">
          <div className="w-70">
            <div className="list-group">
              {tasksList.map((task, index) => (
                <React.Fragment key={index}>{showTask(task)}</React.Fragment>
              ))}
            </div>

            <div className="mt-2">
              <Link
                to="/tasks/create"
                className="btn btn-primary"
                onClick={() => setToCreateTask(true)}
              >
                Create Task
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TasksList;
