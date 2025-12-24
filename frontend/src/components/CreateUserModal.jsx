import { useState, useEffect } from 'react';
import { createUser } from '@services/user.service.js';
import { getCarreras } from '@services/carrera.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatRut } from '@helpers/rutFormatter.js';
import '@styles/modal.css';

const CreateUserModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        correo: '',
        rut: '',
        codTipoUsuario: '',
        idCarrera: ''
    });
    const [carreras, setCarreras] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCarreras();
    }, []);

    const fetchCarreras = async () => {
        try {
            const data = await getCarreras();
            setCarreras(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al cargar carreras:', error);
            setCarreras([]);
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
            const userData = {
                nombreCompleto: formData.nombreCompleto,
                email: formData.correo,
                rut: formData.rut,
                codTipoUsuario: parseInt(formData.codTipoUsuario),
                idCarrera: formData.idCarrera && formData.idCarrera !== '' ? parseInt(formData.idCarrera) : null
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
                            placeholder="12.345.678-9"
                            autoComplete="chrome-off"
                            data-lpignore="true"
                            data-form-type="other"
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
                            <option value="2">Alumno</option>
                            <option value="3">Profesor</option>
                            <option value="4">Director de Escuela</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="idCarrera">Carrera</label>
                        <select
                            id="idCarrera"
                            name="idCarrera"
                            value={formData.idCarrera}
                            onChange={handleChange}
                        >
                            <option value="">Sin carrera</option>
                            {carreras.map(carrera => (
                                <option key={carrera.ID_Carrera} value={carrera.ID_Carrera}>
                                    {carrera.Nombre_Carrera}
                                </option>
                            ))}
                        </select>
                    </div>

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
