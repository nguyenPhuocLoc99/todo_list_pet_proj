import { useEffect, useState } from "react";
import getAccessToken from "../hooks/getAccessToken";

type TaskFormProps = {
  initData: any;
  onSubmit: (data: any) => void;
  isEditMode: boolean;
};

function TaskForm({
  initData = {},
  onSubmit,
  isEditMode = false,
}: TaskFormProps) {
  // Input state
  const [taskName, setTaskName] = useState(initData.taskName || "");
  const [status, setStatus] = useState(initData.status || "toDo");
  const [description, setDescription] = useState(initData.description || "");
  const [estimation, setEstimation] = useState(initData.estimation || "");
  const [assigneeName, setAssigneeName] = useState(initData.assigneeName || "");
  const [assigneeId, setAssigneeId] = useState<number>(
    initData.assigneeId || -1
  );
  const [groupName, setGroupName] = useState(initData.groupName || "");
  const [groupId, setGroupId] = useState<number>(initData.groupId || -1);
  const [startTime, setStartTime] = useState(initData.startTime || "");
  const [dueTime, setDueTime] = useState(initData.dueTime || "");

  // Suggestions
  const [showAssigneeHints, setShowAssigneeHints] = useState(false);
  const [assigneeHintsList, setAssigneeHintsList] = useState<string[]>([]);
  const [showGroupHints, setShowGroupHints] = useState(false);
  const [groupHintsList, setGroupHintsList] = useState<string[]>([]);

  // Init useEffect
  useEffect(() => {
    setTaskName(initData.taskName || "");
    setStatus(initData.status || "toDo");
    setDescription(initData.description || "");
    if (initData.estimation) {
      const date = new Date(initData.estimation);
      const hours = date.getUTCHours().toString().padStart(2, "0");
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      const formattedTime = `${hours}:${minutes}`;

      setEstimation(formattedTime);
    } else setEstimation("");

    if (initData.assignee) {
      setAssigneeName(initData.assignee?.name || "");
      setAssigneeId(initData.assignee?.id || -1);
    }
    if (initData.group) {
      setGroupName(initData.group?.groupName || "");
      setGroupId(initData.group?.id || -1);
    }
    if (initData.startTime) setStartTime(formatDatetime(initData.startTime));
    else setStartTime("");
    if (initData.dueTime) setDueTime(formatDatetime(initData.dueTime));
    else setDueTime("");
  }, [initData]);

  // Assignee suggestion / hint function
  useEffect(() => {
    const fetchHints = async (query: string) => {
      const accessToken = getAccessToken();
      const response = await fetch(`http://localhost:3333/users/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ query }),
      });
      const content = await response.json();

      if (response.ok) setAssigneeHintsList(content);
      else setAssigneeHintsList([]);
    };

    // Turn hints off if assigneeName is empty
    if (!assigneeName || !assigneeHintsList.length) {
      setShowAssigneeHints(false);
      return;
    }

    // Fetch hints and show suggestions
    fetchHints(assigneeName);
    setShowAssigneeHints(true);

    // Turn hints off if hints list has 1 (or less) option
    // and it's already in the input field
    if (
      assigneeHintsList.includes(assigneeName) &&
      assigneeHintsList.length < 2
    ) {
      setShowAssigneeHints(false);
    }
  }, [assigneeName, assigneeHintsList]);

  // Group suggestion / hint function
  useEffect(() => {
    const fetchHints = async (query: string) => {
      const accessToken = getAccessToken();
      const response = await fetch(`http://localhost:3333/groups/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ query }),
      });
      const content = await response.json();

      if (response.ok) setGroupHintsList(content);
      else setGroupHintsList([]);
    };

    // Turn hints off if groupName is empty
    if (!groupName || !groupHintsList.length) {
      setShowGroupHints(false);
      return;
    }

    // Fetch hints and show suggestions
    fetchHints(groupName);
    setShowGroupHints(true);

    // Turn hints off if hints list has 1 (or less) option
    // and it's already in the input field
    if (groupHintsList.includes(groupName) && groupHintsList.length < 2) {
      setShowGroupHints(false);
    }
  }, [groupName, groupHintsList]);

  // Format datetime
  const formatDatetime = (time: string) => {
    const date = new Date(time);
    return date.toISOString().slice(0, 16);
  };

  // Handel submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      taskName,
      status,
      description,
      estimation,
      assigneeName,
      assigneeId,
      groupName,
      groupId,
      startTime,
      dueTime,
    });
  };

  return (
    <div className="row">
      <div className="col-12">
        <form className="needs-validation" noValidate onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-6">
              <label htmlFor="taskName" className="form-label">
                Task name
              </label>
              <div className="input-group has-validation">
                <input
                  type="text"
                  className="form-control"
                  id="taskName"
                  placeholder="Task name"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  disabled={!isEditMode}
                  autoComplete="off"
                  required
                />
                <div className="invalid-feedback">Task name is required.</div>
              </div>
            </div>

            <div className="col-6 position-relative">
              <label htmlFor="group" className="form-label">
                Group
              </label>
              <div className="input-group has-validation">
                <input
                  type="text"
                  className="form-control"
                  id="group"
                  placeholder="Input a group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  disabled={!isEditMode}
                  autoComplete="off"
                  required
                />
              </div>
              {showGroupHints && (
                <ul
                  className="dropdown-menu suggestion-ul d-grid gap-1 p-2 rounded-3 mx-0 shadow w-220px"
                  data-bs-theme="light"
                >
                  {groupHintsList.map((hint, index) => (
                    <li
                      className="dropdown-item round-2"
                      key={index}
                      onClick={() => setGroupName(hint)}
                    >
                      {hint}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="col-md-4">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                className="form-select"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={!isEditMode}
                required
              >
                <option value="toDo" onClick={() => setStatus("toDo")}>
                  To do
                </option>
                <option
                  value="inProgress"
                  onClick={() => setStatus("inProgress")}
                >
                  In progress
                </option>
                <option value="review" onClick={() => setStatus("review")}>
                  Review
                </option>
                <option value="done" onClick={() => setStatus("done")}>
                  Done
                </option>
                <option
                  value="cancelled"
                  onClick={() => setStatus("cancelled")}
                >
                  Cancelled
                </option>
              </select>
              <div className="invalid-feedback">Status is required.</div>
            </div>

            <div className="col-md-4">
              <label htmlFor="estimate" className="form-label">
                Estimate
              </label>
              <input
                type="time"
                className="form-control"
                id="estimate"
                value={estimation}
                onChange={(e) => setEstimation(e.target.value)}
                disabled={!isEditMode}
                autoComplete="off"
              />
            </div>

            <div className="col-md-4 position-relative">
              <label htmlFor="assignee" className="form-label">
                Assignee
              </label>
              <input
                type="text"
                className="form-control"
                id="assignee"
                placeholder="Input a assignee name"
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                disabled={!isEditMode}
                autoComplete="off"
              />
              {showAssigneeHints && (
                <ul
                  className="dropdown-menu suggestion-ul d-grid gap-1 p-2 rounded-3 mx-0 shadow w-220px"
                  data-bs-theme="light"
                >
                  {assigneeHintsList.map((hint, index) => (
                    <li
                      className="dropdown-item round-2"
                      key={index}
                      onClick={() => setAssigneeName(hint)}
                    >
                      {hint}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="startTime" className="form-label">
                Start Time
              </label>
              <input
                type="datetime-local"
                className="form-control"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                onFocus={(e) => setStartTime(e.target.value)}
                disabled={!isEditMode}
                autoComplete="off"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="dueTime" className="form-label">
                Due Time
              </label>
              <input
                type="datetime-local"
                className="form-control"
                id="dueTime"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                onFocus={(e) => setDueTime(e.target.value)}
                disabled={!isEditMode}
                autoComplete="off"
              />
            </div>

            <div className="col-12">
              <label htmlFor="description" className="form-label">
                Description{" "}
                <span className="text-body-secondary">(Optional)</span>
              </label>
              <textarea
                className="form-control"
                rows={5}
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!isEditMode}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-3"
            hidden={!isEditMode}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
