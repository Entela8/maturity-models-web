import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar, Alert, TableContainer, TableBody, Table, TableRow, IconButton, TableCell, Avatar, TableHead, Paper } from '@mui/material';
import { useStores } from '../../Stores';
import HeaderMenu from '../../Components/HeaderMenu';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { UserDTO } from '../../Utils/Types/user';
import { useNavigate, useParams } from 'react-router-dom';
import { Role } from '../../Utils/Types/role';
   
const MembersList = observer(() => 
{
     const { id } = useParams<{ id?: string }>();
    	const { userStore, apiStore } = useStores();
     const [loading, setLoading] = useState<boolean>(false);
     const [openDialog, setOpenDialog] = useState<boolean>(false);
     const [members, setMembers] = useState<UserDTO[] | undefined>();
     const [email, setEmail] = useState<string>('');
     const [teamId, setTeamId] = useState<string>(id ?? userStore.user!.team!);
     const [role, setRole] = useState<string>('');

     const [showSuccess, setShowSuccess] = useState<boolean>(false);;

     const navigate = useNavigate();

     useEffect(() => {
          getMembers();
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, []);

     const sendInvitationEmail = async () => {
          if (!email || !teamId) return;
          setOpenDialog(false);
          setLoading(true);

          const payload = {
               email: email,
               role: role
          }
          try {
               await apiStore.post(
                    `team/${teamId}/add-member`,
                    payload,
                    {
                         Authorization: `Bearer ${userStore.token}`,
                    },
               ) as any;

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
               console.error(error);
          } finally {
               setLoading(false);
               setEmail('');
          }
     };

     const getMembers = async () => {
          setLoading(true);

          try {
               const data = await apiStore.get(`team/${teamId}/members`, {
                    Authorization: `Bearer ${userStore.token}`,
               }) as UserDTO[];
          
               setMembers(data);
          } catch (error) {
               console.error("Erreur lors de la récupération des modèles :", error);
          }
          finally {
               setLoading(false);
          }
     };

     const deleteTeam = async () => {
          setLoading(true);
          try {
            await apiStore.delete(`team/${teamId}`, {
              Authorization: `Bearer ${userStore.token}`,
            });
            navigate('/teams');
          } catch (error) {
            console.error("Erreur lors de la suppression du modèle :", error);
          } finally {
            setLoading(false);
          }
        };
      
     if (loading) {
          <div className='loading'>
               <CircularProgress />
          </div>
     }

	return (
		<>
               <HeaderMenu headerText={"Liste des members du Team"} />
               <h1>{userStore.teamId}</h1>

               <div className='member-list-container'>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 40 }}>
                    {userStore.user?.role === Role.OWNER && (
                    <Button
                         variant="outlined"
                         onClick={deleteTeam}
                         endIcon={
                         <img
                         src="/elements/delete.svg"
                         alt="Supprimer"
                         height={20}
                         width={20}
                         style={{ filter: 'invert(1)' }}
                         />
                         }
                    >
                         Supprimer l'équipe
                    </Button>
                    )}
                    {userStore.user?.role !== Role.MEMBER && (
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
                    )}
                    </div>

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
                         <select
                              name='role'
                              required
                              style={{width: '100%'}}
                              onChange={(e) => setRole(e.target.value)}
                              className='login-input'
                         >
                              <option value="">Sélectionnez un rôle</option>
                              {Object.entries(Role)
                                   .filter(([key, value]) => key === 'MEMBER' || key === 'TEAM_LEADER')
                                   .map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                   ))
                              }
                         </select>
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

                    <TableContainer component={Paper}>
                         <Table aria-label='simple table'>
                         <TableHead>
                              <TableRow>
                                   <TableCell
                                        className='table-head-title'
                                   >
                                        ID
                                   </TableCell>
                                   <TableCell
                                        className='table-head-title'
                                   >
                                        Username
                                   </TableCell>
                                   <TableCell
                                        className='table-head-title'
                                   >
                                        Nom
                                   </TableCell>
                                   <TableCell
                                        className='table-head-title'
                                   >
                                        Prénom
                                   </TableCell>
                                   <TableCell
                                        className='table-head-title'
                                   >
                                        Email
                                   </TableCell>
                                   <TableCell
                                        className='table-head-title'
                                   >
                                        Role
                                   </TableCell>
                              </TableRow>
                         </TableHead>
                         <TableBody>
                            {members?.map((member, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                    }}
                                >
                                    <TableCell align='center'>
                                        {member.id}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {member.username}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {member.firstName}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {member.lastName}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {member.email}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {member.role}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                         </Table>
                    </TableContainer>
               </div>
		</>
	);
});

export default MembersList;
