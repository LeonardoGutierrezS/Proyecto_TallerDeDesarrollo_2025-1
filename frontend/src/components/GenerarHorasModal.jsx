import { useState } from 'react';
import '@styles/modal-horas-new.css';

const GenerarHorasModal = ({ isOpen, onClose, onSubmit, equipos, loading }) => {
  const [formData, setFormData] = useState({
    equipoIds: [],
    fechaInicio: '',
    fechaFin: '',
    horaInicio: '08:00',
    horaFin: '18:00',
    duracionSlot: 60, // en minutos
    diasSemana: [1, 2, 3, 4, 5], // Lun-Vie por defecto
    soloHorasLaborales: true
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  const diasSemanaOptions = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEquipoChange = (equipoId) => {
    setFormData(prev => ({
      ...prev,
      equipoIds: prev.equipoIds.includes(equipoId)
        ? prev.equipoIds.filter(id => id !== equipoId)
        : [...prev.equipoIds, equipoId]
    }));
  };

  const handleSelectAllEquipos = (e) => {
    const isChecked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      equipoIds: isChecked ? equipos.map(equipo => equipo.id) : []
    }));
  };

  const isAllEquiposSelected = formData.equipoIds.length === equipos.length && equipos.length > 0;

  const handleDiasSemanaChange = (dia) => {
    setFormData(prev => ({
      ...prev,
      diasSemana: prev.diasSemana.includes(dia)
        ? prev.diasSemana.filter(d => d !== dia)
        : [...prev.diasSemana, dia]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.equipoIds.length === 0) {
      newErrors.equipoIds = 'Debe seleccionar al menos un equipo';
    }
    
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'Debe especificar la fecha de inicio';
    }
    
    if (!formData.fechaFin) {
      newErrors.fechaFin = 'Debe especificar la fecha de fin';
    }
    
    if (formData.fechaInicio && formData.fechaFin) {
      if (new Date(formData.fechaInicio) > new Date(formData.fechaFin)) {
        newErrors.fechaFin = 'La fecha de fin debe ser igual o posterior a la fecha de inicio';
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (new Date(formData.fechaInicio) < today) {
        newErrors.fechaInicio = 'La fecha de inicio no puede ser en el pasado';
      }
    }
    
    if (!formData.horaInicio) {
      newErrors.horaInicio = 'Debe especificar la hora de inicio';
    }
    
    if (!formData.horaFin) {
      newErrors.horaFin = 'Debe especificar la hora de fin';
    }
    
    if (formData.horaInicio && formData.horaFin) {
      if (formData.horaInicio >= formData.horaFin) {
        newErrors.horaFin = 'La hora de fin debe ser posterior a la hora de inicio';
      }
    }
    
    if (formData.duracionSlot < 15 || formData.duracionSlot > 480) {
      newErrors.duracionSlot = 'La duración debe estar entre 15 minutos y 8 horas';
    }
    
    if (formData.diasSemana.length === 0) {
      newErrors.diasSemana = 'Debe seleccionar al menos un día de la semana';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calcularPreview = () => {
    if (!formData.fechaInicio || !formData.fechaFin || !formData.horaInicio || !formData.horaFin) {
      return null;
    }

    const fechaInicio = new Date(formData.fechaInicio);
    const fechaFin = new Date(formData.fechaFin);
    const diasEnRango = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;
    
    // Calcular días laborales según días de semana seleccionados
    let diasValidos = 0;
    for (let d = new Date(fechaInicio); d <= fechaFin; d.setDate(d.getDate() + 1)) {
      if (formData.diasSemana.includes(d.getDay())) {
        diasValidos++;
      }
    }
    
    // Calcular slots por día
    const [horaInicioH, horaInicioM] = formData.horaInicio.split(':').map(Number);
    const [horaFinH, horaFinM] = formData.horaFin.split(':').map(Number);
    
    const minutosInicio = horaInicioH * 60 + horaInicioM;
    const minutosFin = horaFinH * 60 + horaFinM;
    const minutosDisponibles = minutosFin - minutosInicio;
    
    const slotsPorDia = Math.floor(minutosDisponibles / formData.duracionSlot);
    const totalSlots = diasValidos * slotsPorDia * formData.equipoIds.length;
    
    return {
      diasEnRango,
      diasValidos,
      slotsPorDia,
      totalSlots,
      equiposSeleccionados: formData.equipoIds.length
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Mapeo de números de día a nombres
    const diasSemanaMap = {
      0: 'domingo',
      1: 'lunes', 
      2: 'martes',
      3: 'miercoles',
      4: 'jueves',
      5: 'viernes',
      6: 'sabado'
    };
    
    // Transformar los datos al formato esperado por el backend
    const dataToSend = {
      equipos: formData.equipoIds, // cambiar de equipoIds a equipos
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      diasSemana: formData.diasSemana.map(dia => diasSemanaMap[dia]), // convertir números a nombres
      duracion: formData.duracionSlot // cambiar de duracionSlot a duracion
    };
    
    onSubmit(dataToSend);
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const previewData = calcularPreview();

  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content large' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>Generar Horarios Automáticamente</h2>
          <button className='close-btn' onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className='modal-form'>
          {/* Selección de Equipos */}
          <div className='form-section'>
            <h3>Equipos</h3>
            <div className='select-all-container'>
              <label className='select-all-checkbox'>
                <input
                  type='checkbox'
                  checked={isAllEquiposSelected}
                  onChange={handleSelectAllEquipos}
                  disabled={loading || equipos.length === 0}
                />
                <span className='select-all-text'>
                  Seleccionar todos los equipos ({equipos.length})
                </span>
              </label>
            </div>
            <div className='equipos-grid'>
              {equipos.map(equipo => (
                <label key={equipo.id} className='equipo-checkbox'>
                  <input
                    type='checkbox'
                    checked={formData.equipoIds.includes(equipo.id)}
                    onChange={() => handleEquipoChange(equipo.id)}
                    disabled={loading}
                  />
                  <span>{equipo.modelo} - {equipo.marca?.nombre}</span>
                </label>
              ))}
            </div>
            {errors.equipoIds && <span className='error-message'>{errors.equipoIds}</span>}
          </div>

          {/* Rango de Fechas */}
          <div className='form-section'>
            <h3>Período</h3>
            <p className='form-help-text'>
              Puedes seleccionar el mismo día en ambas fechas para generar horarios para un solo día.
            </p>
            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='fechaInicio'>Fecha de inicio *</label>
                <input
                  type='date'
                  id='fechaInicio'
                  name='fechaInicio'
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  min={getTomorrowDate()}
                  className={errors.fechaInicio ? 'error' : ''}
                  disabled={loading}
                />
                {errors.fechaInicio && <span className='error-message'>{errors.fechaInicio}</span>}
              </div>

              <div className='form-group'>
                <label htmlFor='fechaFin'>Fecha de fin *</label>
                <input
                  type='date'
                  id='fechaFin'
                  name='fechaFin'
                  value={formData.fechaFin}
                  onChange={handleChange}
                  min={formData.fechaInicio || getTomorrowDate()}
                  className={errors.fechaFin ? 'error' : ''}
                  disabled={loading}
                />
                {errors.fechaFin && <span className='error-message'>{errors.fechaFin}</span>}
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div className='form-section'>
            <h3>Configuración de Horarios</h3>
            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='horaInicio'>Hora de inicio *</label>
                <input
                  type='time'
                  id='horaInicio'
                  name='horaInicio'
                  value={formData.horaInicio}
                  onChange={handleChange}
                  className={errors.horaInicio ? 'error' : ''}
                  disabled={loading}
                />
                {errors.horaInicio && <span className='error-message'>{errors.horaInicio}</span>}
              </div>

              <div className='form-group'>
                <label htmlFor='horaFin'>Hora de fin *</label>
                <input
                  type='time'
                  id='horaFin'
                  name='horaFin'
                  value={formData.horaFin}
                  onChange={handleChange}
                  className={errors.horaFin ? 'error' : ''}
                  disabled={loading}
                />
                {errors.horaFin && <span className='error-message'>{errors.horaFin}</span>}
              </div>

              <div className='form-group'>
                <label htmlFor='duracionSlot'>Duración por slot (minutos) *</label>
                <select
                  id='duracionSlot'
                  name='duracionSlot'
                  value={formData.duracionSlot}
                  onChange={handleChange}
                  className={errors.duracionSlot ? 'error' : ''}
                  disabled={loading}
                >
                  <option value={15}>15 minutos</option>
                  <option value={30}>30 minutos</option>
                  <option value={60}>1 hora</option>
                  <option value={90}>1.5 horas</option>
                  <option value={120}>2 horas</option>
                  <option value={180}>3 horas</option>
                  <option value={240}>4 horas</option>
                </select>
                {errors.duracionSlot && <span className='error-message'>{errors.duracionSlot}</span>}
              </div>
            </div>
          </div>

          {/* Días de la Semana */}
          <div className='form-section'>
            <h3>Días de la Semana</h3>
            <div className='dias-semana-grid'>
              {diasSemanaOptions.map(dia => (
                <label key={dia.value} className='dia-checkbox'>
                  <input
                    type='checkbox'
                    checked={formData.diasSemana.includes(dia.value)}
                    onChange={() => handleDiasSemanaChange(dia.value)}
                    disabled={loading}
                  />
                  <span>{dia.label}</span>
                </label>
              ))}
            </div>
            {errors.diasSemana && <span className='error-message'>{errors.diasSemana}</span>}
          </div>

          {/* Preview */}
          {previewData && (
            <div className='preview-section'>
              <h3>Vista Previa</h3>
              <div className='preview-stats'>
                <div className='preview-stat'>
                  <span className='stat-number'>{previewData.totalSlots}</span>
                  <span className='stat-label'>Horarios a crear</span>
                </div>
                <div className='preview-stat'>
                  <span className='stat-number'>{previewData.diasValidos}</span>
                  <span className='stat-label'>Días válidos</span>
                </div>
                <div className='preview-stat'>
                  <span className='stat-number'>{previewData.slotsPorDia}</span>
                  <span className='stat-label'>Slots por día</span>
                </div>
                <div className='preview-stat'>
                  <span className='stat-number'>{previewData.equiposSeleccionados}</span>
                  <span className='stat-label'>Equipos</span>
                </div>
              </div>
            </div>
          )}

          <div className='modal-actions'>
            <button 
              type='button' 
              onClick={onClose} 
              className='cancel-btn'
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type='submit' 
              className='submit-btn'
              disabled={loading || !previewData || previewData.totalSlots === 0}
            >
              {loading ? 'Generando...' : `Generar ${previewData?.totalSlots || 0} Horarios`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerarHorasModal;
