import { useState, useEffect } from 'react';
import { createUser } from '@services/user.service.js';
import { getCarreras } from '@services/carrera.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import '@styles/modal.css';

const CreateUserModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        correo: '',
        rut: '',
        password: '',
        rolId: '',
        carreraId: ''
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
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userData = {
                ...formData,
                rolId: parseInt(formData.rolId)
            };

            // Solo incluir carreraId si no es "Ninguna" (0)
            if (formData.carreraId && parseInt(formData.carreraId) !== 0) {
                userData.carreraId = parseInt(formData.carreraId);
            }

            const response = await createUser(userData);

            if (response.status === 'Success') {
                showSuccessAlert('¡Éxito!', 'Usuario creado correctamente');
                onSuccess();
            } else {
                showErrorAlert('Error', response.details?.message || 'Error al crear usuario');
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
                        <label htmlFor="password">Contraseña *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            maxLength={26}
                            placeholder="Mínimo 8 caracteres"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rolId">Rol *</label>
                        <select
                            id="rolId"
                            name="rolId"
                            value={formData.rolId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un rol</option>
                            <option value="2">Alumno</option>
                            <option value="3">Profesor</option>
                            <option value="4">Director de Escuela</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="carreraId">Carrera *</label>
                        <select
                            id="carreraId"
                            name="carreraId"
                            value={formData.carreraId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione una carrera</option>
                            <option value="0">Ninguna</option>
                            {carreras.map(carrera => (
                                <option key={carrera.ID_Carrera} value={carrera.ID_Carrera}>
                                    {carrera.Carrera}
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
