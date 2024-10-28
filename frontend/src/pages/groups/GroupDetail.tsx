import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert";
import GroupForm from "../../forms/GroupForm";
import getAccessToken from "../../hooks/getAccessToken";
import Header from "../../components/Header";
import useAuth from "../../hooks/useAuth";

function GroupDetail() {
  // Name state
  const [groupName, setGroupName] = useState("");

  // Initial group state
  const [group, setGroup] = useState(null);

  // Doing state
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toggle between Edit - Delete and Save - Cancel buttons
  const [isEditMode, setIsEditMode] = useState(false);

  // Error state
  const [error, setError] = useState("");

  // Redirect
  const [toGroupsList, setToGroupsList] = useState("");
  const [toLogin, setToLogin] = useState(false);

  // get group id
  const { id } = useParams();

  // useAuth to refresh on not authenticated
  const { isAuthenticated, isValidating } = useAuth();
  useEffect(() => {
    if (!isAuthenticated && !isValidating) setToLogin(true);
  }, [isAuthenticated, isValidating]);

  useEffect(() => {
    const fetchGroup = async () => {
      const accessToken = getAccessToken();
      setIsLoading(true);

      const response = await fetch(`http://localhost:3333/groups/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const content = await response.json();
      setGroup(content);
      setGroupName(content.groupName);
    };

    fetchGroup();
    setIsLoading(false);
  }, [id]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleDelete = () => {
    const deleteGroup = async () => {
      setIsDeleting(true);
      const confirmation = window.confirm(
        "Are you sure you want to delete this group?"
      );
      if (!confirmation) return;

      const accessToken = getAccessToken();

      const response = await fetch(`http://localhost:3333/groups/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) setToGroupsList(`Group '${groupName}' deleted`);
      else setError(`Failed to delete group! status: ${response.status}`);
    };

    deleteGroup();
    setIsDeleting(false);
  };

  const handleSave = (updatedTaskData: any) => {
    setIsSaving(true);
    const accessToken = getAccessToken();

    const updateGroup = async () => {
      const response = await fetch(`http://localhost:3333/groups/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedTaskData),
      });
      const content = await response.json();

      if (response.ok) {
        setGroup(content);
        setToGroupsList(`Group '${groupName}' updated`);
      } else setError(`Failed to update group! status: ${response.status}`);
    };

    updateGroup();
    setIsSaving(false);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  if (isLoading)
    return <div className="h1 ms-3 mt-3">Loading group details...</div>;

  if (isSaving)
    return <div className="h1 ms-3 mt-3">Saving group '{groupName}'...</div>;

  if (isDeleting)
    return <div className="h1 ms-3 mt-3">Deleting group '{groupName}'...</div>;

  if (toGroupsList)
    return (
      <Navigate to="/groups" state={{ message: toGroupsList, alertType: 2 }} />
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
        {/*Header*/}
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-item-center mb-3">
              <Link to="/groups" className="btn btn-outline-dark me-2">
                <i className="bi bi-arrow-left"></i>
              </Link>
              <h4 className="m-0">Group Details</h4>
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

        {/* Form */}
        {group && (
          <GroupForm
            initData={group}
            isEditMode={isEditMode}
            onSubmit={handleSave}
          />
        )}
      </div>
    </>
  );
}

export default GroupDetail;
