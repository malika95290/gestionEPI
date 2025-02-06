import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprime le token
    navigate("/"); // Redirige vers la page de connexion
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl">Bienvenue sur votre tableau de bord !</h1>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>  
  );
}
