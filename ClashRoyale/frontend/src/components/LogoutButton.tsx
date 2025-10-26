import React from "react";

interface Props {
  onLogout: () => void;
}

const LogoutButton: React.FC<Props> = ({ onLogout }) => {
  return (
    <button className="home-button logout" onClick={onLogout}>
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;
