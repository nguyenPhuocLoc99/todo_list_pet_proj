import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Alert from "../Alert";
import TaskForm from "./TaskForm";

function TaskDetail() {
  // Name state
  const [taskName, setTaskName] = useState("");

  // Initial task state
  const [task, setTask] = useState(null);

  // Doing state
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toggle between Edit - Delete and Save - Cancel buttons
  const [isEditMode, setIsEditMode] = useState(false);

  // Error state
  const [error, setError] = useState("");

  // Redirect to tasks list on delete or edit success
  const [redirect, setRedirect] = useState("");

  // get task id
  const { id } = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      const token = sessionStorage.getItem("accessToken");
      setIsLoading(true);

      const response = await fetch(`http://localhost:3333/tasks/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const content = await response.json();
      setTask(content);
      setTaskName(content.taskName);
    };

    fetchTask();
    setIsLoading(false);
  }, [id]);

  console.log(task);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleDelete = () => {
    const deleteTask = async () => {
      setIsDeleting(true);
      const confirmation = window.confirm(
        "Are you sure you want to delete this task?"
      );
      if (!confirmation) return;

      const token = sessionStorage.getItem("accessToken");

      const response = await fetch(`http://localhost:3333/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) setRedirect(`Task '${taskName}' deleted`);
      else setError(`Failed to delete task! status: ${response.status}`);
    };

    deleteTask();
    setIsDeleting(false);
  };

  const handleSave = (updatedTaskData: any) => {
    setIsSaving(true);
    const token = sessionStorage.getItem("accessToken");

    const updateTask = async () => {
      const response = await fetch(`http://localhost:3333/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTaskData),
      });

      if (response.ok) {
        const content = await response.json();
        setTask(content);
        setRedirect(`Task '${taskName}' updated`);
      } else setError(`Failed to update task! status: ${response.status}`);
    };

    updateTask();
    setIsSaving(false);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  if (isLoading)
    return <div className="h1 ms-3 mt-3">Loading task details...</div>;

  if (isSaving)
    return <div className="h1 ms-3 mt-3">Saving task '{taskName}'...</div>;

  if (isDeleting)
    return <div className="h1 ms-3 mt-3">Deleting task '{taskName}'...</div>;

  if (redirect)
    return <Navigate to="/tasks" state={{ message: redirect, alertType: 2 }} />;

  return (
    <>
      {error && <Alert alertType={3}>{error}</Alert>}
      <div className="container mt-3">
        {/*Header*/}
        <div className="row">
          <div className="col-12">
            <div className="d-flex jusyify-content-between align-item-center mb-3">
              <Link to="/tasks" className="btn btn-outline-dark me-2">
                <i className="bi bi-arrow-left"></i>
              </Link>
              <h4 className="m-0">Task Details</h4>
              <div className="ms-auto">
                {!isEditMode ? (
                  <>
                    <button
                      className="btn btn-primary me-2"
                      onClick={handleEdit}
                    >
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>
                      Delete
                    </button>
                  </>
                ) : (
                  <button className="btn btn-danger" onClick={handleCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/*Form*/}
        {task && (
          <TaskForm
            initData={task}
            onSubmit={handleSave}
            isEditMode={isEditMode}
          />
        )}
      </div>
    </>
  );
}

export default TaskDetail;
