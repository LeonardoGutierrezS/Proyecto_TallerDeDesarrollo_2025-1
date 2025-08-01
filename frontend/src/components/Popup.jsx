import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';
import { useState, useEffect } from 'react';
import { getMarcas, getCategorias, getEstadosAltaBaja } from '@services/equipo.service.js';

export default function Popup({ show, setShow, data, action, type = 'user', isCreate = false }) {
    const userData = data && data.length > 0 ? data[0] : {};
    const [marcas, setMarcas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [estados, setEstados] = useState([]);

    useEffect(() => {
        if (type === 'equipo' && show) {
            fetchEquipoData();
        }
    }, [type, show]);

    const fetchEquipoData = async () => {
        try {
            const [marcasData, categoriasData, estadosData] = await Promise.all([
                getMarcas(),
                getCategorias(), 
                getEstadosAltaBaja()
            ]);
            setMarcas(marcasData);
            setCategorias(categoriasData);
            setEstados(estadosData);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    };

    const handleSubmit = (formData) => {
        action(formData);
    };

    const getUserFields = () => {
        const patternRut = new RegExp(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/);
        return [
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
                placeholder: 'example@gmail.com',
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
                label: "Rol",
                name: "rol",
                fieldType: 'select',
                options: [
                    { value: 'administrador', label: 'Administrador' },
                    { value: 'usuario', label: 'Usuario' },
                ],
                required: true,
                defaultValue: userData.rol || "",
            },
            {
                label: (
                    <span>
                        Nueva contraseña
                        <span className='tooltip-icon'>
                            <img src={QuestionIcon} />
                            <span className='tooltip-text'>Este campo es opcional</span>
                        </span>
                    </span>
                ),
                name: "newPassword",
                placeholder: "**********",
                fieldType: 'input',
                type: "password",
                required: false,
                minLength: 8,
                maxLength: 26,
                pattern: /^[a-zA-Z0-9]+$/,
                patternMessage: "Debe contener solo letras y números",
            }
        ];
    };

    const getEquipoFields = () => {
        return [
            {
                label: "Modelo",
                name: "modelo",
                defaultValue: userData.modelo || "",
                placeholder: 'ThinkPad T14',
                fieldType: 'input',
                type: "text",
                required: true,
                minLength: 2,
                maxLength: 50,
            },
            {
                label: "Número de Serie",
                name: "numeroDeSerie",
                defaultValue: userData.numeroDeSerie || "",
                placeholder: 'ABC123456789',
                fieldType: 'input',
                type: "text",
                required: true,
                minLength: 5,
                maxLength: 30,
            },
            {
                label: "Marca",
                name: "marcaId",
                fieldType: 'select',
                options: marcas.map(marca => ({ value: marca.id, label: marca.nombre })),
                required: true,
                defaultValue: userData.marcaId || (userData.marca && marcas.find(m => m.nombre === userData.marca)?.id) || "",
            },
            {
                label: "Categoría",
                name: "categoriaId",
                fieldType: 'select',
                options: categorias.map(categoria => ({ value: categoria.id, label: categoria.nombre })),
                required: true,
                defaultValue: userData.categoriaId || (userData.categoria && categorias.find(c => c.nombre === userData.categoria)?.id) || "",
            },
            {
                label: "Estado",
                name: "estadoAltaBajaId",
                fieldType: 'select',
                options: estados.map(estado => ({ value: estado.id, label: estado.nombre })),
                required: true,
                defaultValue: userData.estadoAltaBajaId || (userData.estadoAltaBaja && estados.find(e => e.nombre === userData.estadoAltaBaja)?.id) || "",
            },
            {
                label: "Fecha de Alta",
                name: "fechaAltaLab",
                defaultValue: userData.fechaAltaLab ? new Date(userData.fechaAltaLab).toISOString().split('T')[0] : "",
                fieldType: 'input',
                type: "date",
                required: true,
            }
        ];
    };

    const getTitle = () => {
        if (type === 'equipo') {
            return isCreate ? "Agregar equipo" : "Editar equipo";
        }
        return "Editar usuario";
    };

    const getButtonText = () => {
        if (type === 'equipo') {
            return isCreate ? "Agregar equipo" : "Actualizar equipo";
        }
        return "Editar usuario";
    };

    return (
        <div>
            { show && (
            <div className="bg">
                <div className="popup">
                    <button className='close' onClick={() => setShow(false)}>
                        <img src={CloseIcon} />
                    </button>
                    <Form
                        title={getTitle()}
                        fields={type === 'equipo' ? getEquipoFields() : getUserFields()}
                        onSubmit={handleSubmit}
                        buttonText={getButtonText()}
                        backgroundColor={'#fff'}
                    />
                </div>
            </div>
            )}
        </div>
    );
}
