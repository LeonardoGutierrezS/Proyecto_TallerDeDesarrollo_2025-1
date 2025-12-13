import { NavLink, useNavigate } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import '@styles/navbar.css';
import { useState } from "react";
import SirecLogo from '../Images/SIREC LOGO.png';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    const userRole = user?.tipoUsuario;
    const userName = user?.nombreCompleto || 'Usuario';
    const [menuOpen, setMenuOpen] = useState(false);

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth'); 
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <img src={SirecLogo} alt="SIREC" className="sidebar-logo" />
                    <div className="user-info">
                        <p className="user-name">{userName}</p>
                        <p className="user-role">{userRole}</p>
                    </div>
                </div>
                
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <NavLink 
                                to="/home" 
                                className={({ isActive }) => isActive ? 'active' : ''}
                                onClick={() => setMenuOpen(false)}
                            >
                                <span className="icon">🏠</span>
                                <span className="text">Inicio</span>
                            </NavLink>
                        </li>
                        
                        {userRole === 'Administrador' && (
                            <>
                                <li>
                                    <NavLink 
                                        to="/gestion-usuarios" 
                                        className={({ isActive }) => isActive ? 'active' : ''}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <span className="icon">👥</span>
                                        <span className="text">Gestión de Usuarios</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink 
                                        to="/gestion-equipos" 
                                        className={({ isActive }) => isActive ? 'active' : ''}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <span className="icon">💻</span>
                                        <span className="text">Gestión de Equipos</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink 
                                        to="/gestion-solicitudes" 
                                        className={({ isActive }) => isActive ? 'active' : ''}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <span className="icon">📋</span>
                                        <span className="text">Gestión de Solicitudes</span>
                                    </NavLink>
                                </li>
                            </>
                        )}
                        
                        {(userRole === 'Alumno' || userRole === 'Profesor') && (
                            <>
                                <li>
                                    <NavLink 
                                        to="/generar-solicitud" 
                                        className={({ isActive }) => isActive ? 'active' : ''}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <span className="icon">➕</span>
                                        <span className="text">Generar Solicitud</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink 
                                        to="/estado-solicitud" 
                                        className={({ isActive }) => isActive ? 'active' : ''}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <span className="icon">📊</span>
                                        <span className="text">Estado de Solicitud</span>
                                    </NavLink>
                                </li>
                            </>
                        )}
                        
                        <li className="logout">
                            <a onClick={logoutSubmit}>
                                <span className="icon">🚪</span>
                                <span className="text">Cerrar sesión</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>

            {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}
        </>
    );
};

export default Navbar;