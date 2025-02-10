import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { EPIStatus, EPI } from 'gestepiinterfaces'; // Adjust the import path as needed
import '../../styles/AddControleForm.css';

interface AddControleFormProps {
  onControleAdded: () => void; // Callback to refresh the list after adding
}

export const AddControleForm: React.FC<AddControleFormProps> = ({ onControleAdded }) => {
  const [epiId, setEpiId] = useState('');
  const [dateControle, setDateControle] = useState('');
  const [status, setStatus] = useState<EPIStatus>(EPIStatus.OPERATIONNEL);
  const [epis, setEpis] = useState<EPI[]>([]);
  const [remarques, setRemarques] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEPIs();
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setDateControle(formattedDate);
  }, []);

  const fetchEPIs = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.get('/epis');

      setEpis(response);
    } catch (err) {
      setError('Erreur lors du chargement des EPIs');
      console.error('Erreur lors du chargement des EPIs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Basic validation
    if (!epiId || !dateControle) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      const userId = localStorage.getItem("userId"); // Récupérer l'ID de l'utilisateur

      if (!userId) {
        setError("Utilisateur non connecté.");
        return;
      }

      const controleData = {
        epiId,
        dateControle: new Date(dateControle),
        status,
        gestionnaireId: userId, // Utiliser l'ID de l'utilisateur connecté
        remarques: remarques || undefined
      };

      const newControle = await apiService.post('/controles', controleData);
      
      setSuccessMessage('Contrôle ajouté avec succès !');
      
      // Reset form
      setEpiId('');
      setDateControle('');
      setStatus(EPIStatus.OPERATIONNEL);
      setRemarques('');

      // Callback to refresh the list
      onControleAdded();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'ajout du contrôle');
    }
  };

  return (
    <div className="add-controle-form-container">
      <h2>Fiche de contrôle</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-controle-form">
        <div className="form-group">
          <label htmlFor="epiId">ID de l'EPI</label>
          <label htmlFor="epiId">Sélectionner l'EPI</label>
          {isLoading ? (
            <div>Chargement des EPIs...</div>
          ) : (
            <select
              id="epiId"
              value={epiId}
              onChange={(e) => setEpiId(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Sélectionnez un EPI</option>
              {epis.map((epi) => (
                <option key={epi.id} value={epi.id}>
                  {epi.interneId}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="dateControle">Date du Contrôle</label>
          <input
            type="date"
            id="dateControle"
            value={dateControle}
            onChange={(e) => setDateControle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Statut</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as EPIStatus)}
            required
          >
            {Object.values(EPIStatus).map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="remarques">Remarques (Optionnel)</label>
          <textarea
            id="remarques"
            value={remarques}
            onChange={(e) => setRemarques(e.target.value)}
            placeholder="Entrez des remarques supplémentaires"
          />
        </div>

        <button type="submit" className="submit-button">
          Ajouter le Contrôle
        </button>
      </form>
    </div>
  );
};

export default AddControleForm;

function setIsLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}
