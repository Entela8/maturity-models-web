import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Alert, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, TextField, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../Stores';
import HeaderMenu from '../Components/HeaderMenu';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { Role } from '../Utils/Types/role';
import PersonIcon from '@mui/icons-material/Person';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const Dashboard = observer(() => {
    const { userStore, apiStore } = useStores();
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [teamName, setTeamName] = useState('');
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    
    if (!userStore.user) {
        navigate('/login');
        return null;
    }

    const role = userStore.user.role;

    const createTeam = async (teamName: string) => {
        setOpenDialog(false);
        setLoading(true);

        try {
            const payload = {
				name: teamName,
			};            

            await apiStore.post(`team/new`,payload ,
                {
                    Authorization: `Bearer ${userStore.token}`,
                },
            )

            setShowSuccess(true);
        } catch (error) {
            toast.error("Erreur dans la creation du team", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            console.error(error)
        } finally {
            setLoading(false);
            setTeamName('');
        }
    }

    return (
        <>
        {loading && 
            <div className='hamburger-div'>
                <CircularProgress />
            </div>
        }
        <HeaderMenu headerText={"Bienvenue, " + userStore.user?.firstName}  />

        <div style={{padding: 20}}>
            <section className='dahshboard-section'>
                <img 
                    src="/elements/logo.svg" 
                    alt="Logo" 
                    height={100}
                    style={{marginBottom: 20}}
                />
                <h3>
                    Vous etes: ({role})
                </h3>

                <div>
                    {role === Role.OWNER && (
                        <div>
                            <Card>
                                <CardContent>
                                    <h3>Gestion des modèles</h3>
                                    <Button 
                                        variant="contained" 
                                        fullWidth 
                                        onClick={() => navigate('/models')}
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
                                                src="/elements/edit.svg" 
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
                            <Card>
                                <CardContent>
                                    <h3>Créer un team</h3>
                                    <Button 
                                        variant="contained" 
                                        fullWidth 
                                        onClick={() => setOpenDialog(true)}
                                        startIcon={
                                            <img 
                                                src="/elements/edit.svg" 
                                                alt="Créer" 
                                                height={20} 
                                                width={20} 
                                                style={{ filter: 'invert(1)' }}
                                            />
                                        }
                                    >
                                        Créer un team
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    
                    {role === Role.TEAM_LEADER && (
                    <div>
                        <Card>
                            <CardContent>
                                <h3>Gérer l'équipe</h3>
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    onClick={() => navigate(`/teams/${userStore.user?.team}`)}
                                    startIcon={ <PersonIcon /> }
                                >
                                    Inviter des membres
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                    )}

                    {(role === Role.TEAM_LEADER || role === Role.MEMBER) && (
                        <div>
                            <Card>
                                <CardContent>
                                    <h3>Voir les modèles</h3>
                                    <Button 
                                        variant="contained" 
                                        fullWidth 
                                        onClick={() => navigate('/models')}
                                        startIcon={<img 
                                            src="/elements/manage.svg" 
                                            alt="Créer" 
                                            height={20} 
                                            width={20} 
                                            style={{ filter: 'invert(1)' }}
                                        />}
                                    >
                                        Accéder aux modèles
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <div>
                        <Card>
                            <CardContent>
                                <h3>Résultats des sessions</h3>
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    onClick={() => navigate('/results')}
                                    startIcon={<ShowChartIcon/>}
                                >
                                    Voir les résultats
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                    <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        slotProps={{
                        paper: {
                            component: 'form',
                            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                                event.preventDefault();
                                if (teamName.trim()) {
                                    createTeam(teamName);
                                }
                            },
                        },
                        }}
                    >
                        <DialogTitle>Créer un nouveau Team</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Créer un nouveau team avec un nom de Team unique.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="name"
                                name="name"
                                label="Team name"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
                            <Button type="submit">Envoyer</Button>
                        </DialogActions>
                    </Dialog>

                    <Snackbar
                            open={showSuccess}
                            autoHideDuration={4000}
                            onClose={() => setShowSuccess(false)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                            <Alert 
                                severity="success" 
                                variant="filled" 
                                onClose={() => setShowSuccess(false)}
                            >
                            Team crée avec succées !
                            </Alert>
                    </Snackbar>

                    <ToastContainer 
                        position="bottom-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick={false}
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                        transition={Bounce}
                    />
                </div>
            </section>
        </div>
        </>
    );
});

export default Dashboard;
