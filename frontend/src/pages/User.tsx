import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Alert from "../components/Alert";
import Header from "../components/Header";
import UserForm from "../forms/UserForm";
import getAccessToken from "../hooks/getAccessToken";
import useAuth from "../hooks/useAuth";

const User = () => {
  // Input states
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState(NaN);

  // Doing state
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Error state
  const [error, setError] = useState("");

  // Toggle between Edit - Delete and Save - Cancel buttons
  const [isEditMode, setIsEditMode] = useState(false);

  // Redirect
  const [toLogin, setToLogin] = useState(false);

  // useAuth to refresh on not authenticated
  const { isAuthenticated, isValidating } = useAuth();
  useEffect(() => {
    if (!isAuthenticated && !isValidating) setToLogin(true);
  }, [isAuthenticated, isValidating]);

  // Get state from navigate for 'Login success' message
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);

    const fetchUser = async () => {
      const accessToken = getAccessToken();

      const response = await fetch("http://localhost:3333/users/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const content = await response.json();

      if (content) {
        setUser(content);
        setUserId(content.id);
      } else setToLogin(true);

      //   console.log(typeof user);
    };

    fetchUser();
    setIsLoading(false);
  }, []);

  // Handle edit
  const handleEdit = () => {
    setIsEditMode(true);
  };

  // Handel cancel
  const handleCancel = () => {
    setIsEditMode(false);
  };

  // Handle submit
  const handleSave = (updatedUserData: any) => {
    setIsSaving(true);
    const accessToken = getAccessToken();

    const updateUser = async () => {
      const response = await fetch(`http://localhost:3333/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedUserData),
      });
      const content = await response.json();

      if (response.ok) {
        setUser(content);
      } else setError("Failed to update user!");

      console.log(accessToken);
      console.log(`http://localhost:3333/users/${userId}`);
      console.log(content);
    };

    updateUser();
    setIsSaving(false);
    setIsEditMode(false);
  };

  if (isLoading)
    return <div className="h1 ms-3 mt-3">Loading your info...</div>;

  if (isSaving)
    return <div className="h1 ms-3 mt-3">Saving your new info...</div>;

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
      {error && <Alert alertType={3}>{error}</Alert>}
      <div className="container mt-3">
        <div className="row justify-content-center">
          <div className="col-8">
            <div className="d-flex align-item-center mb-3">
              <Link to="/" className="btn btn-outline-dark me-2">
                <i className="bi bi-arrow-left"></i>
              </Link>
              <h4 className="m-0">User Info</h4>
              <div className="ms-auto">
                {!isEditMode ? (
                  <button className="btn btn-primary" onClick={handleEdit}>
                    Edit
                  </button>
                ) : (
                  <button className="btn btn-danger" onClick={handleCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <UserForm
          initData={user}
          onSubmit={handleSave}
          isEditMode={isEditMode}
        />
      </div>
    </>
  );
};

export default User;
