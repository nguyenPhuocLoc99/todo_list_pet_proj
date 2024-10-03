import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Alert from "../Alert";
import React from "react";

type Group = {
  id: number;
  createAt: string;
  updateAt: string;

  groupName: string;
  description: string | null;

  tasksId: number[] | [];
  accessControlId: number | null;
};

function GroupList() {
  // Groups list state
  const [groupsList, setGroupsList] = useState([]);

  // Get state from GroupDetail for 'Group deleted' alert
  const location = useLocation();

  // Redirect on Add Group click
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchGroupsList = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      const response = await fetch("http://localhost:3333/groups", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const content = await response.json();

      if (content.length) setGroupsList(content);
    };

    fetchGroupsList();
  });

  const showGroup = (group: Group) => {
    return (
      <>
        <a
          href={`/groups/${group.id}`}
          className="list-group-item list-group-item-action d-flex gap-3 py-3"
        >
          <div className="d-flex w-100 gap-2 justify-content-between">
            <div>
              <h6 className="mb-0">{group.groupName}</h6>
              <p className="mb-0 opacity-75">
                Description:{" "}
                {group.description ? group.description : "<No description>"}
              </p>
            </div>
            <small className="opacity-50 text-nowrap">
              Created: {new Date(group.createAt).toLocaleDateString()}
            </small>
          </div>
        </a>
      </>
    );
  };

  if (redirect) {
    return <Navigate to="/groups/create" />;
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
            <h1>Groups list</h1>
          </div>
        </div>
      </div>

      <div className="row justify-content-center align-items-center">
        <div className="w-70">
          <div className="list-group">
            {groupsList.map((group, index) => (
              <React.Fragment key={index}>{showGroup(group)}</React.Fragment>
            ))}
          </div>

          <div className="mt-2">
            <Link
              to="/groups/create"
              className="btn btn-primary"
              onClick={() => setRedirect(true)}
            >
              Create Group
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default GroupList;
