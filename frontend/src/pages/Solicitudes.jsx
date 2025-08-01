import { useState, useEffect } from 'react';
import { getCategorias, getEquiposByCategoria, getHorasRealmenteDisponiblesByEquipo } from '@services/solicitud.service.js';
import { createSolicitud } from '@services/solicitud.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import '@styles/solicitudes.css';

const Solicitudes = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [equipos, setEquipos] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [horaInicioSeleccionada, setHoraInicioSeleccionada] = useState(null);
  const [horaFinSeleccionada, setHoraFinSeleccionada] = useState(null);
  const [modoSeleccion, setModoSeleccion] = useState('inicio'); // 'inicio', 'fin', 'completado'
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await getCategorias();
      setCategorias(response);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      showErrorAlert('Error', 'Error al cargar las categorías');
    }
  };

  const handleCategoriaChange = async (e) => {
    const categoriaId = e.target.value;
    setCategoriaSeleccionada(categoriaId);
    setEquipoSeleccionado(null);
    setHorasDisponibles([]);
    resetSeleccion();

    if (categoriaId) {
      try {
        setLoading(true);
        const response = await getEquiposByCategoria(categoriaId);
        setEquipos(response);
      } catch (error) {
        console.error('Error al cargar equipos:', error);
        showErrorAlert('Error', 'Error al cargar los equipos');
      } finally {
        setLoading(false);
      }
    } else {
      setEquipos([]);
    }
  };

  const handleEquipoSelect = async (equipo) => {
    setEquipoSeleccionado(equipo);
    resetSeleccion();

    if (fechaSeleccionada) {
      await cargarHorasDisponibles(equipo.id);
    }
  };

  const handleFechaChange = async (e) => {
    const fecha = e.target.value;
    setFechaSeleccionada(fecha);
    resetSeleccion();

    if (equipoSeleccionado) {
      await cargarHorasDisponibles(equipoSeleccionado.id, fecha);
    }
  };

  const resetSeleccion = () => {
    setHoraInicioSeleccionada(null);
    setHoraFinSeleccionada(null);
    setModoSeleccion('inicio');
  };

  const cargarHorasDisponibles = async (equipoId, fecha = fechaSeleccionada) => {
    try {
      setLoading(true);
      const response = await getHorasRealmenteDisponiblesByEquipo(equipoId, fecha);
      setHorasDisponibles(response || []);
    } catch (error) {
      console.error('Error al cargar horas disponibles:', error);
      showErrorAlert('Error', 'Error al cargar las horas disponibles');
      setHorasDisponibles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleHoraClick = (hora) => {
    const horaStr = hora.hora.substring(0, 5); // Convertir a HH:MM
    
    if (modoSeleccion === 'inicio') {
      // Primera selección - definir hora de inicio
      setHoraInicioSeleccionada(hora);
      setHoraFinSeleccionada(null);
      setModoSeleccion('fin');
    } else if (modoSeleccion === 'fin') {
      // Segunda selección - definir hora de fin
      const horaInicioStr = horaInicioSeleccionada.hora.substring(0, 5);
      
      if (horaStr === horaInicioStr) {
        // Misma hora - selección de una sola hora
        setHoraFinSeleccionada(horaInicioSeleccionada);
        setModoSeleccion('completado');
      } else if (validarRangoContinuo(horaInicioSeleccionada, hora)) {
        // Rango válido
        setHoraFinSeleccionada(hora);
        setModoSeleccion('completado');
      } else {
        // Rango inválido - reiniciar
        showErrorAlert('Error', 'No se puede seleccionar este rango. Hay horas ocupadas en el medio o el orden es incorrecto.');
        resetSeleccion();
      }
    } else {
      // Ya hay selección completa - reiniciar
      resetSeleccion();
      setHoraInicioSeleccionada(hora);
      setModoSeleccion('fin');
    }
  };

  const validarRangoContinuo = (horaInicio, horaFin) => {
    const horaInicioStr = horaInicio.hora.substring(0, 5);
    const horaFinStr = horaFin.hora.substring(0, 5);
    
    // Verificar que horaFin sea posterior a horaInicio
    if (horaFinStr <= horaInicioStr) {
      return false;
    }

    // Obtener todas las horas en el rango
    const horasEnRango = getHorasEnRango(horaInicioStr, horaFinStr);
    
    // Verificar que todas las horas del rango estén disponibles
    const horasDisponiblesStr = horasDisponibles.map(h => h.hora.substring(0, 5));
    
    for (const hora of horasEnRango) {
      if (!horasDisponiblesStr.includes(hora)) {
        return false;
      }
    }
    
    return true;
  };

  const getHorasEnRango = (horaInicio, horaFin) => {
    const horas = [];
    let [horaActual, minutoActual] = horaInicio.split(':').map(Number);
    const [horaFinNum, minutoFinNum] = horaFin.split(':').map(Number);
    
    while (horaActual < horaFinNum || (horaActual === horaFinNum && minutoActual <= minutoFinNum)) {
      horas.push(`${String(horaActual).padStart(2, '0')}:${String(minutoActual).padStart(2, '0')}`);
      horaActual++;
    }
    
    return horas;
  };

  const getEstadoHora = (hora) => {
    const horaStr = hora.hora.substring(0, 5);
    
    if (!horaInicioSeleccionada) {
      return 'disponible';
    }
    
    const horaInicioStr = horaInicioSeleccionada.hora.substring(0, 5);
    
    if (horaStr === horaInicioStr) {
      return 'inicio';
    }
    
    if (horaFinSeleccionada) {
      const horaFinStr = horaFinSeleccionada.hora.substring(0, 5);
      if (horaStr === horaFinStr) {
        return 'fin';
      }
      
      // Verificar si está en el rango seleccionado
      const horasEnRango = getHorasEnRango(horaInicioStr, horaFinStr);
      if (horasEnRango.includes(horaStr)) {
        return 'rango';
      }
    }
    
    return 'disponible';
  };

  const handleSubmitSolicitud = async () => {
    if (!equipoSeleccionado || !horaInicioSeleccionada) {
      showErrorAlert('Error', 'Debe seleccionar un equipo y al menos una hora');
      return;
    }

    try {
      setLoading(true);
      
      const horaInicio = horaInicioSeleccionada.hora.substring(0, 5);
      // Si hay hora fin seleccionada, calcular hora fin + 1, sino solo agregar 1 hora a inicio
      const horaFin = horaFinSeleccionada ? 
        calcularHoraFin(horaFinSeleccionada.hora.substring(0, 5)) : 
        calcularHoraFin(horaInicio);
      
      const solicitudData = {
        categoriaId: parseInt(categoriaSeleccionada),
        equipoId: equipoSeleccionado.id,
        fechaInicioPrestamo: fechaSeleccionada,
        horaInicioPrestamo: horaInicio,
        horaFinPrestamo: horaFin,
        fechaFinPrestamo: fechaSeleccionada,
        estadoPrestamoId: 1, // Estado "Pendiente"
      };

      await createSolicitud(solicitudData);

      showSuccessAlert('¡Éxito!', 'Solicitud creada correctamente');
      
      // Limpiar formulario
      setCategoriaSeleccionada('');
      setEquipos([]);
      setEquipoSeleccionado(null);
      setHorasDisponibles([]);
      resetSeleccion();
      setFechaSeleccionada('');
      
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      showErrorAlert('Error', 'Error al crear la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const calcularHoraFin = (horaStr) => {
    const [hora, minuto] = horaStr.split(':').map(Number);
    const nuevaHora = hora + 1;
    return `${String(nuevaHora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const formatHora = (hora) => {
    return hora.hora.substring(0, 5);
  };

  const getDescripcionSeleccion = () => {
    if (!horaInicioSeleccionada) {
      return 'Haz clic en una hora para comenzar la selección';
    } else if (modoSeleccion === 'fin') {
      return 'Haz clic en otra hora para definir el rango, o en la misma para seleccionar solo esa hora';
    } else if (horaInicioSeleccionada && horaFinSeleccionada) {
      const inicio = formatHora(horaInicioSeleccionada);
      const fin = calcularHoraFin(formatHora(horaFinSeleccionada));
      return `Rango seleccionado: ${inicio} - ${fin}`;
    }
  };

  return (
    <div className='solicitudes-container'>
      <div className='solicitudes-header'>
        <h1>Solicitar Equipo</h1>
        <p>Selecciona una categoría, equipo y horarios disponibles</p>
      </div>

      <div className='solicitudes-form'>
        {/* Paso 1: Seleccionar Categoría */}
        <div className='form-step'>
          <h3>1. Seleccionar Categoría</h3>
          <select 
            value={categoriaSeleccionada} 
            onChange={handleCategoriaChange}
            className='categoria-select'
          >
            <option value=''>Seleccione una categoría</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Paso 2: Seleccionar Fecha */}
        {categoriaSeleccionada && (
          <div className='form-step'>
            <h3>2. Seleccionar Fecha</h3>
            <input
              type='date'
              value={fechaSeleccionada}
              onChange={handleFechaChange}
              min={getTodayDate()}
              className='fecha-input'
            />
          </div>
        )}

        {/* Paso 3: Seleccionar Equipo */}
        {equipos.length > 0 && (
          <div className='form-step'>
            <h3>3. Seleccionar Equipo</h3>
            <div className='equipos-grid'>
              {equipos.map(equipo => (
                <div 
                  key={equipo.id} 
                  className={`equipo-card ${equipoSeleccionado?.id === equipo.id ? 'selected' : ''}`}
                  onClick={() => handleEquipoSelect(equipo)}
                >
                  <h4>{equipo.modelo}</h4>
                  <p><strong>Marca:</strong> {equipo.marca?.nombre}</p>
                  <p><strong>Serie:</strong> {equipo.numeroDeSerie}</p>
                  <p><strong>Estado:</strong> {equipo.estadoAltaBaja?.nombre}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paso 4: Seleccionar Horarios */}
        {equipoSeleccionado && fechaSeleccionada && (
          <div className='form-step'>
            <h3>4. Seleccionar Horarios</h3>
            
            {/* Instrucciones */}
            <div className='instrucciones'>
              <p className='descripcion-seleccion'>{getDescripcionSeleccion()}</p>
            </div>

            {loading ? (
              <p>Cargando horarios disponibles...</p>
            ) : horasDisponibles.length > 0 ? (
              <div className='horas-grid-interactivo'>
                {horasDisponibles.map(hora => {
                  const estado = getEstadoHora(hora);
                  return (
                    <div 
                      key={hora.id}
                      className={`hora-bloque ${estado}`}
                      onClick={() => handleHoraClick(hora)}
                    >
                      <span className='hora-texto'>
                        {formatHora(hora)}
                      </span>
                      {estado === 'inicio' && <span className='etiqueta'>Inicio</span>}
                      {estado === 'fin' && <span className='etiqueta'>Fin</span>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No hay horarios disponibles para la fecha seleccionada</p>
            )}
          </div>
        )}

        {/* Resumen y Envío */}
        {horaInicioSeleccionada && modoSeleccion === 'completado' && (
          <div className='form-step'>
            <h3>5. Resumen de Solicitud</h3>
            <div className='resumen'>
              <p><strong>Equipo:</strong> {equipoSeleccionado.modelo}</p>
              <p><strong>Fecha:</strong> {new Date(fechaSeleccionada).toLocaleDateString()}</p>
              <p><strong>Horario:</strong> {getDescripcionSeleccion()}</p>
            </div>
            
            <button 
              className='submit-btn'
              onClick={handleSubmitSolicitud}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Solicitudes;
