import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, TextField,  } from "@mui/material";
import Team from "../../Utils/Types/team";
import TeamCard from "../../Components/TeamCard";
import HeaderMenu from "../../Components/HeaderMenu";
import { useStores } from "../../Stores";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Role } from "../../Utils/Types/role";

const TeamList = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [teamName, setTeamName] = useState('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const navigate = useNavigate();
  const { userStore, apiStore } = useStores();

  useEffect(() => {
      getTeams();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTeams = async () => {
    setLoading(true);

    try {
        const data = await apiStore.get('team/all', {
            Authorization: `Bearer ${userStore.token}`,
        }) as Team[];
    
        setTeams(data);
    } catch (error) {
        console.error("Erreur lors de la récupération des modèles :", error);
    }
    finally {
        setLoading(false);
    }
  };

  const createTeam = async (teamName: string) => {
      setOpenDialog(false);
      setLoading(true);

      try {
          const payload = {
            name: teamName,
          };            

          await apiStore.post(`team/new`,payload ,{Authorization: `Bearer ${userStore.token}`})

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
        console.error(error);
      } finally {
          setLoading(false);
          setTeamName('');
          getTeams();
      }
  }

  return (
    <>
      {loading && 
        <div style={{alignItems: 'center'}}>
          <CircularProgress />
        </div>
      }
      <HeaderMenu headerText={"Liste des teams"} />

      <div className="container-list-view">
        {userStore.user?.role===Role.OWNER &&
          <Button 
               variant="text"
               onClick={() => setOpenDialog(true)}
               endIcon={
                    <img 
                         src="/elements/add.svg" 
                         alt="Ajouter un team" 
                         height={20} 
                         width={20} 
                         style={{ filter: 'invert(1)' }}
                    />
               }
          > 
               Ajouter un team
          </Button>
        }

        <section className="teams-container">  
          {teams.length === 0 ? (
            <p>Aucun team existant.</p>
          ) : (
            teams.map((team: Team) => (
              <TeamCard
                  team={team}
                  key={team.id}
                  onClick={() => navigate(`/teams/${team.id}`)}
              />
            ))
          )}
        </section>

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
    </>
  
  );
};

export default TeamList;
