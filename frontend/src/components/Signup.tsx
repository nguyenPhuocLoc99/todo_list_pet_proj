import { SyntheticEvent, useState } from "react";
import { Navigate } from "react-router-dom";

const Signup = () => {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [others, setOthers] = useState("");

  const [redirect, setRedirect] = useState(false);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    await fetch("http://localhost:3333/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginName,
        password,
        name,
        phone,
        email,
        others,
      }),
    });

    setRedirect(true);
  };

  if (redirect) return <Navigate to="/login" />;

  return (
    <form onSubmit={submit}>
      <h1 className="mb-3 fw-normal">Sign up</h1>

      <h1 className="h5 mb-3 fw-normal">Required fields:</h1>

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
          type="middle field"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <div className="form-floating">
        <input
          type="bottom field"
          className="form-control"
          id="floatingFullname"
          placeholder="Email"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="floatingFullname">Fullname</label>
      </div>

      <h1 className="h5 mb-3 fw-normal">Optional fields:</h1>

      <div className="form-floating">
        <input
          type="top field"
          className="form-control"
          id="floatingPhone"
          placeholder="Phone number"
          onChange={(e) => setPhone(e.target.value)}
        />
        <label htmlFor="floatingPassword">Phone number</label>
      </div>

      <div className="form-floating">
        <input
          type="middle field"
          className="form-control"
          id="floatingEmail"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="floatingPassword">Email</label>
      </div>

      <div className="form-floating">
        <input
          type="bottom field"
          className="form-control"
          id="floatingOtherContacts"
          placeholder="LinkedIn, Facebook,..."
          onChange={(e) => setOthers(e.target.value)}
        />
        <label htmlFor="floatingOtherContacts">Other contacts</label>
      </div>

      <button className="btn btn-primary w-100 py-2" type="submit">
        Submit
      </button>
    </form>
  );
};

export default Signup;
