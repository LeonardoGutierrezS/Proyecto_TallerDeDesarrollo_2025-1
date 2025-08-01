import { useAuth } from '@context/AuthContext';
import '@styles/admin-home.css';

const AdminHome = () => {
  const { user } = useAuth();

  return (
    <div className="admin-home-container">
      <div className="admin-welcome-section">
        <div className="admin-header">
          <div className="sirec-logo">
            <h1>SIREC</h1>
            <p className="sirec-subtitle">Sistema de Registro y Control</p>
          </div>
          <div className="welcome-message">
            <h2>¡Bienvenido/a, {user?.nombres || 'Administrador'}!</h2>
            <p className="admin-role">Panel de Administración</p>
          </div>
        </div>

        <div className="admin-stats-cards">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Gestión de Solicitudes</h3>
              <p>Administra solicitudes de préstamos</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Gestión de Usuarios</h3>
              <p>Administra usuarios del sistema</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💻</div>
            <div className="stat-content">
              <h3>Gestión de Equipos</h3>
              <p>Administra inventario de equipos</p>
            </div>
          </div>
        </div>

        <div className="admin-info">
          <div className="info-card">
            <h3>🎯 Sistema SIREC</h3>
            <p>Gestión eficiente de préstamos de equipos tecnológicos para la Universidad del Bío-Bío.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
