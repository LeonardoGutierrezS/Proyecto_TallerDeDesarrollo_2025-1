import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import '@styles/navbar.css';
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || {};
    const userRole = user?.rol;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Función para obtener el nombre completo del usuario
    const getUserDisplayName = () => {
        if (user?.nombreCompleto) {
            return user.nombreCompleto;
        }
        if (user?.nombres && user?.apellidos) {
            return `${user.nombres} ${user.apellidos}`;
        }
        if (user?.nombres) {
            return user.nombres;
        }
        return 'Usuario';
    };

    // Función para obtener la inicial del usuario
    const getUserInitial = () => {
        const displayName = getUserDisplayName();
        return displayName.charAt(0).toUpperCase();
    };

    // Función para obtener el rol formateado
    const getUserRoleDisplay = () => {
        if (userRole === 'administrador') {
            return 'Administrador';
        }
        return 'Usuario';
    };

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth'); 
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            {/* Botón hamburguesa para móviles */}
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
            </button>

            {/* Overlay para cerrar sidebar en móviles */}
            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

            {/* Sidebar */}
            <nav className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">SIREC</h2>
                    <p className="sidebar-subtitle">Sistema de Reservas</p>
                    <div className="sidebar-user">
                        <div className="user-avatar">
                            {getUserInitial()}
                        </div>
                        <div className="user-info">
                            <p className="user-name" title={getUserDisplayName()}>
                                {getUserDisplayName()}
                            </p>
                            <p className="user-role">
                                {getUserRoleDisplay()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="sidebar-menu">
                    <ul className="menu-list">
                        <li className="menu-item">
                            <NavLink 
                                to="/home" 
                                className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="menu-icon">🏠</span>
                                <span className="menu-text">Inicio</span>
                            </NavLink>
                        </li>

                        {userRole === 'administrador' && (
                            <>
                                <li className="menu-item">
                                    <NavLink 
                                        to="/users" 
                                        className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="menu-icon">👥</span>
                                        <span className="menu-text">Usuarios</span>
                                    </NavLink>
                                </li>
                                <li className="menu-item">
                                    <NavLink 
                                        to="/equipos" 
                                        className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="menu-icon">💻</span>
                                        <span className="menu-text">Equipos</span>
                                    </NavLink>
                                </li>
                                <li className="menu-item">
                                    <NavLink 
                                        to="/horas-disponibles" 
                                        className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="menu-icon">⏰</span>
                                        <span className="menu-text">Horas Disponibles</span>
                                    </NavLink>
                                </li>
                                <li className="menu-item">
                                    <NavLink 
                                        to="/gestion-solicitudes" 
                                        className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="menu-icon">📋</span>
                                        <span className="menu-text">Gestionar Solicitudes</span>
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {userRole === 'usuario' && (
                            <>
                                <li className="menu-item">
                                    <NavLink 
                                        to="/solicitudes" 
                                        className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="menu-icon">📝</span>
                                        <span className="menu-text">Solicitar Equipo</span>
                                    </NavLink>
                                </li>
                                <li className="menu-item">
                                    <NavLink 
                                        to="/mis-solicitudes" 
                                        className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="menu-icon">📄</span>
                                        <span className="menu-text">Mis Solicitudes</span>
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                <div className="sidebar-footer">
                    <button 
                        className="logout-btn"
                        onClick={() => {
                            logoutSubmit();
                            setSidebarOpen(false);
                        }}
                    >
                        <span className="menu-icon">🚪</span>
                        <span className="menu-text">Cerrar Sesión</span>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default Navbar;