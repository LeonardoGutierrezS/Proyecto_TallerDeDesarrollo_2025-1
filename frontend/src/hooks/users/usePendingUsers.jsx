import { useState, useEffect } from 'react';
import { getPendingUsers, approveUser, rejectUser } from '@services/user.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const usePendingUsers = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            const response = await getPendingUsers();
            if (response.status === 'Success') {
                setPendingUsers(response.data);
            }
        } catch (error) {
            console.error('Error al obtener usuarios pendientes:', error);
            showErrorAlert('Error', 'No se pudieron cargar los usuarios pendientes');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            const response = await approveUser(userId);
            if (response.status === 'Success') {
                showSuccessAlert('¡Aprobado!', 'Usuario aprobado correctamente');
                fetchPendingUsers(); // Recargar lista
            } else {
                showErrorAlert('Error', response.details?.message || 'Error al aprobar usuario');
            }
        } catch (error) {
            console.error('Error al aprobar usuario:', error);
            showErrorAlert('Error', 'No se pudo aprobar el usuario');
        }
    };

    const handleReject = async (userId) => {
        try {
            const response = await rejectUser(userId);
            if (response.status === 'Success') {
                showSuccessAlert('Rechazado', 'Usuario rechazado correctamente');
                fetchPendingUsers(); // Recargar lista
            } else {
                showErrorAlert('Error', response.details?.message || 'Error al rechazar usuario');
            }
        } catch (error) {
            console.error('Error al rechazar usuario:', error);
            showErrorAlert('Error', 'No se pudo rechazar el usuario');
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    return {
        pendingUsers,
        loading,
        handleApprove,
        handleReject,
        fetchPendingUsers
    };
};

export default usePendingUsers;
