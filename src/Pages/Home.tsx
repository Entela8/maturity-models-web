import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Modèles de Maturité
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/login')}>Connexion</Button>
                    <Button color="inherit" onClick={() => navigate('/register')}>Inscription</Button>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 8, textAlign: 'center' }}>
                <Typography variant="h3" gutterBottom>
                    Bienvenue sur la plateforme d'évaluation de maturité
                </Typography>
                <Typography variant="h5" color="textSecondary" paragraph>
                    Évaluez la maturité de vos équipes en utilisant des modèles standards comme Scrum, Agile, Sécurité et bien d'autres.
                </Typography>

                <Box mt={4}>
                    <Button variant="contained" color="primary" sx={{ mx: 2 }} onClick={() => navigate('/login')}>
                        Se connecter
                    </Button>
                    <Button variant="outlined" color="primary" sx={{ mx: 2 }} onClick={() => navigate('/register')}>
                        S'inscrire
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default Home;