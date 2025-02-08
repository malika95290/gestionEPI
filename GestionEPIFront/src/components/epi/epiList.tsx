import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import type { EPI, EpiType } from '../../../../GestEPIInterfaces';
import AddEPIForm from './AddEPIForm';
import '../../styles/epiList.css'

export const EPIList: React.FC = () => {
    const [epis, setEpis] = useState<EPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false); // Pour afficher ou cacher le formulaire d'ajout  
    const [types, setTypes] = useState<EpiType[]>([]);

    const fetchEPIs = async () => {
      try {
        setLoading(true);
        const [episData, typesData] = await Promise.all([
          apiService.get('/epis'),
          apiService.get('/epi-types') // Récupère les types
        ]);
        setEpis(episData);
        setTypes(typesData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchEPIs();
    }, []);
  
    const handleAddEpi = () => {
      setShowAddForm(true);
    };
  
    const handleEpiAdded = () => {
      fetchEPIs();  // Recharger la liste des EPIs après l'ajout
      setShowAddForm(false);  // Cacher le formulaire après ajout
    };
  
    const filteredEPIs = epis.filter(epi => 
      epi.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      epi.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      epi.numeroDeSerie.toString().includes(searchTerm)
    );
  
    if (loading) {
      return (
        <div className="loading-spinner">
          <span className="spinner"></span> Chargement...
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="error-box">
          <p>Erreur: {error}</p>
          <button onClick={fetchEPIs} className="retry-button">Réessayer</button>
        </div>
      );
    }
  
    return (
      <div className="container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher un EPI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="add-button" onClick={handleAddEpi}>Ajouter un EPI</button>
        </div>
  
        {showAddForm && <AddEPIForm onEpiAdded={handleEpiAdded} />}
  
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>ID interne</th>
                <th>Marque</th>
                <th>Modèle</th>
                <th>Types</th>
                <th>Taille</th>
                <th>Couleur</th>
                <th>N° Série</th>
                <th>Date d'achat</th>
                <th>Date de fabrication</th>
                <th>Date de mise en service</th>
                <th>Fréquence de contrôle</th>
                <th>Contrôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEPIs.map((epi) => (
                <tr key={epi.id}>
                  <td>{epi.id}</td>
                  <td>{epi.idInterne}</td>
                  <td>{epi.marque || '-'}</td>
                  <td>{epi.model || '-'}</td>
                  <td>{types.find(type => type.id === epi.idTypes)?.nom || '-'}</td>

                  <td>{epi.taille || '-'}</td>
                  <td>{epi.couleur || '-'}</td>
                  <td>{epi.numeroDeSerie}</td>
                  <td>{new Date(epi.dateAchat).toLocaleDateString()}</td>
                  <td>{new Date(epi.dateFabrication).toLocaleDateString()}</td>
                  <td>{new Date(epi.dateMiseEnService).toLocaleDateString()}</td>
                  <td>{epi.frequenceControle || '-'}</td>
                  <td>{epi.idCheck || 'Aucun contrôle'}</td>
                  <td>
                    <button className="edit-button">Modifier</button>
                    <button className="delete-button">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };