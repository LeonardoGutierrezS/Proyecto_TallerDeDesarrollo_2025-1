import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import { useState, useEffect } from 'react';
import { getCarreras } from '@services/carrera.service.js';

export default function Popup({ show, setShow, data, action }) {
    const userData = data && data.length > 0 ? data[0] : {};
    const [carreras, setCarreras] = useState([]);

    useEffect(() => {
        const fetchCarreras = async () => {
            const carrerasData = await getCarreras();
            setCarreras(carrerasData);
        };
        if (show) {
            fetchCarreras();
        }
    }, [show]);

    const handleSubmit = (formData) => {
        action(formData);
    };

    const patternRut = new RegExp(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/);
    
    const carreraOptions = carreras.map(carrera => ({
        value: carrera.ID_Carrera,
        label: carrera.Nombre_Carrera
    }));
    return (
        <div>
            { show && (
            <div className="bg">
                <div className="popup">
                    <button className='close' onClick={() => setShow(false)}>
                        <img src={CloseIcon} />
                    </button>
                    <Form
                        title="Editar usuario"
                        fields={[
                            {
                                label: "Nombre completo",
                                name: "nombreCompleto",
                                defaultValue: userData.nombreCompleto || "",
                                placeholder: 'Diego Alexis Salazar Jara',
                                fieldType: 'input',
                                type: "text",
                                required: true,
                                minLength: 15,
                                maxLength: 50,
                                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                patternMessage: "Debe contener solo letras y espacios",
                            },
                            {
                                label: "Correo electrónico",
                                name: "email",
                                defaultValue: userData.email || "",
                                placeholder: 'example@gmail.cl',
                                fieldType: 'input',
                                type: "email",
                                required: true,
                                minLength: 15,
                                maxLength: 30,
                            },
                            {
                                label: "Rut",
                                name: "rut",
                                defaultValue: userData.rut || "",
                                placeholder: '21.308.770-3',
                                fieldType: 'input',
                                type: "text",
                                minLength: 9,
                                maxLength: 12,
                                pattern: patternRut,
                                patternMessage: "Debe ser xx.xxx.xxx-x o xxxxxxxx-x",
                                required: true,
                            },
                            {
                                label: "Tipo de Usuario",
                                name: "codTipoUsuario",
                                fieldType: 'select',
                                options: [
                                    { value: 1, label: 'Administrador' },
                                    { value: 2, label: 'Alumno' },
                                    { value: 3, label: 'Profesor' },
                                    { value: 4, label: 'Director de Escuela' },
                                ],
                                required: true,
                                defaultValue: userData.codTipoUsuario || "",
                            },
                            {
                                label: "Carrera",
                                name: "idCarrera",
                                fieldType: 'select',
                                options: carreraOptions,
                                required: false,
                                defaultValue: userData.idCarrera || userData.ID_Carrera || "",
                            }
                        ]}
                        onSubmit={handleSubmit}
                        buttonText="Editar usuario"
                        backgroundColor={'#fff'}
                    />
                </div>
            </div>
            )}
        </div>
    );
}