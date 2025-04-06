import React, { FormEvent, useState } from 'react';
import { observer } from 'mobx-react';
import { Alert, Backdrop, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import user from '../Utils/Types/user';
import axios, { isAxiosError } from 'axios';
import { useStores } from '../Stores';


const Login = (observer(() => 
{
    	const { userStore, apiStore } = useStores()
		const [username, setUsername] = useState<string>();
		const [password, setPassword] = useState<string>();
		const [loading, setLoading] = useState<boolean>(false);
		const [badCredentials, setBadCredentials] = useState<boolean>(false);
		const [loginError, setLoginError] = useState<boolean>(false);

		const navigate = useNavigate();

		const attemptLogin = async (event: FormEvent<HTMLInputElement>) => {
			event.preventDefault();

			setLoading(true);

			try {
				const payload = {
					username: username,
					password: password,
				};

				const user = await apiStore.post('auth/login', payload) as user
				userStore.setUser(user);
				navigate('/dashboard');
			}
			catch (error) {
				if (isAxiosError(error) && error.response?.status === 401) {
					console.error('Unauthorized access. Please check your credentials.');
					setBadCredentials(true)
					setTimeout(() => {
						setBadCredentials(false);
					}, 5000);
				} else {
					console.error('An error occurred during login:', error);

					setLoginError(true);
					setTimeout(() => {
						setLoginError(false);
					}, 5000);
				}
			}
			finally {
				setLoading(false);
			}
			return false;
		};

		return (
			<>
				<Backdrop sx={{ color: '#fff', zIndex: 1 }} open={loading}>
					<CircularProgress color='inherit' />
				</Backdrop>
				<div className='login-container'>
					<h2 style={{ fontWeight: 'bold' }}>Portail de connexion</h2>
					<form className='login-form'>
						<div>
							<input
								type='username'
								required
								onChange={(e) => setUsername(e.target.value)}
								className='login-input'
								placeholder='Username'
							/>
						</div>
						<div>
							<input
								type='password'
								required
								onChange={(e) => setPassword(e.target.value)}
								placeholder='Mot de passe'
								className='login-input'
							/>
						</div>
						<div style={{ margin: '15px' }}>
							<Link to={"/ask-reset-password"}>Mot de passe oublié</Link>
						</div>

						<div style={{ textAlign: 'center' }}>
							<input
								type='submit'
								onClick={(e) => attemptLogin(e)}
								className='login-submit-button'
								value={'Connexion'}
							/>
						</div>
					</form>
				</div>

				{badCredentials &&
					<div className="alert-message">
						<Alert variant="outlined" severity="warning">
							Identifiant ou mot de passe incorrect. Veuillez réessayer.
						</Alert>
					</div>
				}

				{loginError &&
					<div className="alert-message">
						<Alert variant="outlined" severity="error">
							Une erreur est survenue. Veuillez réessayer ultérieurement.
						</Alert>
					</div>
				}
			</>
		);
}));

export default Login;
