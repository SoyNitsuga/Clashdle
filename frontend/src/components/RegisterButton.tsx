import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const RegisterButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    localStorage.setItem("redirectAfterAuth", location.pathname);
    navigate("/register");
  };

  return (
    <button className="home-button register" onClick={handleClick}>
      Registrarse
    </button>
  );
};

export default RegisterButton;