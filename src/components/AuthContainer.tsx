"use client";

import React, { useState } from "react";

import styles from './AuthContainer.module.css';
import LoginForm from "./login/LoginForm";
import RegisterForm from "./register/RegisterForm";

const AuthContainer: React.FC = () => {
    const [showLogin, setShowLogin] = useState(true);  // Mostrar el formulario de inicio de sesión por defecto

    const toggleForm = () => {
        setShowLogin(!showLogin);  // Alterna entre el formulario de inicio de sesión y registro
    };

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img
                    src="https://res.cloudinary.com/dybws2ubw/image/upload/v1724977736/WePlot_jpqsfb.png"
                    alt="Imagen de fondo"
                    className={styles.image}
                />
            </div>
            <div className={styles.formContainer}>
                {showLogin ? (
                    <LoginForm onRegisterClick={toggleForm} />  // Mostrar por defecto
                ) : (
                    <RegisterForm onLoginClick={toggleForm} />
                )}
            </div>
        </div>
    );
};

export default AuthContainer;
