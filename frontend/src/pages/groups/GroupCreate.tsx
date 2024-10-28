import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Alert from "../../components/Alert";
import GroupForm from "../../forms/GroupForm";
import getAccessToken from "../../hooks/getAccessToken";
import Header from "../../components/Header";
import useAuth from "../../hooks/useAuth";

function GroupCreate() {
  // Doing state
  const [isCreating, setIsCreating] = useState(false);

  // Redirect
  const [toGroupsList, setToGroupsList] = useState("");
  const [toLogin, setToLogin] = useState(false);

  // Error state
  const [error, setError] = useState("");

  // useAuth to refresh on not authenticated
  const { isAuthenticated, isValidating } = useAuth();
  useEffect(() => {
    if (!isAuthenticated && !isValidating) setToLogin(true);
  }, [isAuthenticated, isValidating]);

  // Handle submit
  const handleSubmit = async (groupData: any) => {
    setIsCreating(true);

    const accessToken = getAccessToken();
    const response = await fetch("http://localhost:3333/groups/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(groupData),
    });
    const content = await response.json();

    if (response.ok) {
      setToGroupsList(`Group "${groupData.groupName}" created`);
    } else setError(content.message);

    setIsCreating(false);
  };

  if (isCreating)
    return <div className="h1 ms-3 mt-3">Creating new group...</div>;

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
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-item-center mb-3">
              <Link to="/groups" className="btn btn-outline-dark me-2">
                <i className="bi bi-arrow-left"></i>
              </Link>
              <h4>Create new group</h4>
            </div>
          </div>
        </div>

        <GroupForm initData={{}} onSubmit={handleSubmit} isEditMode={true} />
      </div>
    </>
  );
}

export default GroupCreate;
