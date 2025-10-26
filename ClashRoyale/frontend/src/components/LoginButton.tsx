import React from "react";
import { useNavigate } from "react-router-dom";

const LoginButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button className="home-button login" onClick={() => navigate("/login")}>
      Iniciar Sesión
    </button>
  );
};

export default LoginButton;
