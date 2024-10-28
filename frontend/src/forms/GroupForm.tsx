import React, { useEffect, useState } from "react";
import TextWithTag from "../components/TextWithTag";
import getAccessToken from "../hooks/getAccessToken";

type GroupFormProps = {
  initData: any;
  onSubmit: (data: any) => void;
  isEditMode: boolean;
};

// tasks to taskNames
const task2taskNames = (tasks: any) => {
  if (tasks) return tasks.map((t: any) => t.taskName);
  else return [];
};

function GroupForm({
  initData = {},
  onSubmit,
  isEditMode = false,
}: GroupFormProps) {
  // Input state
  const [groupName, setGroupName] = useState(initData.groupName || "");
  const [description, setDescription] = useState(initData.description || "");
  const [taskNames, setTaskNames] = useState<string[]>(
    task2taskNames(initData.tasks)
  );

  useEffect(() => {
    setGroupName(initData.groupName || "");
    setDescription(initData.description || "");

    // Update taskNames based on initData.tasks
    setTaskNames(task2taskNames(initData.tasks));
  }, [initData]);

  // Handle submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      groupName,
      description,
      taskNames,
    });
  };

  const handleSuggest = (query: string) => {
    if (!query) return [];
    const accessToken = getAccessToken();

    const getSuggestions = async (query: string) => {
      const response = await fetch(`http://localhost:3333/tasks/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ query }),
      });
      const content = await response.json();

      if (response.ok) return content;
      else return [];
    };

    return getSuggestions(query);
  };

  return (
    <div className="row">
      <div className="col-12">
        <form
          className="needs-validation"
          id="groupForm"
          noValidate
          onSubmit={handleSubmit}
        >
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
                <TextWithTag
                  id="taskId"
                  inputClass="form-control"
                  initData={{ itemsList: taskNames }}
                  placeHolder="Input a task name"
                  suggestionFunc={handleSuggest}
                  isEditMode={isEditMode}
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
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default GroupForm;
