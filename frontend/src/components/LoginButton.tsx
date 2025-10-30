import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    localStorage.setItem("redirectAfterAuth", location.pathname);
    navigate("/login");
  };

  return (
    <button className="home-button login" onClick={handleClick}>
      Iniciar Sesión
    </button>
  );
};

export default LoginButton;