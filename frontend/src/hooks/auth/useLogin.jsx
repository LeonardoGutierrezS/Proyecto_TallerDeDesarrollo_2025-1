import { useState, useEffect } from 'react';

const useLogin = () => {
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [inputData, setInputData] = useState({ email: '', password: '' });

    useEffect(() => {
        if (inputData.email) setErrorEmail('');
        if (inputData.password) setErrorPassword('');
    }, [inputData.email, inputData.password]);

    const errorData = (dataMessage) => {
        // Clear previous errors
        setErrorEmail('');
        setErrorPassword('');
        
        if (dataMessage && dataMessage.dataInfo === 'email') {
            setErrorEmail(dataMessage.message);
        } else if (dataMessage && dataMessage.dataInfo === 'password') {
            setErrorPassword(dataMessage.message);
        } else if (typeof dataMessage === 'string') {
            // Generic error message
            setErrorPassword(dataMessage);
        }
    };

    const handleInputChange = (field, value) => {
        setInputData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const clearErrors = () => {
        setErrorEmail('');
        setErrorPassword('');
    };

    return {
        errorEmail,
        errorPassword,
        inputData,
        errorData,
        handleInputChange,
        clearErrors,
    };
};

export default useLogin;