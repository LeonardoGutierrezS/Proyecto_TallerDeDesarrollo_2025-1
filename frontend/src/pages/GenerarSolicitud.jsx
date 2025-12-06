import '@styles/styles.css';
import '@styles/generar-solicitud.css';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect } from 'react';
import { useGetEquiposDisponibles } from '@hooks/equipos/useGetEquiposDisponibles';
import { useGetCategorias } from '@hooks/catalogos/useGetCategorias';
import { createPrestamo } from '@services/prestamo.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale/es';

// Crear un locale personalizado con meses capitalizados
const esCapitalizado = {
    ...es,
    localize: {
        ...es.localize,
        month: (n) => {
            const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            return months[n];
        },
    },
};

registerLocale('es', esCapitalizado);

const GenerarSolicitud = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [selectedEquipo, setSelectedEquipo] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [tipoPrestamo, setTipoPrestamo] = useState('diario'); // 'diario' o 'largo_plazo'
    
    // Obtener fecha de hoy en formato YYYY-MM-DD
    const getFechaHoy = () => {
        const hoy = new Date();
        return hoy.toISOString().split('T')[0];
    };

    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [fechaTermino, setFechaTermino] = useState(new Date());
    const [formData, setFormData] = useState({
        condiciones: '',
        observaciones: ''
    });

    // Actualizar fecha de término automáticamente si es préstamo diario
    useEffect(() => {
        if (tipoPrestamo === 'diario' && fechaInicio) {
            setFechaTermino(fechaInicio);
        }
    }, [tipoPrestamo, fechaInicio]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { equipos, loading: loadingEquipos } = useGetEquiposDisponibles();
    const { categorias, loading: loadingCategorias } = useGetCategorias();

    // Filtrar equipos por categoría seleccionada
    const equiposFiltrados = selectedCategoria
        ? equipos.filter(eq => eq.categoria?.ID_Categoria === selectedCategoria.ID_Categoria)
        : [];

    // Filtrar equipos por búsqueda
    const equiposBuscados = searchText
        ? equiposFiltrados.filter(eq =>
            eq.ID_Num_Inv?.toLowerCase().includes(searchText.toLowerCase()) ||
            eq.Modelo?.toLowerCase().includes(searchText.toLowerCase()) ||
            eq.Numero_Serie?.toLowerCase().includes(searchText.toLowerCase()) ||
            eq.marca?.Marca?.toLowerCase().includes(searchText.toLowerCase())
        )
        : equiposFiltrados;

    // Resetear al cambiar de categoría
    useEffect(() => {
        setSearchText('');
        setSelectedEquipo(null);
    }, [selectedCategoria]);

    // Manejar selección de categoría
    const handleSelectCategoria = (categoria) => {
        setSelectedCategoria(categoria);
        setCurrentStep(2);
    };

    // Manejar selección de equipo
    const handleSelectEquipo = (equipo) => {
        setSelectedEquipo(equipo);
        setCurrentStep(3);
    };

    // Volver al paso anterior
    const handleBack = () => {
        if (currentStep === 3) {
            setCurrentStep(2);
            setSelectedEquipo(null);
        } else if (currentStep === 2) {
            setCurrentStep(1);
            setSelectedCategoria(null);
            setSelectedEquipo(null);
        }
    };

    // Formatear fecha para mostrar
    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha + 'T00:00:00');
        return date.toLocaleDateString('es-CL', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Enviar solicitud
    const handleSubmit = async () => {
        // Validaciones
        if (!fechaInicio || !fechaTermino) {
            showErrorAlert('Campos requeridos', 'Debes completar las fechas de inicio y término del préstamo.');
            return;
        }

        // Validar que la fecha de término sea posterior o igual a la de inicio
        if (fechaTermino < fechaInicio) {
            showErrorAlert('Fechas inválidas', 'La fecha de término debe ser posterior o igual a la fecha de inicio.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Obtener hora actual en formato HH:MM:SS
            const now = new Date();
            const horaActual = now.toTimeString().split(' ')[0]; // Formato: HH:MM:SS

            // Convertir fechas a formato YYYY-MM-DD
            const formatearFechaDB = (fecha) => {
                const year = fecha.getFullYear();
                const month = String(fecha.getMonth() + 1).padStart(2, '0');
                const day = String(fecha.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            // Preparar datos del préstamo
            const prestamoData = {
                ID_Num_Inv: selectedEquipo.ID_Num_Inv,
                ID_Categoria: selectedEquipo.categoria.ID_Categoria,
                Fecha_inicio_prestamo: formatearFechaDB(fechaInicio),
                Hora_inicio_prestamo: horaActual,
                Fecha_ter_prestamo: formatearFechaDB(fechaTermino),
                Hora_fin_prestamo: horaActual,
                Condiciones_Prestamo: formData.condiciones || null,
                Observaciones: formData.observaciones || null,
                ID_Estado_Prestamo: 1 // Pendiente
            };

            const response = await createPrestamo(prestamoData);

            if (response.status === 'Success') {
                showSuccessAlert(
                    '¡Solicitud enviada!',
                    'Tu solicitud de préstamo ha sido enviada exitosamente. El administrador la revisará pronto.'
                );
                // Redirigir a estado de solicitudes
                navigate('/estado-solicitud');
            } else {
                showErrorAlert('Error', response.message || 'No se pudo crear la solicitud');
            }
        } catch (error) {
            console.error('Error al crear solicitud:', error);
            showErrorAlert('Error', 'Ocurrió un error al crear la solicitud');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Renderizar paso 1: Selección de categoría
    const renderStep1 = () => {
        if (loadingCategorias) {
            return <div className="loading-message">Cargando categorías...</div>;
        }

        return (
            <div className="step-content">
                <h2>📦 Paso 1: Selecciona una Categoría</h2>
                <p className="step-description">Elige el tipo de equipo que necesitas para tu préstamo</p>

                <div className="categorias-grid">
                    {categorias.map((categoria) => {
                        const equiposDisponibles = equipos.filter(
                            eq => eq.categoria?.ID_Categoria === categoria.ID_Categoria
                        ).length;

                        return (
                            <div
                                key={categoria.ID_Categoria}
                                className={`categoria-card ${equiposDisponibles === 0 ? 'disabled' : ''}`}
                                onClick={() => equiposDisponibles > 0 && handleSelectCategoria(categoria)}
                            >
                                <div className="categoria-icon">📦</div>
                                <h3>{categoria.Categoria}</h3>
                                <div className="categoria-count">
                                    {equiposDisponibles} {equiposDisponibles === 1 ? 'equipo' : 'equipos'} disponible{equiposDisponibles !== 1 ? 's' : ''}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Renderizar paso 2: Selección de equipo
    const renderStep2 = () => {
        if (loadingEquipos) {
            return <div className="loading-message">Cargando equipos...</div>;
        }

        return (
            <div className="step-content">
                <h2>💻 Paso 2: Selecciona un Equipo</h2>
                <p className="step-description">
                    Categoría: <strong>{selectedCategoria?.Categoria}</strong>
                </p>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar por N° Inventario, Modelo, Serie o Marca..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="equipos-list">
                    {equiposBuscados.length === 0 ? (
                        <div className="no-equipos">
                            <p>No hay equipos disponibles en esta categoría</p>
                        </div>
                    ) : (
                        equiposBuscados.map((equipo) => (
                            <div
                                key={equipo.ID_Num_Inv}
                                className="equipo-card"
                                onClick={() => handleSelectEquipo(equipo)}
                            >
                                <div className="equipo-header">
                                    <span className="equipo-inv">{equipo.ID_Num_Inv}</span>
                                    <span className="equipo-badge disponible">Disponible</span>
                                </div>
                                <div className="equipo-info">
                                    <div className="equipo-detail">
                                        <span className="label">Modelo:</span>
                                        <span className="value">{equipo.Modelo}</span>
                                    </div>
                                    <div className="equipo-detail">
                                        <span className="label">Marca:</span>
                                        <span className="value">{equipo.marca?.Marca || 'N/A'}</span>
                                    </div>
                                    <div className="equipo-detail">
                                        <span className="label">N° Serie:</span>
                                        <span className="value">{equipo.Numero_Serie}</span>
                                    </div>
                                    <div className="equipo-detail">
                                        <span className="label">Estado:</span>
                                        <span className="value">{equipo.estado?.Estado || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="step-actions">
                    <button className="btn-back" onClick={handleBack}>
                        ← Volver
                    </button>
                </div>
            </div>
        );
    };

    // Renderizar paso 3: Resumen y confirmación
    const renderStep3 = () => {
        return (
            <div className="step-content">
                <h2>📋 Paso 3: Confirma tu Solicitud</h2>
                <p className="step-description">Revisa los detalles y completa la información</p>

                <div className="resumen-container">
                    {/* Información del equipo */}
                    <div className="resumen-section">
                        <h3>💻 Equipo Seleccionado</h3>
                        <div className="resumen-grid">
                            <div className="resumen-item">
                                <span className="label">N° Inventario:</span>
                                <span className="value">{selectedEquipo?.ID_Num_Inv}</span>
                            </div>
                            <div className="resumen-item">
                                <span className="label">Categoría:</span>
                                <span className="value">{selectedEquipo?.categoria?.Categoria}</span>
                            </div>
                            <div className="resumen-item">
                                <span className="label">Modelo:</span>
                                <span className="value">{selectedEquipo?.Modelo}</span>
                            </div>
                            <div className="resumen-item">
                                <span className="label">Marca:</span>
                                <span className="value">{selectedEquipo?.marca?.Marca}</span>
                            </div>
                            <div className="resumen-item">
                                <span className="label">N° Serie:</span>
                                <span className="value">{selectedEquipo?.Numero_Serie}</span>
                            </div>
                            <div className="resumen-item">
                                <span className="label">Estado:</span>
                                <span className="value">{selectedEquipo?.estado?.Estado}</span>
                            </div>
                        </div>
                    </div>

                    {/* Configuración del Préstamo */}
                    <div className="resumen-section prestamo-config">
                        <h3>📋 Condiciones del Préstamo</h3>
                        
                        {/* Tipo de préstamo */}
                        <div className="config-subsection">
                            <h4 className="subsection-title">Duración del Préstamo</h4>
                            <div className="tipo-prestamo-selector">
                                <div 
                                    className={`tipo-option ${tipoPrestamo === 'diario' ? 'active' : ''}`}
                                    onClick={() => setTipoPrestamo('diario')}
                                >
                                    <div className="tipo-icon">📅</div>
                                    <div className="tipo-info">
                                        <h4>Préstamo por el día</h4>
                                        <p>El equipo se debe devolver el mismo día</p>
                                    </div>
                                </div>
                                <div 
                                    className={`tipo-option ${tipoPrestamo === 'largo_plazo' ? 'active' : ''}`}
                                    onClick={() => setTipoPrestamo('largo_plazo')}
                                >
                                    <div className="tipo-icon">📆</div>
                                    <div className="tipo-info">
                                        <h4>Préstamo a largo plazo</h4>
                                        <p>El equipo se devolverá en una fecha posterior</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Selección de fechas */}
                        <div className="config-subsection">
                            <h4 className="subsection-title">Fechas del Préstamo</h4>
                            <div className="calendario-container">
                            <div className="form-group">
                                <label>
                                    Fecha de {tipoPrestamo === 'diario' ? 'Préstamo' : 'Inicio'} *
                                </label>
                                <DatePicker
                                    selected={fechaInicio}
                                    onChange={(date) => setFechaInicio(date)}
                                    minDate={new Date()}
                                    dateFormat="dd/MM/yyyy"
                                    locale="es"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    className="calendario-input"
                                    calendarClassName="custom-calendar"
                                    placeholderText="Selecciona una fecha"
                                    required
                                />
                                <span className="fecha-helper">
                                    {fechaInicio && formatearFecha(fechaInicio.toISOString().split('T')[0])}
                                </span>
                            </div>
                            {tipoPrestamo === 'largo_plazo' && (
                                <div className="form-group">
                                    <label>
                                        Fecha de Devolución *
                                    </label>
                                    <DatePicker
                                        selected={fechaTermino}
                                        onChange={(date) => setFechaTermino(date)}
                                        minDate={fechaInicio || new Date()}
                                        dateFormat="dd/MM/yyyy"
                                        locale="es"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        className="calendario-input"
                                        calendarClassName="custom-calendar"
                                        placeholderText="Selecciona una fecha"
                                        required
                                    />
                                    <span className="fecha-helper">
                                        {fechaTermino && formatearFecha(fechaTermino.toISOString().split('T')[0])}
                                    </span>
                                </div>
                            )}
                        </div>
                        {tipoPrestamo === 'diario' && fechaInicio && (
                            <div className="fecha-info">
                                <span>ℹ️ El equipo debe devolverse el mismo día seleccionado</span>
                            </div>
                        )}
                        {tipoPrestamo === 'largo_plazo' && fechaInicio && fechaTermino && (
                            <div className="fecha-info">
                                <span>📊 Duración del préstamo: <strong>{Math.ceil((fechaTermino - fechaInicio) / (1000 * 60 * 60 * 24)) + 1} días</strong></span>
                            </div>
                        )}
                        <p className="fecha-nota">
                            💡 La hora se registrará automáticamente al confirmar
                        </p>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="resumen-section info-adicional">
                        <h3>📝 Información Adicional</h3>
                        <p className="section-description">Los siguientes campos son opcionales pero pueden ayudar a procesar tu solicitud</p>
                        <div className="form-grid-adicional">
                            <div className="form-group">
                                <label htmlFor="condiciones">Condiciones Especiales</label>
                                <textarea
                                    id="condiciones"
                                    name="condiciones"
                                    value={formData.condiciones}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Necesito el equipo en la sala 205"
                                    rows="4"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="observaciones">Observaciones</label>
                                <textarea
                                    id="observaciones"
                                    name="observaciones"
                                    value={formData.observaciones}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Es para una presentación importante"
                                    rows="4"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="step-actions">
                    <button className="btn-back" onClick={handleBack} disabled={isSubmitting}>
                        ← Volver
                    </button>
                    <button 
                        className="btn-submit" 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Enviando...' : '✓ Confirmar Solicitud'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="main-container">
            <div className="solicitud-header">
                <h1>✨ Generar Solicitud de Préstamo</h1>
            </div>

            {/* Indicador de pasos */}
            <div className="steps-indicator">
                <div className={`step-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                    <div className="step-number">1</div>
                    <div className="step-label">Categoría</div>
                </div>
                <div className={`step-line ${currentStep > 1 ? 'completed' : ''}`}></div>
                <div className={`step-item ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                    <div className="step-number">2</div>
                    <div className="step-label">Equipo</div>
                </div>
                <div className={`step-line ${currentStep > 2 ? 'completed' : ''}`}></div>
                <div className={`step-item ${currentStep >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <div className="step-label">Confirmar</div>
                </div>
            </div>

            {/* Contenido del paso actual */}
            <div className="steps-content">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
            </div>
        </div>
    );
};

export default GenerarSolicitud;
