import React, { FormEvent, useState } from 'react';
import { observer } from 'mobx-react';
import { Alert, Backdrop, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useStores } from '../../Stores';
import { AuthPayload } from '../../Utils/Types/authPayload';


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

			const response = await apiStore.post('auth/login', payload) as AuthPayload;

			if (response) {
				await userStore.setUserFromApiResponse(response); 
				console.log(response);
				navigate('/dashboard');
			} else {
				console.error("Erreur de connexion", response);
			}
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
				<img 
					src="/elements/logo.svg" 
					alt="Logo" 
					height={150}
					style={{marginBottom: 20}}
				/>
				<h2 style={{ fontWeight: 'bold' }}>Portail de connexion Maturity Models</h2>
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

					<div style={{ textAlign: 'center', marginTop: 30 }}>
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
