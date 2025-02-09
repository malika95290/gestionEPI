import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { EPI, EPIType } from 'gestepiinterfaces';

interface EPIFormProps {
  onSubmitSuccess: () => void;
  initialData?: EPI;
  isEditing?: boolean;
}

const EPIForm: React.FC<EPIFormProps> = ({ onSubmitSuccess, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState<Partial<EPI>>({
    interneId: "",
    type: EPIType.CORDE,
    marque: "",
    modele: "",
    taille: "",
    couleur: "",
    numeroSerie: "",
    dateAchat: new Date(),
    dateFabrication: new Date(),
    dateMiseEnService: new Date(),
    frequenceControle: 0,
    isTextile: true
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      const formattedData = {
        ...initialData,
        dateAchat: new Date(initialData.dateAchat),
        dateFabrication: new Date(initialData.dateFabrication),
        dateMiseEnService: new Date(initialData.dateMiseEnService),
        // Convertir isTextile en booléen si nécessaire
        isTextile: Boolean(initialData.isTextile)
      };
      setFormData(formattedData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("date") ? new Date(value) : 
              name === "type" ? value as EPIType :
              name === "frequenceControle" ? parseInt(value, 10) :
              name === "isTextile" ? value === "true" :
              value
    }));
  };

  const formatDateForAPI = (date: Date | undefined): string => {
    if (!date) return new Date().toISOString().split('T')[0];
    return new Date(date).toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.interneId || !formData.type || !formData.numeroSerie) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      // Déterminer isTextile basé sur le type d'EPI
      const isTextile = [EPIType.CORDE, EPIType.SANGLE, EPIType.LONGE, EPIType.BAUDRIER].includes(formData.type as EPIType);

      const formDataToSend = {
        ...formData,
        dateAchat: formatDateForAPI(formData.dateAchat),
        dateFabrication: formatDateForAPI(formData.dateFabrication),
        dateMiseEnService: formatDateForAPI(formData.dateMiseEnService),
        isTextile: Number(isTextile), // Convertir en 1 ou 0 pour la base de données
        frequenceControle: Number(formData.frequenceControle)
      };

      if (!isEditing) {
        delete formDataToSend.id;
      }

      if (isEditing && initialData?.id) {
        await apiService.put(`/epis/`, formDataToSend);
      } else {
        await apiService.post("/epis", formDataToSend);
      }
      onSubmitSuccess();
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      setError(`Erreur lors de ${isEditing ? 'la modification' : "l'ajout"} de l'EPI. Vérifier la saisie des champs`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="epi-form">
      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label>ID Interne: *</label>
        <input 
          type="text" 
          name="interneId" 
          value={formData.interneId || ''} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Type d'EPI: *</label>
        <select 
          name="type" 
          value={formData.type || EPIType.CORDE} 
          onChange={handleChange} 
          required
        >
          {Object.values(EPIType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* ... Autres champs du formulaire ... */}
      <div className="form-group">
        <label>Numéro de Série: *</label>
        <input 
          type="text" 
          name="numeroSerie" 
          value={formData.numeroSerie || ''} 
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
        <label>Fréquence de Contrôle (mois): *</label>
        <input 
          type="number" 
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
          value={formData.marque || ''} 
          onChange={handleChange} 
        />
      </div>

      <div className="form-group">
        <label>Modèle:</label>
        <input 
          type="text" 
          name="modele" 
          value={formData.modele || ''} 
          onChange={handleChange} 
        />
      </div>

      <div className="form-group">
        <label>Taille:</label>
        <input 
          type="text" 
          name="taille" 
          value={formData.taille || ''} 
          onChange={handleChange} 
        />
      </div>

      <div className="form-group">
        <label>Couleur:</label>
        <input 
          type="text" 
          name="couleur" 
          value={formData.couleur || ''} 
          onChange={handleChange} 
        />
      </div>

      <button type="submit" className="submit-button">
        {isEditing ? 'Modifier' : 'Ajouter'} EPI
      </button>
    </form>
  );
};

export default EPIForm;