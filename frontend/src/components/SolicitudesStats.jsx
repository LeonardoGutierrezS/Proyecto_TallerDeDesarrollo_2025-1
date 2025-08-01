import '@styles/solicitudes-stats.css';

const SolicitudesStats = ({ solicitudes = [] }) => {
  const contarPorEstado = (estado) => {
    return (solicitudes || []).filter(s => 
      s.estadoPrestamo?.nombre?.toLowerCase() === estado
    ).length;
  };

  const calcularProgresoEstados = () => {
    const total = (solicitudes || []).length;
    if (total === 0) return { pendiente: 0, aprobada: 0, enCurso: 0, finalizada: 0 };
    
    return {
      pendiente: (contarPorEstado('pendiente') / total) * 100,
      aprobada: (contarPorEstado('aprobada') / total) * 100,
      enCurso: (contarPorEstado('en curso') / total) * 100,
      finalizada: (contarPorEstado('finalizada') / total) * 100
    };
  };

  const progreso = calcularProgresoEstados();

  const getEquipoMasSolicitado = () => {
    const equipos = {};
    (solicitudes || []).forEach(s => {
      const modelo = s.equipo?.modelo;
      if (modelo) {
        equipos[modelo] = (equipos[modelo] || 0) + 1;
      }
    });
    
    const equipoMasUsado = Object.entries(equipos).sort((a, b) => b[1] - a[1])[0];
    return equipoMasUsado ? equipoMasUsado[0] : 'Ninguno';
  };

  return (
    <div className='solicitudes-stats'>
      <div className='stats-grid'>
        <div className='stat-card primary'>
          <div className='stat-icon'>📊</div>
          <div className='stat-content'>
            <span className='stat-number'>{(solicitudes || []).length}</span>
            <span className='stat-label'>Total de Solicitudes</span>
          </div>
        </div>
        
        <div className='stat-card pending'>
          <div className='stat-icon'>⏳</div>
          <div className='stat-content'>
            <span className='stat-number'>{contarPorEstado('pendiente')}</span>
            <span className='stat-label'>Pendientes</span>
            <div className='progress-bar'>
              <div className='progress-fill' style={{ width: `${progreso.pendiente}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className='stat-card approved'>
          <div className='stat-icon'>✅</div>
          <div className='stat-content'>
            <span className='stat-number'>{contarPorEstado('aprobada')}</span>
            <span className='stat-label'>Aprobadas</span>
            <div className='progress-bar'>
              <div className='progress-fill' style={{ width: `${progreso.aprobada}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className='stat-card in-progress'>
          <div className='stat-icon'>🔄</div>
          <div className='stat-content'>
            <span className='stat-number'>{contarPorEstado('en curso')}</span>
            <span className='stat-label'>En Curso</span>
            <div className='progress-bar'>
              <div className='progress-fill' style={{ width: `${progreso.enCurso}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className='stat-card completed'>
          <div className='stat-icon'>🏁</div>
          <div className='stat-content'>
            <span className='stat-number'>{contarPorEstado('finalizada')}</span>
            <span className='stat-label'>Finalizadas</span>
            <div className='progress-bar'>
              <div className='progress-fill' style={{ width: `${progreso.finalizada}%` }}></div>
            </div>
          </div>
        </div>

        <div className='stat-card info'>
          <div className='stat-icon'>🏆</div>
          <div className='stat-content'>
            <span className='stat-text'>{getEquipoMasSolicitado()}</span>
            <span className='stat-label'>Equipo Más Solicitado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitudesStats;
