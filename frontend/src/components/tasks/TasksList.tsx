import React from "react";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Alert from "../Alert";
import { Link } from "react-router-dom";

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

  // Get state from TaskDetail for 'Task deleted' alert
  const location = useLocation();

  // Redirect on Add Task click
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchTasksList = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

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

  const showTask = (task: Task) => {
    return (
      <>
        <a
          href={`/tasks/${task.id}`}
          className="list-group-item list-group-item-action d-flex gap-3 py-3"
          aria-current="true"
        >
          <div className="d-flex w-100 gap-2 justify-content-between">
            <div>
              <h6 className="mb-0">{task.taskName}</h6>
              <p className="mb-0 opacity-75">
                Description:{" "}
                {task.description ? task.description : "<No description>"}
              </p>
            </div>
            <small className="opacity-50 text-nowrap">
              Created: {new Date(task.createAt).toLocaleDateString()}
            </small>
          </div>
        </a>
      </>
    );
  };

  if (redirect) {
    return <Navigate to="/tasks/create" />;
  }

  return (
    <>
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
                onClick={() => setRedirect(true)}
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
