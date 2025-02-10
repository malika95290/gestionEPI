import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import type { Controle, EPI } from 'gestepiinterfaces';
import { FaTrash } from "react-icons/fa";
import '../../styles/epiControle.css';
import AddControleForm from './AddControleForm';
import { jwtDecode } from 'jwt-decode';

// Fonction pour extraire le rôle de l'utilisateur à partir du token
const getUserRoleFromToken = (token: string): string | null => {
    try {
        const decodedToken = jwtDecode<{ role: string }>(token); // Décoder le token
        return decodedToken.role; // Retourner le rôle
    } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        return null;
    }
};

export const ControleList: React.FC = () => {
    const [controles, setControle] = useState<(Controle & { interneId?: string })[]>([]);
    const [epis, setEpis] = useState<EPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    
        // Récupérer le token et extraire le rôle de l'utilisateur
    const token = localStorage.getItem('token');
    const userRole = token ? getUserRoleFromToken(token) : null;
    

    const fetchControlesAndEPIs = async () => {
        try {
            setLoading(true);
            const [controlesData, episData] = await Promise.all([
                apiService.get('/controles'),
                apiService.get('/epis')  // Assurez-vous d'avoir un endpoint pour récupérer tous les EPIs
            ]);

            // Mapper les interneId aux contrôles
            const controlesWithInterneId = controlesData.map((controle: Controle) => {
                const correspondingEPI = episData.find((epi: EPI) => epi.id === controle.epiId);
                return {
                    ...controle,
                    interneId: correspondingEPI ? correspondingEPI.interneId : undefined
                };
            });

            setControle(controlesWithInterneId);
            setEpis(episData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchControlesAndEPIs();
    }, []);
    const handleControleAdded = () => {
        fetchControlesAndEPIs(); // Actualiser la liste
        setShowAddForm(false); // Masquer optionnellement le formulaire
    };


    const handleDeleteControle = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contrôle ?')) {
            try {
                await apiService.delete(`/controles/${id}`);
                setControle(controles.filter(controle => controle.id !== id));
                setSuccessMessage('Contrôle supprimé avec succès !');
                setTimeout(() => setSuccessMessage(null), 3000);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression');
            }
        }
    };

    const filteredControle = controles.filter(controle =>
        controle.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="loading-spinner">
                <span className="spinner"></span> Chargement...
            </div>
        );
    }

    return (
        <div className="container">
  <div className="search-container">
    <input
      type="text"
      placeholder="Rechercher un contrôle..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="search-input"
    />
  </div>

  <div className="content-container">
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>
                {userRole === 'GESTIONNAIRE' && (
                    <>
                        Actions
                    </>
                )}
            </th>
            <th>EPI</th>
            <th>Date du contrôle</th>
            <th>Status</th>
            <th>Contrôleur</th>
          </tr>
        </thead>
        <tbody>
          {filteredControle.map((controles) => (
            <tr key={controles.id}>
              <td>
               {/* Afficher les boutons d'action uniquement pour les GESTIONNAIRE */}
                  {userRole === 'GESTIONNAIRE' && (
                      <>
                          <button 
                            className="delete-button" 
                            onClick={() => handleDeleteControle(controles.id)}
                          >
                            <FaTrash />
                          </button>
                      </>
                  )}
              </td>
              <td>{controles.interneId || controles.epiId}</td>
              <td>{new Date(controles.dateControle).toLocaleDateString()}</td>
              <td>{controles.status}</td>
              <td>{controles.gestionnaireId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Afficher le formulaire uniquement pour les GESTIONNAIRE */}
    {userRole === 'GESTIONNAIRE' && (           
        <AddControleForm onControleAdded={handleControleAdded} />
      )}
  </div>
</div>
    );
}; 