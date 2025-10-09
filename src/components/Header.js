function Header({ title, subtitle }) {
  return (
    <div className="text-center my-5">
      <h1 className="display-4 text-success fw-bold">{title}</h1>
      <p className="lead">{subtitle}</p>
    </div>
  );
}

export default Header;
