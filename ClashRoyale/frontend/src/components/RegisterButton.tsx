import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button className="home-button register" onClick={() => navigate("/register")}>
      Registrarse
    </button>
  );
};

export default RegisterButton;
