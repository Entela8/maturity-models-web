import React from 'react';
import { observer } from 'mobx-react';
import { Button, Card, CardContent } from '@mui/material';
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
        <div style={{padding: 20}}>

            <h3 className='dashboard-title'>
                Tableau de bord
            </h3>
            
            <section className='dahshboard-section'>
                <h1>
                    Bienvenue, {userStore.user.username} ({role})
                </h1>

                <div>
                    {role === 'OWNER' && (
                        <div>
                            <Card>
                                <CardContent>
                                    <h3>Gestion des modèles</h3>
                                    <Button 
                                        variant="contained" 
                                        fullWidth onClick={() => navigate('/models')}
                                        startIcon={
                                            <img 
                                                src="/elements/manage.svg" 
                                                alt="Créer" 
                                                height={20} 
                                                width={20} 
                                                style={{ filter: 'invert(1)' }}
                                            />
                                        }
                                    >
                                        Gérer les modèles
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <h3>Créer un nouveau modèle</h3>
                                    <Button 
                                        variant="contained" 
                                        fullWidth onClick={() => navigate('/models/create')}
                                        startIcon={
                                            <img 
                                                src="/elements/create.svg" 
                                                alt="Créer" 
                                                height={20} 
                                                width={20} 
                                                style={{ filter: 'invert(1)' }}
                                            />
                                        }
                                    >
                                        Créer modèle
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    
                    {role === 'TEAM LEADER' && (
                        <>
                            <div>
                                <Card>
                                    <CardContent>
                                        <h3>Gérer l'équipe</h3>
                                        <Button 
                                            variant="contained" 
                                            fullWidth onClick={() => navigate('/team')}
                                        >
                                            Inviter des membres
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                            <div>
                                <Card>
                                    <CardContent>
                                        <h3>Sessions d'évaluation</h3>
                                        <Button 
                                            variant="contained" 
                                            fullWidth onClick={() => navigate('/sessions')}
                                        >
                                            Lancer une session
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                    
                    {role === 'MEMBER' && (
                        <>
                            <div>
                                <Card>
                                    <CardContent>
                                        <h3>Répondre aux questions</h3>
                                        <Button 
                                            variant="contained" 
                                            fullWidth onClick={() => navigate('/questions')}
                                        >
                                            Accéder
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                            <div>
                                <Card>
                                    <CardContent>
                                        <h3>Résultats des sessions</h3>
                                        <Button 
                                            variant="contained" 
                                            fullWidth onClick={() => navigate('/results')}
                                        >
                                            Voir les résultats
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
});

export default Dashboard;
