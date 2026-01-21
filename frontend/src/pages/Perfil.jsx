import { useState, useEffect } from 'react';
import { updateUser } from '@services/user.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import '@styles/perfil.css';

const Perfil = () => {
    const user = JSON.parse(sessionStorage.getItem('usuario')) || {};
    const [loading, setLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const esDirectorEscuela = user?.esDirectorEscuela || false;
    const userRole = esDirectorEscuela ? 'Director de Escuela' : user?.tipoUsuario;

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            return showErrorAlert('Error', 'Las nuevas contraseñas no coinciden');
        }

        if (passwords.newPassword.length < 8) {
            return showErrorAlert('Error', 'La nueva contraseña debe tener al menos 8 caracteres');
        }

        setLoading(true);
        try {
            const data = {
                password: passwords.currentPassword,
                newPassword: passwords.newPassword
            };

            const response = await updateUser(data, user.rut);

            if (response.status === 'Success') {
                showSuccessAlert('¡Éxito!', 'Tu contraseña ha sido actualizada correctamente.');
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                showErrorAlert('Error', response.details?.message || response.message || 'Error al actualizar contraseña');
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorAlert('Error', 'No se pudo actualizar la contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="perfil-container main-container">
            <header className="perfil-header">
                <h1>Mi Perfil</h1>
                <p>Gestiona tu información personal y seguridad</p>
            </header>

            <div className="perfil-grid">
                {/* Card de Información Personal */}
                <section className="perfil-card info-card">
                    <div className="card-header">
                        <span className="icon">👤</span>
                        <h2>Información Personal</h2>
                    </div>
                    <div className="card-body">
                        <div className="info-group">
                            <h3 className="group-title">Datos de Identidad</h3>
                            <div className="info-subgrid">
                                <div className="info-item">
                                    <label>Nombre Completo</label>
                                    <p>{user.nombreCompleto}</p>
                                </div>
                                <div className="info-item">
                                    <label>RUT</label>
                                    <p>{user.rut}</p>
                                </div>
                                <div className="info-item">
                                    <label>Correo Electrónico</label>
                                    <p>{user.correo}</p>
                                </div>
                            </div>
                        </div>

                        <div className="info-group">
                            <h3 className="group-title">Vínculo Institucional</h3>
                            <div className="info-subgrid">
                                <div className="info-item">
                                    <label>Tipo de Usuario</label>
                                    <span className="badge-role">{userRole}</span>
                                </div>
                                {user.carrera && (
                                    <div className="info-item">
                                        <label>Carrera</label>
                                        <p>{user.carrera}</p>
                                    </div>
                                )}
                                {user.cargo && !esDirectorEscuela && (
                                    <div className="info-item">
                                        <label>Cargo</label>
                                        <p>{user.cargo}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Card de Seguridad (Cambio de Contraseña) */}
                <section className="perfil-card security-card">
                    <div className="card-header">
                        <span className="icon">🔒</span>
                        <h2>Seguridad</h2>
                    </div>
                    <div className="card-body">
                        <p className="section-desc">Actualiza tu contraseña para mantener tu cuenta segura.</p>
                        <form onSubmit={handleSubmitPassword} className="password-form">
                            <div className="form-group">
                                <label>Contraseña Actual</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwords.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="form-group">
                                <label>Nueva Contraseña</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    placeholder="Min. 8 caracteres"
                                />
                                <div className="password-requirements">
                                    <strong>Requisitos:</strong>
                                    <div className="requirements-list">
                                        <span className={passwords.newPassword.length >= 8 && passwords.newPassword.length <= 26 ? 'valid' : ''}>
                                            {passwords.newPassword.length >= 8 && passwords.newPassword.length <= 26 ? '✓' : '○'} 8-26 caracteres
                                        </span>
                                        <span className={/[A-Z]/.test(passwords.newPassword) ? 'valid' : ''}>
                                            {/[A-Z]/.test(passwords.newPassword) ? '✓' : '○'} Mayúscula
                                        </span>
                                        <span className={/[a-z]/.test(passwords.newPassword) ? 'valid' : ''}>
                                            {/[a-z]/.test(passwords.newPassword) ? '✓' : '○'} Minúscula
                                        </span>
                                        <span className={/[0-9]/.test(passwords.newPassword) ? 'valid' : ''}>
                                            {/[0-9]/.test(passwords.newPassword) ? '✓' : '○'} Número
                                        </span>
                                        <span className={/^[a-zA-Z0-9]*$/.test(passwords.newPassword) && passwords.newPassword.length > 0 ? 'valid' : ''}>
                                            {/^[a-zA-Z0-9]*$/.test(passwords.newPassword) && passwords.newPassword.length > 0 ? '✓' : '○'} Alfanumérico
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Confirmar Nueva Contraseña</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    placeholder="Repite la nueva contraseña"
                                />
                            </div>
                            <button type="submit" className="btn-update" disabled={loading}>
                                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Perfil;
