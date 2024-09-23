const Home = () => {
  return (
    <div className="text-center my-5">
      <img
        className="d-block mx-auto"
        src="logo.png"
        alt="Logo"
        width="100"
        height="100"
      />
      <h1 className="display-5 fw-bold text-body-emphasis">
        Welcome to Todo list
      </h1>
      <div className="mx-auto">
        <p className="lead mb-4">
          This is home page. Further functions will be updated soon.
        </p>
      </div>
    </div>
  );
};

export default Home;
