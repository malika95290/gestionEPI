// AddEPIForm.tsx
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { EPI, EpiType, CheckStatus } from '../../../../GestEPIInterfaces';

interface AddEPIFormProps {
  onEpiAdded: () => void;
}

const AddEPIForm: React.FC<AddEPIFormProps> = ({ onEpiAdded }) => {
  const [formData, setFormData] = useState<Partial<EPI>>({
    idInterne: 0,
    idTypes: 0,
    marque: "",
    model: "",
    taille: "",
    couleur: "",
    numeroDeSerie: 0,
    dateAchat: new Date(),
    dateFabrication: new Date(),
    dateMiseEnService: new Date(),
    frequenceControle: "",
  });

  const [types, setTypes] = useState<EpiType[]>([]);
  const [checkStatuses, setCheckStatuses] = useState<CheckStatus[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypesAndChecks = async () => {
      try {
        const epiTypesData = await apiService.get("/epi-types");
        // const checkStatusesData = await apiService.get("/checkStatuses");
        setTypes(epiTypesData);
        // setCheckStatuses(checkStatusesData);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      }
    };

    fetchTypesAndChecks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("date") ? new Date(value) : 
              name === "idCheck" && value === "0" ? undefined : 
              (name === "idInterne" || name === "idTypes" || name === "numeroDeSerie") ? Number(value) : 
              value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification des champs obligatoires
    if (!formData.idInterne || !formData.idTypes || !formData.numeroDeSerie) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const formDataToSend = {
      ...formData,
      dateAchat: formData.dateAchat?.toISOString().split("T")[0],
      dateFabrication: formData.dateFabrication?.toISOString().split("T")[0],
      dateMiseEnService: formData.dateMiseEnService?.toISOString().split("T")[0],
    };

    try {
      await apiService.post("/epis", formDataToSend);
      alert("EPI ajouté avec succès !");
      onEpiAdded();
    } catch (err) {
      setError("Erreur lors de l'ajout de l'EPI");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-epi-form">
      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label>ID Interne: *</label>
        <input 
          type="number" 
          name="idInterne" 
          value={formData.idInterne || ''} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Type d'EPI: *</label>
        <select 
          name="idTypes" 
          value={formData.idTypes || 0} 
          onChange={handleChange} 
          required
        >
          <option value={0}>Sélectionner un type</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.nom}
            </option>
          ))}
        </select>
      </div>

      {/* <div className="form-group">
        <label>Statut de Vérification:</label>
        <select 
          name="idCheck" 
          value={formData.idCheck || 0} 
          onChange={handleChange}
        >
          <option value={0}>Sélectionner un statut</option>
          {checkStatuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.status}
            </option>
          ))}
        </select>
      </div> */}

      <div className="form-group">
        <label>Numéro de Série: *</label>
        <input 
          type="number" 
          name="numeroDeSerie" 
          value={formData.numeroDeSerie || ''} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Date d'Achat: *</label>
        <input 
          type="date" 
          name="dateAchat" 
          value={formData.dateAchat?.toISOString().split("T")[0]} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Date de Fabrication: *</label>
        <input 
          type="date" 
          name="dateFabrication" 
          value={formData.dateFabrication?.toISOString().split("T")[0]} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Date de Mise en Service: *</label>
        <input 
          type="date" 
          name="dateMiseEnService" 
          value={formData.dateMiseEnService?.toISOString().split("T")[0]} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Fréquence de Contrôle: *</label>
        <input 
          type="text" 
          name="frequenceControle" 
          value={formData.frequenceControle} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Marque:</label>
        <input 
          type="text" 
          name="marque" 
          value={formData.marque} 
          onChange={handleChange} 
        />
      </div>

      <div className="form-group">
        <label>Modèle:</label>
        <input 
          type="text" 
          name="model" 
          value={formData.model} 
          onChange={handleChange} 
        />
      </div>

      <div className="form-group">
        <label>Taille:</label>
        <select 
            name="taille" 
            value={formData.taille || ''} 
            onChange={handleChange} 
            required
        >
            <option value="">Sélectionner une taille</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
        </select>
        </div>

      <div className="form-group">
        <label>Couleur:</label>
        <input 
          type="text" 
          name="couleur" 
          value={formData.couleur} 
          onChange={handleChange} 
        />
      </div>

      <button type="submit" className="submit-button">Ajouter EPI</button>
    </form>
  );
};

export default AddEPIForm;