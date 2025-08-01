import { useAuth } from '@context/AuthContext';
import AdminHome from './AdminHome';
import '@styles/home.css';

const Home = () => {
  const { user } = useAuth();

  // Si el usuario es administrador, mostrar la página de administrador
  if (user?.rol === 'administrador') {
    return <AdminHome />;
  }

  // Si es usuario normal, mostrar la página de usuario

  return (
    <div className="home-container">
      <div className="welcome-section">
        <div className="welcome-header">
          <h1>¡Bienvenido/a, {user?.nombres || 'Usuario'}!</h1>
          <p className="welcome-subtitle">
            Sistema de Gestión de Préstamos de Equipos - Universidad del Bío-Bío
          </p>
        </div>

        <div className="instructions-card">
          <h2>📋 Instrucciones para Solicitar Equipos</h2>
          
          <div className="instruction-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Navega a "Solicitar Equipo"</h3>
              <p>Haz clic en el menú superior para acceder a la página de solicitud de equipos.</p>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Selecciona el Equipo</h3>
              <p>Elige el equipo que necesitas de la lista disponible. Puedes filtrar por categoría para encontrarlo más fácilmente.</p>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Define el Período de Préstamo</h3>
              <p>Selecciona las fechas de inicio y fin del préstamo, así como el horario específico en el que necesitas el equipo.</p>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Agrega Observaciones (Opcional)</h3>
              <p>Si tienes alguna observación especial o comentario sobre el uso del equipo, puedes agregarla en esta sección.</p>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">5</div>
            <div className="step-content">
              <h3>Envía tu Solicitud</h3>
              <p>Revisa todos los datos y envía tu solicitud. Recibirás una confirmación y podrás seguir el estado en "Mis Solicitudes".</p>
            </div>
          </div>
        </div>

        <div className="info-cards">
          <div className="info-card">
            <h3>⏰ Horarios de Atención</h3>
            <p>Lunes a Viernes: 8:00 - 20:00</p>
            <p>Sábados: 9:00 - 13:00</p>
          </div>
          
          <div className="info-card">
            <h3>📞 Contacto</h3>
            <p>¿Necesitas ayuda?</p>
            <p>Contacta al personal del laboratorio</p>
          </div>
          
          <div className="info-card">
            <h3>⚠️ Importante</h3>
            <p>Recuerda devolver los equipos en la fecha acordada</p>
            <p>Cuida los equipos como si fueran tuyos</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home