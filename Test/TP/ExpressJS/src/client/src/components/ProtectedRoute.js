import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { reposteriaContext } from "../context/reposteriaContext.js";

const ProtectedRoute = ({ allowedRoles }) => {
  const [auth] = useContext(reposteriaContext);
  const [isLoading, setIsLoading] = useState(true);

  const {auth: authBool, user: {role}} = auth;

  useEffect(() => {
    if (authBool !== undefined) {
      setIsLoading(false);
    }
  }, [auth]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!authBool) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    //TODO: no recuerdo a donde querias redireccionar en este caso 
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;