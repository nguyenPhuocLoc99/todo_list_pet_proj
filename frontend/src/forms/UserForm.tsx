import { useEffect, useState } from "react";

type UserFormProps = {
  initData: any;
  onSubmit: (data: any) => void;
  isEditMode: boolean;
};

const UserForm = ({
  initData = {},
  onSubmit,
  isEditMode = false,
}: UserFormProps) => {
  // Inputs states
  const [loginName, setLoginName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otherContacts, setOtherContacts] = useState("");

  useEffect(() => {
    setLoginName(initData.loginName || "");
    setName(initData.name || "");
    setEmail(initData.email || "");
    setPhone(initData.phone || "");
    setOtherContacts(initData.otherContacts || "");
  }, [initData]);

  // Handle submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ loginName, name, email, phone, otherContacts });
  };
  return (
    <div className="row justify-content-center">
      <div className="col-8">
        <form className="needs-validation" noValidate onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-6">
              <label htmlFor="loginName" className="form-label">
                Login name
              </label>
              <div className="input-group has-validation">
                <input
                  type="text"
                  className="form-control"
                  id="loginName"
                  placeholder="Login name"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  disabled={!isEditMode}
                  required
                />
                <div className="invalid-feedback">Login name is required.</div>
              </div>
            </div>

            <div className="col-6">
              <label htmlFor="fullname" className="form-label">
                Fullname
              </label>
              <div className="input-group has-validation">
                <input
                  type="text"
                  className="form-control"
                  id="fullname"
                  placeholder="Fullname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditMode}
                  required
                />
                <div className="invalid-feedback">Fullname is required.</div>
              </div>
            </div>

            <div className="col-6">
              <label htmlFor="phone" className="form-label">
                Phone number
              </label>
              <div className="input-group has-validation">
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
            </div>

            <div className="col-6">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="input-group has-validation">
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
            </div>

            <div className="col-12">
              <label htmlFor="otherContacts" className="form-label">
                Other contacts
              </label>
              <div className="input-group has-validation">
                <input
                  type="text"
                  className="form-control"
                  id="otherContacts"
                  placeholder="LinkedIn, Facebook,..."
                  value={otherContacts}
                  onChange={(e) => setOtherContacts(e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-3"
            hidden={!isEditMode}
          >
            Save
          </button>
          {/*End form*/}
        </form>
      </div>
    </div>
  );
};

export default UserForm;
