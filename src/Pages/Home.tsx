import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className='home-container'>
            <img 
                src="/elements/logo.svg" 
                alt="Logo" 
                height={150}
                style={{marginBottom: 20}}
            />
            <h1>
                Bienvenue sur la plateforme d'évaluation de maturité
            </h1>
            <h3>
                Évaluez la maturité de vos équipes en utilisant des modèles standards comme Scrum, Agile, Sécurité et bien d'autres.
            </h3>

            <Box mt={4}>
                <Button 
                    className='auth-btn'
                    variant="contained" 
                    color="primary" 
                    sx={{ mx: 2 }} 
                    onClick={() => navigate('/login')}
                >
                    Se connecter
                </Button>
                <Button 
                    className='auth-btn'
                    variant="outlined" 
                    color="primary" 
                    sx={{ mx: 2 }} 
                    onClick={() => navigate('/register')}
                >
                    S'inscrire
                </Button>
            </Box>
        </div>
    );
};

export default Home;