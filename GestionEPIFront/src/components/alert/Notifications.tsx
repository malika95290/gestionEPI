import React, { useEffect } from 'react';
import { MdNotifications } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { EPI } from '../../../../GestEPIInterfaces';

interface EPIWithNextControl extends EPI {
  prochainControle: Date;
}

interface NotificationsProps {
  upcomingControls: EPIWithNextControl[]; // Props pour les contrôles à venir
}

const Notifications: React.FC<NotificationsProps> = ({ upcomingControls }) => {
  // Afficher les toasts lorsque le composant est monté ou lorsque upcomingControls change
  useEffect(() => {
    if (upcomingControls.length > 0) {
      toast.info(`Vous avez ${upcomingControls.length} contrôle(s) à venir.`);
    } else {
      toast.info('Aucun contrôle à venir.');
    }
  }, [upcomingControls]); // Déclencher l'effet lorsque upcomingControls change

  return (
    <div className="notifications-container">

      <div className="notifications-list">
        <h3>Liste des EPI à contrôler</h3>
        {upcomingControls.length > 0 ? (
          <table className="epi-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ID Interne</th>
                <th>Numéro de série</th>
                <th>Marque</th>
                <th>Modèle</th>
                <th>Type</th>
                <th>Taille</th>
                <th>Couleur</th>
                <th>Date d'achat</th>
                <th>Date de fabrication</th>
                <th>Date de mise en service</th>
                <th>Fréquence de contrôle</th>
                <th>Prochain contrôle</th>
              </tr>
            </thead>
            <tbody>
              {upcomingControls.map((epi) => (
                <tr key={epi.id}>
                  <td>{epi.id}</td>
                  <td>{epi.interneId}</td>
                  <td>{epi.numeroSerie}</td>
                  <td>{epi.marque}</td>
                  <td>{epi.modele}</td>
                  <td>{epi.type}</td>
                  <td>{epi.taille}</td>
                  <td>{epi.couleur}</td>
                  <td>{new Date(epi.dateAchat).toLocaleDateString()}</td>
                  <td>{new Date(epi.dateFabrication).toLocaleDateString()}</td>
                  <td>{new Date(epi.dateMiseEnService).toLocaleDateString()}</td>
                  <td>{epi.frequenceControle} mois</td>
                  <td>{new Date(epi.prochainControle).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun contrôle à venir.</p>
        )}
      </div>

      {/* Conteneur pour les notifications toast */}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Notifications;