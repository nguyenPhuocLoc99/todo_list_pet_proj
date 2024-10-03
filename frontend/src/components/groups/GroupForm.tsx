import React, { useEffect, useState } from "react";

type GroupFormProps = {
  initData: any;
  onSubmit: (data: any) => void;
  isEditMode: boolean;
};

function GroupForm({
  initData = {},
  onSubmit,
  isEditMode = false,
}: GroupFormProps) {
  // Input state
  const [groupName, setGroupName] = useState(initData.groupName || "");
  const [description, setDescription] = useState(initData.description || "");
  const [taskNames, setTaskNames] = useState(initData.taskNames || "");

  useEffect(() => {
    setGroupName(initData.groupName || "");
    setDescription(initData.description || "");

    if (initData.tasks) {
      const taskNames = initData.tasks
        .map((task: any) => task.taskName)
        .join(", ");
      setTaskNames(taskNames);
    }
  }, [initData]);

  // Handel submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      groupName,
      description,
      taskNames,
    });
  };

  return (
    <div className="row">
      <div className="col-12">
        <form className="needs-validation" noValidate onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-6">
              <label htmlFor="groupName" className="form-label">
                Group name
              </label>
              <div className="input-group has-validation">
                <input
                  type="text"
                  className="form-control"
                  id="groupName"
                  placeholder="Group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  disabled={!isEditMode}
                  required
                />
                <div className="invalid-feedback">Group name is required.</div>
              </div>
            </div>

            <div className="col-6">
              <label htmlFor="tasksId" className="form-label">
                Task names
              </label>
              <div className="input-group has-validation">
                <input
                  type="text"
                  className="form-control"
                  id="tasksId"
                  value={taskNames}
                  placeholder="e.g. Task1, Task2, Task3"
                  onChange={(e) => setTaskNames(e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
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
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default GroupForm;
