import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token || userRole !== "admin") {
      navigate("/login"); // Redirection si pas admin
    } else {
      setRole(userRole);
    }
  }, [navigate]);

  return <div>{role === "admin" ? <h1>Dashboard Admin</h1> : <p>Accès refusé</p>}</div>;
}
