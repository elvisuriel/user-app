"use client";

import React, { FC, useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import styles from './RegisterForm.module.css';
import LoginForm from '../login/LoginForm';
import { registerUser, uploadImage } from '@/services/authService';

interface IFormInput {
    username: string;
    lastname: string;
    country: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
    questions: {
        favoriteFood: string;
        favoriteArtist: string;
        favoritePlace: string;
        favoriteColor: string;
    };
    image: FileList;
}

interface RegisterFormProps {
    onLoginClick: () => void;
}

const RegisterForm: FC<RegisterFormProps> = ({ onLoginClick }) => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<IFormInput>();
    const [showLogin, setShowLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const formData = watch();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setLoading(true);

        try {
            let imageUrl = '';

            // Verificar si hay un archivo seleccionado
            if (data.image && data.image.length > 0) {
                const imageFile = data.image[0];
                console.log('Imagen seleccionada:', imageFile);

                // Intentar subir la imagen
                try {
                    imageUrl = await uploadImage(imageFile);
                    console.log('URL de la imagen subida:', imageUrl);
                } catch (uploadError) {
                    console.error('Error al subir la imagen:', uploadError);
                    throw new Error('Error al subir la imagen');
                }
            }

            // Preparar los datos del usuario
            const userData = {
                username: data.username,
                lastname: data.lastname,
                phone: data.phone,
                country: data.country,
                email: data.email,
                password: data.password,
                questions: data.questions,
                image: imageUrl,
            };

            // Registrar al usuario
            const response = await registerUser(userData);
            console.log('Usuario registrado exitosamente:', response);
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        setShowLogin(true);
    };

    if (showLogin) {
        return <LoginForm onRegisterClick={() => setShowLogin(false)} />;
    }

    return (
        <div className={styles.container}>
            <div className={`${styles.imageContainer} hidden md:block`}>
                <img
                    src="https://res.cloudinary.com/dybws2ubw/image/upload/v1724977736/WePlot_jpqsfb.png"
                    alt="Imagen de registro"
                    className={styles.image}
                />
            </div>
            <div className={`${styles.formContainer} mx-20`}>
                <div className={`${styles.imageRegister}`}>
                    <img
                        src="https://res.cloudinary.com/dybws2ubw/image/upload/v1725030213/registrar_qzc5zd.png"
                        alt="Imagen de registro"
                        className={styles.imageRegister}
                    />
                </div>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className={styles.form}>
                        <div className={styles.row}>
                            <div className={styles.column}>
                                <label className={styles.formLabel}>Nombre*</label>
                                <input
                                    {...register("username", { required: true })}
                                    className={styles.inputField}
                                />
                                {errors.username && <p className={styles.error}>Nombre es requerido.</p>}
                            </div>
                            <div className={styles.column}>
                                <label className={styles.formLabel}>Apellido*</label>
                                <input
                                    {...register("lastname", { required: true })}
                                    className={styles.inputField}
                                />
                                {errors.lastname && <p className={styles.error}>Apellido es requerido.</p>}
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.column}>
                                <label className={styles.formLabel}>Email*</label>
                                <input
                                    type="email"
                                    {...register("email", { required: true })}
                                    className={styles.inputField}
                                />
                                {errors.email && <p className={styles.error}>Email es requerido.</p>}
                            </div>
                            <div className={styles.column}>
                                <label className={styles.formLabel}>Teléfono*</label>
                                <input
                                    {...register("phone", { required: true })}
                                    className={styles.inputField}
                                />
                                {errors.phone && <p className={styles.error}>Teléfono es requerido.</p>}
                            </div>
                        </div>

                        <div className={styles.fullRow}>
                            <label className={styles.formLabel}>País*</label>
                            <input
                                {...register("country", { required: true })}
                                className={styles.inputField}
                            />
                            {errors.country && <p className={styles.error}>País es requerido.</p>}
                        </div>

                        <div className={styles.row}>
                            <div className={styles.column}>
                                <label className={styles.formLabel}>Comida favorita*</label>
                                <input
                                    {...register("questions.favoriteFood", { required: true })}
                                    className={styles.inputField}
                                />
                                {errors.questions?.favoriteFood && <p className={styles.error}>Comida favorita es requerida.</p>}
                            </div>
                            <div className={styles.column}>
                                <label className={styles.formLabel}>Artista favorito</label>
                                <input
                                    {...register("questions.favoriteArtist")}
                                    className={styles.inputField}
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.column}>
                                <label className={styles.formLabel}>Lugar favorito</label>
                                <input
                                    {...register("questions.favoritePlace")}
                                    className={styles.inputField}
                                />
                            </div>
                            <div className={styles.column}>
                                <label className={styles.formLabel}>Color favorito</label>
                                <input
                                    {...register("questions.favoriteColor")}
                                    className={styles.inputField}
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.column}>
                                <label className={styles.formLabel}>Contraseña*</label>
                                <input
                                    type="password"
                                    {...register("password", { required: true })}
                                    className={styles.inputField}
                                />
                                {errors.password && <p className={styles.error}>Contraseña es requerida.</p>}
                            </div>
                            <div className={styles.column}>
                                <label className={styles.formLabel}>Confirmar contraseña*</label>
                                <input
                                    type="password"
                                    {...register("confirmPassword", {
                                        required: true,
                                        validate: value =>
                                            value === formData.password || "Las contraseñas no coinciden"
                                    })}
                                    className={styles.inputField}
                                />
                                {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        <div className={styles.fullRow}>
                            <label className={styles.formLabel}>Foto de perfil</label>
                            <input
                                type="file"
                                {...register("image")}
                                accept="image/*"
                                className={styles.inputField}
                            />
                        </div>

                        <div className={`${styles.fullRow} w-48`}>
                            <div>
                                <input type="submit" value="Unirme a WePlot" className={styles.submitButton} />
                            </div>
                        </div>

                        {loading && <p>Subiendo imagen y registrando usuario...</p>}

                        <div className="flex items-center space-x-2">
                            <h1 className="text-black">¿Ya tienes cuenta?</h1>
                            <button
                                type="button"
                                className="text-[#822abf] hover:underline focus:outline-none"
                                onClick={toggleForm}
                            >
                                Iniciar sesión aquí
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
