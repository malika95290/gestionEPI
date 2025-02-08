import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { EPIList } from '../components/epi/epiList'
import '../styles/dashboard.css'; 

const Dashboard: React.FC = () => {
  const [activeItem, setActiveItem] = useState('epi');

  return (
    <div className="dashboard-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <main className="dashboard-main">
        <h1>{activeItem === 'epi' ? 'Liste des EPIs' : 'Liste des contrôles'}</h1>
        {activeItem === 'epi' ? (
          <EPIList />
        ) : (
          <div className="placeholder-box">Liste des contrôles (à implémenter)</div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
