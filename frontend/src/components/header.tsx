function Header() {
  return (
    <h1 className="navbar-brand">
      <a className="navbar-brand" href="">
        <img src="logo_small.png" alt="Logo" width={100} height={100} />
      </a>
      <a
        href=""
        style={{
          textDecoration: "none",
          color: "inherit",
          fontSize: 30,
        }}
      >
        Logo name
      </a>
    </h1>
  );
}

export default Header;
