import React from 'react';
import { observer } from 'mobx-react';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../Stores';

const Dashboard = observer(() => {
    const { userStore } = useStores();
    const navigate = useNavigate();

    if (!userStore.user) {
        navigate('/login');
        return null;
    }

    const role = userStore.user.role;

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Tableau de bord
                    </Typography>
                </Toolbar>
            </AppBar>
            
            <Container sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Bienvenue, {userStore.user.username} ({role})
                </Typography>

                <Grid container spacing={3}>
                    {role === 'OWNER' && (
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Gestion des modèles</Typography>
                                    <Button variant="contained" fullWidth onClick={() => navigate('/models')}>Gérer les modèles</Button>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Créer un nouveau modèle</Typography>
                                    <Button variant="contained" fullWidth onClick={() => navigate('/models/create')}>Créer modèle</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                    
                    {role === 'TEAM LEADER' && (
                        <>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">Gérer l'équipe</Typography>
                                        <Button variant="contained" fullWidth onClick={() => navigate('/team')}>Inviter des membres</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">Sessions d'évaluation</Typography>
                                        <Button variant="contained" fullWidth onClick={() => navigate('/sessions')}>Lancer une session</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </>
                    )}
                    
                    {role === 'MEMBER' && (
                        <>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">Répondre aux questions</Typography>
                                        <Button variant="contained" fullWidth onClick={() => navigate('/questions')}>Accéder</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">Résultats des sessions</Typography>
                                        <Button variant="contained" fullWidth onClick={() => navigate('/results')}>Voir les résultats</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Container>
        </>
    );
});

export default Dashboard;
