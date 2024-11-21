import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const RedirectToLogin: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  });

  return null;
};
