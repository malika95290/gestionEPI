import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import type { EPI } from '../../../../GestEPIInterfaces';
import { FaTrash, FaPen } from "react-icons/fa";
import EPIForm from './AddEPIForm';
import '../../styles/epiList.css';
import { jwtDecode } from 'jwt-decode'; // Import nommé

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

export const EPIList: React.FC = () => {
    const [epis, setEpis] = useState<EPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingEpi, setEditingEpi] = useState<EPI | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Récupérer le token et extraire le rôle de l'utilisateur
    const token = localStorage.getItem('token');
    const userRole = token ? getUserRoleFromToken(token) : null;

    const fetchEPIs = async () => {
        try {
            setLoading(true);
            const [episData] = await Promise.all([
                apiService.get('/epis'),
            ]);
            setEpis(episData);
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

    const handleEditEpi = (epi: EPI) => {
        setEditingEpi(epi);
    };

    const handleFormSuccess = () => {
        fetchEPIs();
        setEditingEpi(null);
        setSuccessMessage(`EPI ${editingEpi ? 'modifié' : 'ajouté'} avec succès !`);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handleDeleteEpi = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet EPI ?')) {
            try {
                await apiService.delete(`/epis/${id}`);
                setEpis(epis.filter(epi => epi.id !== id));
                setSuccessMessage('EPI supprimé avec succès !');
                setTimeout(() => setSuccessMessage(null), 3000);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression');
            }
        }
    };

    const filteredEPIs = epis.filter(epi =>
        epi.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        epi.modele?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        epi.numeroSerie.toString().includes(searchTerm)
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
                    placeholder="Rechercher un EPI..."
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
                                <th>ID</th>
                                <th>ID interne</th>
                                <th>N° Série</th>
                                <th>Marque</th>
                                <th>Modèle</th>
                                <th>Types</th>
                                <th>Taille</th>
                                <th>Couleur</th>
                                <th>Date d'achat</th>
                                <th>Date de fabrication</th>
                                <th>Date de mise en service</th>
                                <th>Fréquence de contrôle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEPIs.map((epi) => (
                                <tr key={epi.id}>
                                    <td>
                                        {/* Afficher les boutons d'action uniquement pour les GESTIONNAIRE */}
                                        {userRole === 'GESTIONNAIRE' && (
                                            <>
                                                <button 
                                                    className="edit-button" 
                                                    onClick={() => handleEditEpi(epi)}
                                                >
                                                    <FaPen />
                                                </button>
                                                <button 
                                                    className="delete-button" 
                                                    onClick={() => handleDeleteEpi(epi.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                    <td>{epi.id}</td>
                                    <td>{epi.interneId}</td>
                                    <td>{epi.numeroSerie}</td>
                                    <td>{epi.marque || '-'}</td>
                                    <td>{epi.modele || '-'}</td>
                                    <td>{epi.type || '-'}</td>
                                    <td>{epi.taille || '-'}</td>
                                    <td>{epi.couleur || '-'}</td>
                                    <td>{new Date(epi.dateAchat).toLocaleDateString()}</td>
                                    <td>{new Date(epi.dateFabrication).toLocaleDateString()}</td>
                                    <td>{new Date(epi.dateMiseEnService).toLocaleDateString()}</td>
                                    <td>{epi.frequenceControle || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Afficher le formulaire uniquement pour les GESTIONNAIRE */}
                {userRole === 'GESTIONNAIRE' && (
                    <div className="form-container">
                        <h2>{editingEpi ? 'Modifier' : 'Ajouter'} un EPI</h2>
                        <EPIForm
                            onSubmitSuccess={handleFormSuccess}
                            initialData={editingEpi || undefined}
                            isEditing={!!editingEpi}
                        />
                    </div>
                )}
            </div>

            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
        </div>
    );
};