import { SyntheticEvent, useState } from "react";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");

  const [redirect, setRedirect] = useState(false);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3333/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        loginName,
        password,
      }),
    });
    const data = await response.json();


    if (data.accessToken) {
      sessionStorage.setItem("accessToken", data.accessToken);
      setRedirect(true);
    }
  };

  if (redirect) return <Navigate to="/user" />;

  return (
    <form onSubmit={submit}>
      <h1 className="mb-3 fw-normal">Log in</h1>

      <div className="form-floating">
        <input
          type="top field"
          className="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          onChange={(e) => setLoginName(e.target.value)}
          required
        />
        <label htmlFor="floatingInput">Login name</label>
      </div>

      <div className="form-floating">
        <input
          type="bottom field"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <button className="btn btn-primary w-100 py-2" type="submit">
        Log in
      </button>
    </form>
  );
};

export default Login;
