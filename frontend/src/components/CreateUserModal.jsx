import { useState, useEffect } from 'react';
import { createUser } from '@services/user.service.js';
import { getCarreras } from '@services/carrera.service.js';
import { getCargos } from '@services/cargo.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatRut, validateRut, validateRutFormat } from '@helpers/rutFormatter.js';
import '@styles/modal.css';

const CreateUserModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        correo: '',
        rut: '',
        codTipoUsuario: '',
        idCarrera: '',
        idCargo: '',
        descripcionCargo: ''
    });
    const [carreras, setCarreras] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [carrerasData, cargosData] = await Promise.all([
                getCarreras(),
                getCargos()
            ]);
            
            console.log('=== DEBUG CreateUserModal ===');
            console.log('carrerasData:', carrerasData);
            console.log('cargosData:', cargosData);
            
            // Los datos pueden venir en response.data.data o directamente en response.data
            const carrerasArray = carrerasData?.data ? carrerasData.data : 
                                 Array.isArray(carrerasData) ? carrerasData : [];
            const cargosArray = cargosData?.data ? cargosData.data : 
                               Array.isArray(cargosData) ? cargosData : [];
            
            console.log('carrerasArray:', carrerasArray);
            console.log('cargosArray:', cargosArray);
            
            setCarreras(carrerasArray);
            setCargos(cargosArray);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            setCarreras([]);
            setCargos([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Si es el campo RUT, formatear automáticamente
        if (name === 'rut') {
            const formattedRut = formatRut(value);
            setFormData({
                ...formData,
                [name]: formattedRut
            });
        } else if (name === 'codTipoUsuario') {
            // Limpiar campos condicionales al cambiar tipo de usuario
            setFormData({
                ...formData,
                [name]: value,
                idCarrera: '',
                idCargo: '',
                descripcionCargo: ''
            });
        } else if (name === 'idCargo' && value !== '2') {
            // Limpiar descripción si cambia a un cargo diferente de "Otro"
            setFormData({
                ...formData,
                [name]: value,
                descripcionCargo: ''
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validar RUT antes de enviar
            if (!validateRutFormat(formData.rut)) {
                showErrorAlert('Error', 'Formato de RUT inválido');
                setLoading(false);
                return;
            }

            if (!validateRut(formData.rut)) {
                showErrorAlert('Error', 'El RUT ingresado no es válido (dígito verificador incorrecto)');
                setLoading(false);
                return;
            }

            const userData = {
                nombreCompleto: formData.nombreCompleto,
                email: formData.correo,
                rut: formData.rut,
                codTipoUsuario: parseInt(formData.codTipoUsuario),
                idCarrera: formData.idCarrera && formData.idCarrera !== '' ? parseInt(formData.idCarrera) : null,
                idCargo: formData.idCargo && formData.idCargo !== '' ? parseInt(formData.idCargo) : null,
                descripcionCargo: formData.descripcionCargo || null
            };

            const response = await createUser(userData);

            if (response.status === 'Success') {
                showSuccessAlert(
                    '¡Éxito!', 
                    'Usuario creado correctamente. Se ha generado una contraseña provisional y se ha enviado al correo del usuario.'
                );
                onSuccess();
            } else {
                showErrorAlert('Error', response.details?.message || response.message || 'Error al crear usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorAlert('Error', 'No se pudo crear el usuario');
        } finally {
            setLoading(false);
        }
    };

    // Determinar qué campos mostrar
    const esAlumno = formData.codTipoUsuario === '2';
    const esProfesor = formData.codTipoUsuario === '3';
    const esCargoOtro = formData.idCargo === '2'; // ID_Cargo = 2 es "Otro"

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Crear Nuevo Usuario</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form" autoComplete="off">
                    <div className="form-group">
                        <label htmlFor="nombreCompleto">Nombre Completo *</label>
                        <input
                            type="text"
                            id="nombreCompleto"
                            name="nombreCompleto"
                            value={formData.nombreCompleto}
                            onChange={handleChange}
                            required
                            minLength={15}
                            maxLength={50}
                            placeholder="Ej: Juan Pablo Pérez González"
                            autoComplete="chrome-off"
                            data-lpignore="true"
                            data-form-type="other"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="correo">Correo Electrónico *</label>
                        <input
                            type="text"
                            id="correo"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                            placeholder="ejemplo@gmail.cl"
                            autoComplete="chrome-off"
                            data-lpignore="true"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rut">RUT *</label>
                        <input
                            type="text"
                            id="rut"
                            name="rut"
                            value={formData.rut}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="codTipoUsuario">Tipo de Usuario *</label>
                        <select
                            id="codTipoUsuario"
                            name="codTipoUsuario"
                            value={formData.codTipoUsuario}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un tipo de usuario</option>
                            <option value="1">Administrador</option>
                            <option value="2">Alumno</option>
                            <option value="3">Profesor</option>
                        </select>
                    </div>

                    {esAlumno && (
                        <div className="form-group">
                            <label htmlFor="idCarrera">Carrera *</label>
                            <select
                                id="idCarrera"
                                name="idCarrera"
                                value={formData.idCarrera}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione una carrera</option>
                                {carreras.map(carrera => (
                                    <option key={carrera.ID_Carrera} value={carrera.ID_Carrera}>
                                        {carrera.Nombre_Carrera}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {esProfesor && (
                        <>
                            <div className="form-group">
                                <label htmlFor="idCargo">Cargo *</label>
                                <select
                                    id="idCargo"
                                    name="idCargo"
                                    value={formData.idCargo}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione un cargo</option>
                                    {cargos.map(cargo => (
                                        <option key={cargo.ID_Cargo} value={cargo.ID_Cargo}>
                                            {cargo.Desc_Cargo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {esCargoOtro && (
                                <div className="form-group">
                                    <label htmlFor="descripcionCargo">Descripción del Cargo</label>
                                    <input
                                        type="text"
                                        id="descripcionCargo"
                                        name="descripcionCargo"
                                        value={formData.descripcionCargo}
                                        onChange={handleChange}
                                        maxLength={255}
                                        placeholder="Ej: Jefe de Carrera, Coordinador de Laboratorio, etc."
                                        autoComplete="chrome-off"
                                        data-lpignore="true"
                                    />
                                </div>
                            )}
                        </>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Creando...' : 'Crear Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;
