import React from 'react';
import { MdChecklistRtl, MdLogout, MdOutlineFormatListBulleted } from "react-icons/md";
import { HiMiniBellAlert } from "react-icons/hi2";
import '../../styles/Sidebar.css';
import { useNavigate } from 'react-router-dom';

export const Sidebar: React.FC<{
    activeItem: string;
    setActiveItem: (item: string) => void;
    notificationCount: number; // Ajouter la prop pour le nombre de notifications
}> = ({ activeItem, setActiveItem, notificationCount }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-content">
                <h1 className="sidebar-title">GestEPI</h1>
                <nav>
                    <ul className="sidebar-nav">
                        <li>
                            <button
                                onClick={() => setActiveItem('epi')}
                                className={`sidebar-button ${
                                    activeItem === 'epi' ? 'active' : ''
                                }`}
                            >
                                <MdOutlineFormatListBulleted className="sidebar-icon" />
                                Liste EPI
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveItem('controles')}
                                className={`sidebar-button ${
                                    activeItem === 'controles' ? 'active' : ''
                                }`}
                            >
                                <MdChecklistRtl className="sidebar-icon" />
                                Liste des contrôles
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveItem('notifications')}
                                className={`sidebar-button ${
                                    activeItem === 'notifications' ? 'active' : ''
                                }`}
                            >
                                <HiMiniBellAlert className="sidebar-icon" />
                                Notifications
                                {notificationCount > 0 && ( // Afficher le badge si des notifications existent
                                    <span className="notification-badge">{notificationCount}</span>
                                )}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="sidebar-button logout-button"
                            >
                                <MdLogout className="sidebar-icon" />
                                Déconnexion
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
};