import React, { FormEvent, useState } from 'react';
import { observer } from 'mobx-react';
import { Alert, Backdrop, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useStores } from '../Stores';
import User from '../Utils/Types/user';
import { Role } from '../Utils/Types/role';

const Register = observer(() => {
    const { apiStore } = useStores();
    const [user, setUser] = useState<User>({
        _id: '',
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        role: Role.member,
        lastActivity: new Date(),
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [registerError, setRegisterError] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const attemptRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            await apiStore.post('users/register', user);
            navigate('/login');
        } catch (error) {
            console.error('An error occurred during registration:', error);
            setRegisterError(true);
            setTimeout(() => setRegisterError(false), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Backdrop sx={{ color: '#fff', zIndex: 1 }} open={loading}>
                <CircularProgress color='inherit' />
            </Backdrop>
            <div className='login-container'>
                <h2>
                    Créer un compte
                </h2>
                <form className='login-form' onSubmit={attemptRegister}>
                    <input
                        type='text'
                        name='username'
                        required
                        onChange={handleChange}
                        className='login-input'
                        placeholder='Nom d&apos;utilisateur'
                    />
                    <input
                        type='text'
                        name='firstName'
                        required
                        onChange={handleChange}
                        className='login-input'
                        placeholder='Prénom'
                    />
                    <input
                        type='text'
                        name='lastName'
                        required
                        onChange={handleChange}
                        className='login-input'
                        placeholder='Nom'
                    />
                    <input
                        type='email'
                        name='email'
                        required
                        onChange={handleChange}
                        className='login-input'
                        placeholder='Email'
                    />
                    <select
                        name='role'
                        required
                        onChange={handleChange}
                        className='login-input'
                    >
                        <option value="">Sélectionnez un rôle</option>
                            {Object.entries(Role).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                    </select>
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <button type='submit' className='login-submit-button'>S&apos;inscrire</button>
                    </div>
                </form>

                {registerError && (
                    <div className='alert-message'>
                        <Alert variant='outlined' severity='error'>
                            Une erreur est survenue. Veuillez réessayer ultérieurement.
                        </Alert>
                    </div>
                )}

                <div style={{ margin: '15px', textAlign: 'center' }}>
                    <Link to={'/login'}>Déjà un compte ? Connectez-vous</Link>
                </div>
            </div>
        </>
    );
});

export default Register;
