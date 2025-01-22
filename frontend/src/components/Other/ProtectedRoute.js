import React from "react";
import { Navigate } from "react-router-dom";
import { defaultBuildStages } from "three/webgpu";

const ProtectedRoute = ({ isAdmin, children }) => {
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
};
export default ProtectedRoute;
