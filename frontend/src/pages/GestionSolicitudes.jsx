import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useGetPrestamos } from "../hooks/prestamos/useGetPrestamos.jsx";
import { useGestionarPrestamo } from "../hooks/prestamos/useGestionarPrestamo.jsx";
import CustomTable from "../components/CustomTable.jsx";
import SimplePopup from "../components/SimplePopup.jsx";
import { formatRut, formatFecha } from "../helpers/formatData.js";
import { showErrorAlert } from "../helpers/sweetAlert.js";
import "../styles/gestion-solicitudes-new.css";

function GestionSolicitudes() {
  const { user } = useAuth();
  const [estadoFiltro, setEstadoFiltro] = useState(1); // Por defecto mostrar pendientes
  const { prestamos, loading: loadingPrestamos, fetchPrestamos } = useGetPrestamos(estadoFiltro);
  const { loading: loadingGestion, aprobarPrestamo, rechazarPrestamo, entregarPrestamo, devolverPrestamo } = useGestionarPrestamo();
  
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");

  // Verificar que el usuario sea administrador
  if (!user || user.rol !== "administrador") {
    return (
      <div className="gestion-solicitudes-main-container">
        <div className="gestion-solicitudes-access-denied">
          <div className="access-denied-content">
            <h2>🚫 Acceso Denegado</h2>
            <p>Solo los administradores pueden acceder a esta sección.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAprobar = async (prestamo) => {
    const success = await aprobarPrestamo(prestamo.id, fetchPrestamos);
    if (success) {
      console.log("Préstamo aprobado:", prestamo);
    }
  };

  const handleRechazar = (prestamo) => {
    setSelectedPrestamo(prestamo);
    setShowRejectPopup(true);
  };

  const handleConfirmReject = async () => {
    if (!motivoRechazo.trim()) {
      showErrorAlert("Campo requerido", "Debe ingresar un motivo de rechazo antes de continuar.");
      return;
    }

    const success = await rechazarPrestamo(selectedPrestamo.id, motivoRechazo, fetchPrestamos);
    if (success) {
      setShowRejectPopup(false);
      setSelectedPrestamo(null);
      setMotivoRechazo("");
    }
  };

  const handleEntregar = async (prestamo) => {
    const success = await entregarPrestamo(prestamo.id, fetchPrestamos);
    if (success) {
      console.log("Préstamo marcado como entregado:", prestamo);
    }
  };

  const handleDevolver = async (prestamo) => {
    const success = await devolverPrestamo(prestamo.id, fetchPrestamos);
    if (success) {
      console.log("Préstamo marcado como devuelto:", prestamo);
    }
  };

  const getEstadoNombre = (estadoId) => {
    const estados = {
      1: "Pendiente",
      2: "Aprobado", 
      3: "Rechazado",
      4: "Entregado",
      5: "Devuelto"
    };
    return estados[estadoId] || "Desconocido";
  };

  const getMensajePositivo = (estadoId) => {
    const mensajes = {
      1: {
        titulo: "¡Excelente trabajo!",
        mensaje: "No hay solicitudes pendientes de revisión. Estás al día con todas las solicitudes.",
        icono: "✅"
      },
      2: {
        titulo: "¡Todo bajo control!",
        mensaje: "No hay solicitudes aprobadas pendientes de entrega. El flujo está funcionando correctamente.",
        icono: "🎯"
      },
      3: {
        titulo: "¡Gestión efectiva!",
        mensaje: "No hay solicitudes rechazadas. Las solicitudes están siendo procesadas exitosamente.",
        icono: "💚"
      },
      4: {
        titulo: "¡Proceso completo!",
        mensaje: "No hay equipos pendientes de devolución. Todas las entregas están al día.",
        icono: "📦"
      },
      5: {
        titulo: "¡Sistema actualizado!",
        mensaje: "No hay devoluciones registradas. El inventario está en perfecto estado.",
        icono: "🔄"
      }
    };
    return mensajes[estadoId] || {
      titulo: "¡Todo en orden!",
      mensaje: "No hay datos para mostrar en esta sección.",
      icono: "ℹ️"
    };
  };

  const getEstadoClass = (estadoId) => {
    const clases = {
      1: "estado-pendiente",
      2: "estado-aprobado",
      3: "estado-rechazado", 
      4: "estado-entregado",
      5: "estado-devuelto"
    };
    return clases[estadoId] || "";
  };

  // Configuración de columnas para CustomTable
  const columns = [
    {
      header: 'ID',
      key: 'id',
      sortable: true,
      width: '80px'
    },
    {
      header: 'Usuario',
      key: 'usuario',
      sortable: true,
      render: (prestamo) => (
        <div style={{ fontWeight: '600', color: '#003366' }}>
          {prestamo.usuario?.nombreCompleto}
          <div style={{ fontSize: '12px', color: '#666', fontWeight: '400' }}>
            {formatRut(prestamo.usuario?.rut || '')}
          </div>
        </div>
      )
    },
    {
      header: 'Equipo',
      key: 'equipo',
      sortable: true,
      render: (prestamo) => (
        <div style={{ fontWeight: '500' }}>
          <div style={{ color: '#003366', fontWeight: '600' }}>
            {prestamo.equipo?.modelo || 'Sin modelo'}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {prestamo.categoria?.nombre || 'Sin categoría'}
          </div>
        </div>
      )
    },
    {
      header: 'Fecha Solicitud',
      key: 'fechaSolicitud',
      sortable: true,
      render: (prestamo) => (
        <div style={{ fontWeight: '500' }}>
          {prestamo.fechaInicioPrestamo ? formatFecha(prestamo.fechaInicioPrestamo) : 'Sin fecha'}
        </div>
      )
    },
    {
      header: 'Horario',
      key: 'horario',
      sortable: true,
      render: (prestamo) => (
        <div style={{ fontWeight: '600', fontSize: '14px', color: '#004d99' }}>
          {prestamo.horaInicioPrestamo && prestamo.horaFinPrestamo 
            ? `${prestamo.horaInicioPrestamo.substring(0, 5)} - ${prestamo.horaFinPrestamo.substring(0, 5)}`
            : 'Sin horario'}
        </div>
      ),
      width: '140px'
    },
    {
      header: 'Estado',
      key: 'estado',
      sortable: true,
      render: (prestamo) => (
        <span className={`gestion-status-badge ${getEstadoClass(prestamo.estadoPrestamoId)}`}>
          {prestamo.estadoPrestamo?.nombre || 'Sin estado'}
        </span>
      ),
      width: '120px'
    },
    {
      header: 'Acciones',
      key: 'acciones',
      render: (prestamo) => (
        <div className="gestion-table-actions">
          {prestamo.estadoPrestamoId === 1 && ( // Pendientes
            <>
              <button 
                onClick={() => handleAprobar(prestamo)} 
                className="gestion-approve-btn"
                disabled={loadingGestion}
              >
                ✓
              </button>
              <button 
                onClick={() => handleRechazar(prestamo)} 
                className="gestion-reject-btn"
                disabled={loadingGestion}
              >
                ✗
              </button>
            </>
          )}
          {prestamo.estadoPrestamoId === 2 && ( // Aprobados
            <button 
              onClick={() => handleEntregar(prestamo)} 
              className="gestion-deliver-btn"
              disabled={loadingGestion}
            >
              📦
            </button>
          )}
          {prestamo.estadoPrestamoId === 3 && prestamo.motivoRechazo && ( // Rechazados
            <div className="gestion-motivo-rechazo">
              <small><strong>Motivo:</strong> {prestamo.motivoRechazo}</small>
            </div>
          )}
          {prestamo.estadoPrestamoId === 4 && ( // Entregados
            <button 
              onClick={() => handleDevolver(prestamo)} 
              className="gestion-return-btn"
              disabled={loadingGestion}
            >
              🔄
            </button>
          )}
          {prestamo.estadoPrestamoId === 5 && ( // Devueltos
            <span className="gestion-completed">✅ Completado</span>
          )}
        </div>
      ),
      width: '180px'
    }
  ];

  // Usar datos formateados
  const tableData = prestamos; // Usar datos directos ya que CustomTable los procesará

  // Estadísticas para el hero section
  const getEstadisticas = () => {
    const total = prestamos.length;
    const porEstado = {};
    const porCategoria = {};
    
    prestamos.forEach(prestamo => {
      const estado = prestamo.estadoPrestamo?.nombre || 'Sin estado';
      const categoria = prestamo.categoria?.nombre || 'Sin categoría';
      
      porEstado[estado] = (porEstado[estado] || 0) + 1;
      porCategoria[categoria] = (porCategoria[categoria] || 0) + 1;
    });

    return { total, porEstado, porCategoria };
  };

  const stats = getEstadisticas();

  return (
    <div className='gestion-solicitudes-main-container'>
      {/* Hero Section */}
      <div className='gestion-hero-section'>
        <div className='gestion-hero-content'>
          <h1 className='gestion-hero-title'>
            Gestión de Solicitudes
          </h1>
          <p className='gestion-hero-subtitle'>
            Administra y gestiona todas las solicitudes de préstamo de equipos del laboratorio
          </p>
        </div>
      </div>

      {/* Controls Section */}
      <div className='gestion-controls-section'>
        <div className='gestion-controls-card'>
          <div className='gestion-controls-header'>
            <h3>Filtros y Configuración</h3>
            <p>Selecciona el estado de las solicitudes que deseas revisar</p>
          </div>
          
          <div className='gestion-controls-content'>
            <div className='gestion-filters-group'>
              <div className='gestion-filter-item'>
                <label htmlFor='estado-filtro'>Filtrar por Estado</label>
                <select
                  id='estado-filtro'
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(parseInt(e.target.value))}
                  className='gestion-filter-select'
                >
                  <option value={1}>📋 Pendientes</option>
                  <option value={2}>✅ Aprobados</option>
                  <option value={3}>❌ Rechazados</option>
                  <option value={4}>📦 Entregados</option>
                  <option value={5}>🔄 Devueltos</option>
                </select>
              </div>

              <div className='gestion-filter-item'>
                <label>&nbsp;</label>
                <button 
                  onClick={() => fetchPrestamos()} 
                  className='gestion-refresh-btn'
                  disabled={loadingPrestamos}
                >
                  🔄 Actualizar
                </button>
              </div>
            </div>

            <div className='gestion-current-filter'>
              <span className='filter-indicator'>
                Mostrando: <strong>{getEstadoNombre(estadoFiltro)}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className='gestion-table-section'>
        {loadingPrestamos ? (
          <div className='gestion-loading-section'>
            <div className='gestion-loading-spinner'></div>
            <h3>Cargando solicitudes...</h3>
            <p>Por favor espera mientras cargan los datos</p>
          </div>
        ) : prestamos.length === 0 ? (
          <div className='gestion-empty-section'>
            <div className='empty-content'>
              <div className="empty-icon">{getMensajePositivo(estadoFiltro).icono}</div>
              <h3 className="empty-title">{getMensajePositivo(estadoFiltro).titulo}</h3>
              <p className="empty-text">{getMensajePositivo(estadoFiltro).mensaje}</p>
            </div>
          </div>
        ) : (
          <>
            <div style={{ 
              marginBottom: '20px', 
              textAlign: 'center', 
              color: '#003366', 
              fontWeight: '600',
              fontSize: '16px'
            }}>
              Mostrando {prestamos.length} solicitudes con estado: <strong>{getEstadoNombre(estadoFiltro)}</strong>
            </div>
            <CustomTable
              data={tableData}
              columns={columns}
              title=""
              subtitle=""
              showSearch={true}
              showPagination={true}
              pageSize={15}
              loading={loadingPrestamos}
            />
          </>
        )}
      </div>

      {/* Modal de Rechazo */}
      {showRejectPopup && (
        <SimplePopup 
          show={showRejectPopup} 
          setShow={setShowRejectPopup}
          className="gestion-reject-popup"
        >
          <div className="reject-popup-content">
            <h3 className="reject-popup-title">Rechazar Solicitud</h3>
            <div className="reject-popup-info">
              <p>
                <strong>Usuario:</strong> {selectedPrestamo?.usuario?.nombreCompleto}<br />
                <strong>Equipo:</strong> {selectedPrestamo?.equipo?.modelo}<br />
                <strong>Fecha:</strong> {formatFecha(selectedPrestamo?.fechaInicioPrestamo)}
              </p>
            </div>
            
            <div className="reject-form-group">
              <label htmlFor="motivo-rechazo">Motivo del rechazo *</label>
              <textarea
                id="motivo-rechazo"
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                placeholder="Ingrese el motivo del rechazo..."
                rows={4}
                className="reject-textarea"
                required
              />
            </div>
            
            <div className="reject-popup-actions">
              <button
                className="reject-cancel-btn"
                onClick={() => {
                  setShowRejectPopup(false);
                  setSelectedPrestamo(null);
                  setMotivoRechazo("");
                }}
                disabled={loadingGestion}
              >
                Cancelar
              </button>
              <button
                className="reject-confirm-btn"
                onClick={handleConfirmReject}
                disabled={loadingGestion || !motivoRechazo.trim()}
              >
                {loadingGestion ? "Rechazando..." : "Rechazar Solicitud"}
              </button>
            </div>
          </div>
        </SimplePopup>
      )}
    </div>
  );
}

export default GestionSolicitudes;
