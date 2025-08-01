import { useState, useEffect } from 'react';
import '@styles/modal-horas.css';

const HoraDisponibleModal = ({ isOpen, onClose, onSubmit, horaInicial, equipos, loading }) => {
  const [formData, setFormData] = useState({
    equipoId: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    disponible: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (horaInicial) {
      setFormData({
        equipoId: horaInicial.equipo?.id || '',
        fecha: horaInicial.fecha ? new Date(horaInicial.fecha).toISOString().split('T')[0] : '',
        horaInicio: horaInicial.horaInicio || '',
        horaFin: horaInicial.horaFin || '',
        disponible: horaInicial.disponible !== undefined ? horaInicial.disponible : true
      });
    } else {
      setFormData({
        equipoId: '',
        fecha: '',
        horaInicio: '',
        horaFin: '',
        disponible: true
      });
    }
    setErrors({});
  }, [horaInicial, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.equipoId) {
      newErrors.equipoId = 'Debe seleccionar un equipo';
    }
    
    if (!formData.fecha) {
      newErrors.fecha = 'Debe seleccionar una fecha';
    } else {
      const selectedDate = new Date(formData.fecha);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.fecha = 'No se pueden crear horarios en fechas pasadas';
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(formData);
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>{horaInicial ? 'Editar Horario' : 'Crear Nuevo Horario'}</h2>
          <button className='close-btn' onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className='modal-form'>
          <div className='form-group'>
            <label htmlFor='equipoId'>Equipo *</label>
            <select
              id='equipoId'
              name='equipoId'
              value={formData.equipoId}
              onChange={handleChange}
              className={errors.equipoId ? 'error' : ''}
              disabled={loading}
            >
              <option value=''>Seleccionar equipo</option>
              {equipos.map(equipo => (
                <option key={equipo.id} value={equipo.id}>
                  {equipo.modelo} - {equipo.marca?.nombre}
                </option>
              ))}
            </select>
            {errors.equipoId && <span className='error-message'>{errors.equipoId}</span>}
          </div>

          <div className='form-group'>
            <label htmlFor='fecha'>Fecha *</label>
            <input
              type='date'
              id='fecha'
              name='fecha'
              value={formData.fecha}
              onChange={handleChange}
              min={getTomorrowDate()}
              className={errors.fecha ? 'error' : ''}
              disabled={loading}
            />
            {errors.fecha && <span className='error-message'>{errors.fecha}</span>}
          </div>

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
          </div>

          <div className='form-group'>
            <label className='checkbox-label'>
              <input
                type='checkbox'
                name='disponible'
                checked={formData.disponible}
                onChange={handleChange}
                disabled={loading}
              />
              <span className='checkbox-text'>Disponible para reservas</span>
            </label>
          </div>

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
              disabled={loading}
            >
              {loading ? 'Guardando...' : (horaInicial ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HoraDisponibleModal;
