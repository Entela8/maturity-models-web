import React, { FormEvent, useState } from 'react';
import { observer } from 'mobx-react';
import { Alert, Backdrop, CircularProgress } from '@mui/material';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useStores } from '../../Stores';
import User from '../../Utils/Types/user';
import { Role } from '../../Utils/Types/role';
import { isAxiosError } from 'axios';

const Register = observer(() => {
    const { apiStore } = useStores();

    const [loading, setLoading] = useState<boolean>(false);
    const [registerError, setRegisterError] = useState<boolean>(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const teamFromUrl = searchParams.get('team')
    const roleFromUrl = searchParams.get('role') as Role;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const [user, setUser] = useState<User>({
        id: undefined,
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: roleFromUrl ?? Role.MEMBER,
        lastActivity: new Date(),
        team: teamFromUrl ?? ''
    });

    const attemptRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const updatedUser = {
                ...user,
                teamId: user.team ? Number(user.team) : null
            };
            console.log(updatedUser);
    
            await apiStore.post('users/register', updatedUser);
            console.dir(user)
            navigate('/login');
        } catch (error) {
            console.error('An error occurred during registration:', error);
            setRegisterError(true);
            
            if (isAxiosError(error)) {
                if (error.response?.status === 400) {
                    console.error('Bad Request: Check your input data.');
                } else if (error.response?.status === 500) {
                    console.error('Server Error: Please try again later.');
                }
            } else {
                console.error('Unknown error occurred during registration.');
            }

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
                <img 
                    src="/elements/logo.svg" 
                    alt="Logo" 
                    height={150}
                    style={{marginBottom: 20}}
                />
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
                    <input
                        type='password'
                        name='password'
                        required
                        onChange={handleChange}
                        className='login-input'
                        placeholder='Mot de passe'
                    />
                    <input
                        type='text'
                        name='teamId'
                        value={user.team}
                        onChange={handleChange}
                        className='login-input'
                        placeholder='Team ID'    
                        readOnly={!!teamFromUrl}
                    />
                    {!roleFromUrl &&
                        <select
                            name='role'
                            required
                            onChange={handleChange}
                            className='login-input'
                        >
                            <option value="">Sélectionnez un rôle</option>
                                {Object.entries(Role).map(([key, value]) => 
                                    (
                                        <option key={key} value={key}>{value}</option>
                                    ))
                                }
                        </select>
                    }
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
