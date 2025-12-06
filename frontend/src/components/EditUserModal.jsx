import { useState, useEffect } from 'react';
import { updateUser } from '@services/user.service.js';
import { getCarreras } from '@services/carrera.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import '@styles/modal.css';

const EditUserModal = ({ user, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        nombreCompleto: user.Nombre_Completo || '',
        correo: user.Correo || '',
        rut: user.Rut || '',
        password: '',
        newPassword: '',
        rolId: user.rol?.ID_Rol || '',
        carreraId: user.carrera?.ID_Carrera || '0',
        vigente: user.Vigente
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
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userData = {
                nombreCompleto: formData.nombreCompleto,
                email: formData.correo,
                rut: formData.rut,
                vigente: formData.vigente,
                rolId: parseInt(formData.rolId)
            };

            // Siempre incluir carreraId (0 para "Ninguna")
            const carreraIdValue = parseInt(formData.carreraId);
            userData.carreraId = carreraIdValue;

            // Solo incluir contraseñas si se proporcionaron
            if (formData.password) {
                userData.password = formData.password;
            }
            if (formData.newPassword) {
                userData.newPassword = formData.newPassword;
            }

            const response = await updateUser(userData, user.Rut);

            if (response && !response.error) {
                showSuccessAlert('¡Éxito!', 'Usuario actualizado correctamente');
                onSuccess();
            } else {
                showErrorAlert('Error', response.details?.message || response.message || 'Error al actualizar usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorAlert('Error', 'No se pudo actualizar el usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Editar Usuario</h2>
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
                            disabled
                            placeholder="12.345.678-9"
                            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                        />
                        <small style={{ color: '#666', fontSize: '0.85em' }}>El RUT no se puede modificar</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña Actual</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            minLength={8}
                            maxLength={26}
                            placeholder="Solo si desea cambiar la contraseña"
                            autoComplete="new-password"
                        />
                        <small style={{ color: '#666', fontSize: '0.85em' }}>Dejar en blanco para mantener la contraseña actual</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">Nueva Contraseña</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            minLength={8}
                            maxLength={26}
                            placeholder="Nueva contraseña"
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
                            <option value="1">Administrador</option>
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

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="vigente"
                                checked={formData.vigente}
                                onChange={handleChange}
                                style={{ width: 'auto', cursor: 'pointer' }}
                            />
                            <span>Usuario activo</span>
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Actualizando...' : 'Actualizar Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
