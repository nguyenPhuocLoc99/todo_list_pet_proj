import { useEffect, useState } from "react";

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
                  placeholder="Full name"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  disabled={!isEditMode}
                  required
                />
                <div className="invalid-feedback">
                  Your fullname is required.
                </div>
              </div>
            </div>

            <div className="col-6">
              <label htmlFor="group" className="form-label">
                Group
              </label>
              <div className="input-group has-validation">
                <input
                  type="text"
                  className="form-control"
                  id="group"
                  placeholder="Group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  disabled={!isEditMode}
                  required
                />
                <div className="invalid-feedback">
                  Your username is required.
                </div>
              </div>
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
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="assignee" className="form-label">
                Assignee
              </label>
              <input
                type="text"
                className="form-control"
                id="assignee"
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                disabled={!isEditMode}
              />
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
