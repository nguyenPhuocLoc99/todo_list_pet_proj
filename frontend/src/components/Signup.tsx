import { SyntheticEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import Alert from "./Alert";

const Signup = () => {
  // Input states
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [others, setOthers] = useState("");

  // Error states
  const [loginNameError, setLoginNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Set visible alert & error message (if available)
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect
  const [redirect, setRedirect] = useState(false);

  // Submit func
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!loginName.trim()) setLoginNameError("Login name is required");
    else setLoginNameError("");

    if (!password.trim()) setPasswordError("Password is required");
    else setPasswordError("");

    if (!name.trim()) setNameError("Name is required");
    else setNameError("");

    const phonePattern = /^\d{9}$/;
    if (!phonePattern.test(phone) && !phone.trim())
      setPhoneError("Invalid phone number");
    else setPhoneError("");

    const emailPattern = /^[\w\d\.]+@[\w\d\.]+\w{2, 4}$/;
    if (!emailPattern.test(email) && !email.trim())
      setEmailError("Invalid email");
    else setEmailError("");

    const response = await fetch("http://localhost:3333/auth/signup", {
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
    const data = await response.json();

    if (data["accessToken"]) setRedirect(true);
    else setErrorMessage(data["message"]);
  };

  if (redirect)
    return (
      <>
        <Navigate
          to="/login"
          state={{ message: `Welcome ${name} to Todo list`, alertType: 2 }}
        />
      </>
    );

  return (
    <>
      {errorMessage && <Alert alertType={3}>{errorMessage}</Alert>}
      <form onSubmit={handleSubmit} className="form-signin m-auto">
        <h1 className="mb-3 fw-normal">Sign up</h1>

        <h1 className="h5 mb-3 fw-normal">Required fields:</h1>

        <div className="form-floating">
          <input
            type="login name"
            className="form-control top-field"
            id="floatingInput"
            placeholder="name@example.com"
            onChange={(e) => setLoginName(e.target.value)}
            required
          />
          <label htmlFor="floatingInput">Login name</label>
        </div>

        <div className="form-floating">
          <input
            type="password"
            className="form-control middle-field"
            id="floatingPassword"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <div className="form-floating">
          <input
            type="fullname"
            className="form-control bottom-field"
            id="floatingFullname"
            placeholder="Email"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="floatingFullname">Fullname</label>
        </div>

        <h1 className="h5 mb-3 fw-normal">Optional-fileds:</h1>

        <div className="form-floating">
          <input
            type="phone"
            className="form-control top-field"
            id="floatingPhone"
            placeholder="Phone number"
            onChange={(e) => setPhone(e.target.value)}
          />
          <label htmlFor="floatingPassword">Phone number</label>
        </div>

        <div className="form-floating">
          <input
            type="email"
            className="form-control middle-field"
            id="floatingEmail"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="floatingPassword">Email</label>
        </div>

        <div className="form-floating">
          <input
            type="others"
            className="form-control bottom-field"
            id="floatingOtherContacts"
            placeholder="LinkedIn, Facebook,..."
            onChange={(e) => setOthers(e.target.value)}
          />
          <label htmlFor="floatingOtherContacts">Other contacts</label>
        </div>

        {loginNameError && <div className="text-danger">{loginNameError}</div>}
        {passwordError && <div className="text-danger">{passwordError}</div>}
        {nameError && <div className="text-danger">{nameError}</div>}
        {phoneError && <div className="text-danger">{phoneError}</div>}
        {emailError && <div className="text-danger">{emailError}</div>}

        <button
          className="btn btn-primary w-100 py-2"
          type="submit"
          onClick={() => setErrorMessage("")}
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default Signup;
