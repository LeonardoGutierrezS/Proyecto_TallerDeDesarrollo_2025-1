import { useState, useEffect } from 'react';
import { getMisSolicitudes } from '@services/solicitud.service.js';
import { showErrorAlert } from '@helpers/sweetAlert.js';
import '@styles/mis-solicitudes.css';

const MisSolicitudes = () => {
  console.log('MisSolicitudes component rendering...');
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        console.log('Fetching solicitudes...');
        setLoading(true);
        setError(null);
        const data = await getMisSolicitudes();
        console.log('Data received:', data);
        setSolicitudes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching solicitudes:', err);
        if (err.response?.status !== 404) {
          setError('Error al cargar las solicitudes');
          showErrorAlert('Error', 'No se pudieron cargar las solicitudes');
        } else {
          console.log('No solicitudes found (404), setting empty array');
        }
        setSolicitudes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  console.log('Current state:', { solicitudes, loading, error });

  if (loading) {
    return (
      <div className='mis-solicitudes-container'>
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='mis-solicitudes-container'>
        <div className='error-container'>
          <h2>Error al cargar solicitudes</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className='retry-btn'>
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='mis-solicitudes-container'>
      <div className='solicitudes-header'>
        <h1>Mis Solicitudes</h1>
        <p>Gestiona y revisa el estado de tus solicitudes de equipos</p>
      </div>

      {/* Estadísticas Básicas */}
      <div className='stats-container'>
        <div className='stat-card'>
          <span className='stat-number'>{solicitudes.length}</span>
          <span className='stat-label'>Total de Solicitudes</span>
        </div>
      </div>

      {/* Lista de Solicitudes o Estado Vacío */}
      {solicitudes.length === 0 ? (
        <div className='empty-state'>
          <h3>No tienes solicitudes</h3>
          <p>Aún no has realizado ninguna solicitud de equipo.</p>
          <p>Puedes crear una nueva solicitud desde el menú "Solicitar Equipo".</p>
        </div>
      ) : (
        <div className='solicitudes-list'>
          {solicitudes.map((solicitud) => (
            <div key={solicitud.id} className='solicitud-card'>
              <div className='solicitud-header'>
                <div className='solicitud-info'>
                  <h3>{solicitud.equipo?.modelo || 'Equipo no especificado'}</h3>
                  <p className='marca-info'>
                    <strong>Marca:</strong> {solicitud.equipo?.marca?.nombre || 'No especificada'}
                  </p>
                </div>
                <div className='status-badge'>
                  {solicitud.estadoPrestamo?.nombre || 'Sin estado'}
                </div>
              </div>
              <div className='solicitud-actions'>
                <span className='solicitud-id'>ID: {solicitud.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisSolicitudes;
