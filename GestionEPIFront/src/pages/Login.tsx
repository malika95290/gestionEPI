import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import "../styles/login.css";

export default function Login() {
  const [formData, setFormData] = useState({ nom: "", prenom: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5500/api/users/login", formData);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Échec de la connexion. Vérifiez vos identifiants.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Connexion</h2>

        {error && (
          <p className="login-error">
          <AiOutlineExclamationCircle size={20} color="red" style={{ marginRight: "8px" }} />
          {error}
      </p>
        )}

        <div className="form-group">
          <label>Nom</label>
          <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Prénom</label>
          <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <button type="submit" className="login-button">Se connecter</button>
      </form>
    </div>
  );
}
