import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../../Stores';
import HeaderMenu from '../../Components/HeaderMenu';
import { Bounce, toast, ToastContainer } from 'react-toastify';

const MembersList = (observer(() => 
{
    	const { userStore, apiStore } = useStores()
     const [loading, setLoading] = useState<boolean>(false);
     const [openDialog, setOpenDialog] = useState<boolean>(false);
     const [email, setEmail] = useState<string>('');
     const [teamId, setTeamId] = useState<string>(userStore.teamId || '');
     const [showSuccess, setShowSuccess] = useState<boolean>(false);

	const navigate = useNavigate();

     const sendInvitationEmail = async () => {
          if (!email || !teamId) return;
          setOpenDialog(false);
          setLoading(true);
          try {

               const response = await apiStore.post(
                    `team/${teamId}/add-mmber`,
                    { email },
                    {
                         Authorization: `Bearer ${userStore.token}`,
                    },
               ) as any;

               if (response.status === 200) {
                    setShowSuccess(true);
               } else {
                    toast.error("Erreur dans l'envoi du mail", {
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
               }
               setShowSuccess(true);
          } catch (error) {
               toast.error("Erreur dans l'envoi du mail", {
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
          } finally {
               setLoading(false);
               setEmail('');
          }
     };

	return (
		<>
               {loading && 
                    <div className='hamburger-div'>
                         <CircularProgress />
                    </div>
               }
               <HeaderMenu headerText={"Liste des members du Team"} />

               <div className='member-list-container'>
                    <Button 
                         style={{alignSelf:'flex-end'}}
                         variant="text" 
                         onClick={() => setOpenDialog(true)}
                         endIcon={
                              <img 
                              src="/elements/add.svg" 
                              alt="Créer un modéle" 
                              height={20} 
                              width={20} 
                              style={{ filter: 'invert(1)' }}
                              />
                         }
                    > 
                         Ajouter un membre
                    </Button>

                    <Dialog
                         open={openDialog}
                         onClose={() => setOpenDialog(false)}
                         slotProps={{
                         paper: {
                              component: 'form',
                              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                                   event.preventDefault();
                                   sendInvitationEmail();
                              },
                         },
                         }}
                    >
                         <DialogTitle>Ajouter un membre à votre Team</DialogTitle>
                         <DialogContent>
                         <DialogContentText>
                              Un email d'invitation va être envoyé à cette adresse.
                         </DialogContentText>
                         <TextField
                              autoFocus
                              required
                              margin="dense"
                              id="email"
                              name="email"
                              label="Adresse email"
                              type="email"
                              fullWidth
                              variant="standard"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                         />
                         <TextField
                              margin="dense"
                              id="teamId"
                              name="teamId"
                              label="Team ID (si différent du vôtre)"
                              type="number"
                              fullWidth
                              variant="standard"
                              value={teamId}
                              onChange={(e) => setTeamId(e.target.value)}
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
                         Invitation envoyée avec succès !
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
		</>
	);
}));

export default MembersList;
