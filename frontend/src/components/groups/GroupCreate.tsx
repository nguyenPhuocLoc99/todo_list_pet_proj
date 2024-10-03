import { useState } from "react";
import { Navigate } from "react-router-dom";
import Alert from "../Alert";
import GroupForm from "./GroupForm";

function GroupCreate() {
  // Doing state
  const [isCreating, setIsCreating] = useState(false);

  // Redirect back to Groups List
  const [redirect, setRedirect] = useState("");

  // Error state
  const [error, setError] = useState("");

  // Handle submit
  const handleSubmit = async (groupData: any) => {
    setIsCreating(true);

    const token = sessionStorage.getItem("accessToken");
    const response = await fetch("http://localhost:3333/groups/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(groupData),
    });
    const content = await response.json();

    if (response.ok) {
      setRedirect(`Group "${groupData.groupName}" created`);
    } else setError(content.message);

    setIsCreating(false);
  };

  if (isCreating)
    return <div className="h1 ms-3 mt-3">Creating new group...</div>;

  if (redirect)
    return (
      <Navigate to="/groups" state={{ message: redirect, alertType: 2 }} />
    );

  return (
    <>
      {error && <Alert alertType={3}>{error}</Alert>}
      <div className="container mt-3">
        <h2>Create new group</h2>
        <GroupForm initData={{}} onSubmit={handleSubmit} isEditMode={true} />
      </div>
    </>
  );
}

export default GroupCreate;
