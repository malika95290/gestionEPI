import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { EPIList } from '../components/epi/epiList';
import { ControleList } from '../components/controle/controleList';
import Notifications from '../components/alert/Notifications';
import { apiService } from '../services/apiService'; // Importer apiService
import type { EPI } from 'gestepiinterfaces'; // Importer l'interface EPI
import '../styles/dashboard.css';

interface EPIWithNextControl extends EPI {
  prochainControle: Date;
}

const Dashboard: React.FC = () => {
  const [activeItem, setActiveItem] = useState('epi');
  const [notificationCount, setNotificationCount] = useState(0); // État pour le nombre de notifications
  const [upcomingControls, setUpcomingControls] = useState<EPIWithNextControl[]>([]); // État pour les contrôles à venir

  // Fonction pour charger les notifications
  const fetchUpcomingControls = async () => {
    try {
      const response = await apiService.get('/epis/upcoming'); // Charger les notifications
      setUpcomingControls(response);
      setNotificationCount(response.length); // Mettre à jour le nombre de notifications
    } catch (error) {
      console.error('Erreur lors de la récupération des contrôles à venir:', error);
    }
  };

  // Charger les notifications au montage du composant
  useEffect(() => {
    fetchUpcomingControls();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        notificationCount={notificationCount} // Passer le nombre de notifications
      />
      <main className="dashboard-main">
        <h1>
          {activeItem === 'epi' ? 'Liste des EPIs' : 
           activeItem === 'controles' ? 'Liste des contrôles' : 
           'Notifications'}
        </h1>
        {activeItem === 'epi' ? (
          <EPIList />
        ) : activeItem === 'controles' ? (
          <ControleList />
        ) : (
          <Notifications upcomingControls={upcomingControls} /> // Passer les contrôles à venir
        )}
      </main>
    </div>
  );
};

export default Dashboard;