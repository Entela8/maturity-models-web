import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Button,
  CircularProgress,
  Grid2,
  DialogActions,
  Dialog,
  DialogContent,
  TextField,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { Model } from "../../Utils/Types/model";
import { useStores } from "../../Stores";
import HeaderMenu from "../../Components/HeaderMenu";
import { Role } from "../../Utils/Types/role";
import Team from "../../Utils/Types/team";

type Mode = "view" | "edit";

export default function ModelView() {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { apiStore, userStore } = useStores();
  const navigate = useNavigate();
  const [openAddTeamDialog, setOpenAddTeamDialog] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);

  const role = userStore.user?.role ?? Role.MEMBER;
  const mode: Mode = role === Role.OWNER ? "view" : "edit";

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [selectedTeam, setSelectedTeam] = useState<number | string>('');
  const sessionId = localStorage.getItem("selectedSessionId");

  useEffect(() => {
    if (id) getModel(id);
    getTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getModel = async (modelId: string) => {
    setLoading(true);
    try {
      const data = await apiStore.get(`models/${modelId}`, {
        Authorization: `Bearer ${userStore.token}`,
      }) as Model;
      setModel(data);
    } catch (error) {
      console.error("Erreur lors de la récupération du modèle :", error);
    } finally {
      setLoading(false);
    }
  };

  const getTeams = async () => {
    setLoading(true);
    try {
      const data = await apiStore.get('team/all', {
        Authorization: `Bearer ${userStore.token}`,
      }) as Team[];
      setTeams(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des équipes :", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteModel = async () => {
    setLoading(true);
    try {
      await apiStore.delete(`models/${id}`, {
        Authorization: `Bearer ${userStore.token}`,
      });
      navigate('/models');
    } catch (error) {
      console.error("Erreur lors de la suppression du modèle :", error);
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const submitResponses = async () => {
  
    const responses = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
      questionId: questionId.toString(),
      answerId: answerId.toString(),
    }));
  
    const payload = {
      sessionId,
      responses,
    };
  
    console.log("Payload à envoyer :", payload);
  
    try {
      const response = await apiStore.post("response/add", payload, {
        Authorization: `Bearer ${userStore.token}`,
      });
  
      console.log("Réponses envoyées avec succès :", response);
      alert("Réponses envoyées !");
    } catch (error) {
      console.error("Erreur lors de l'envoi des réponses :", error);
      alert("Échec de l'envoi des réponses");
    }
  };

  const submitSession = async () => {
    if (!selectedTeam || !id) {
      console.error("L'équipe ou le modèle est manquant");
      return;
    }
  
    try {
      setLoading(true);
      
      const payload = {
        modelId: Number(id),
        teamId: Number(selectedTeam),
      };
  
      const response = await apiStore.post("sessions/activate", payload, {
        Authorization: `Bearer ${userStore.token}`,
      });
  
      console.log("Session activée :", response);
      setOpenAddTeamDialog(false);
    } catch (error) {
      console.error("Erreur lors de l'activation de la session :", error);
    } finally {
      setLoading(false);
    }
  };
  

  if (loading || !model) {
    return (
      <div style={{ display: 'flex', marginTop: 100, justifyContent: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <HeaderMenu headerText={model.title} />

      <div className="model-qa">
        <div className="model-qa">
          {role === Role.OWNER && (
            <>
              <Button
                variant="text"
                onClick={deleteModel}
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
                Supprimer le modèle
              </Button>
              <Button 
                style={{ alignSelf: 'flex-end' }}
                variant="text"
                onClick={() => setOpenAddTeamDialog(true)}
                endIcon={
                  <img 
                    src="/elements/add.svg" 
                    alt="Créer une équipe" 
                    height={20} 
                    width={20} 
                    style={{ filter: 'invert(1)' }}
                  />
                }
              > 
                Ajouter une équipe
              </Button>

              <Dialog open={openAddTeamDialog} onClose={() => setOpenAddTeamDialog(false)}>
                <DialogTitle>Ajouter une équipe</DialogTitle>
                <DialogContent>
                <InputLabel >Equipe</InputLabel>
                  <Select
                    fullWidth
                    variant="standard"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                          style: {
                              backgroundColor: '#202248'
                          },
                      },
                  }}
                  >
                    {loading ? (
                      <MenuItem disabled>Chargement des équipes...</MenuItem>
                    ) : (
                      teams.map((team) => (
                        <MenuItem key={team.id} value={team.id}>
                          {team.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>


                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenAddTeamDialog(false)}>Annuler</Button>
                  <Button onClick={submitSession}>Ajouter</Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </div>

        {model.questions.map((question) => (
          <div key={question.id} style={{ marginBottom: 20 }}>
            <Card elevation={3} sx={{ borderRadius: 5, width: 700 }}>
              <CardContent>
                <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {question.content}
                </h3>
                <Grid2 container spacing={2} alignContent={'center'} justifyContent={'center'}>
                  {question.answers.map((answer) => {
                    const isSelected = selectedAnswers[question.id!] === answer.id;
                    return (
                      <Grid2 key={answer.id}>
                        <Button
                          fullWidth
                          variant={isSelected ? "contained" : "outlined"}
                          color={isSelected ? "primary" : "inherit"}
                          onClick={() => mode === "edit" && question.id !== undefined && answer.id !== undefined && selectAnswer(question.id, answer.id)}
                          disabled={mode === "view"}
                          sx={{
                            textTransform: 'none',
                            whiteSpace: 'nowrap',
                            backgroundColor: mode === "view" ? "#e0e0e0" : undefined,
                            color: mode === "view" ? "#9e9e9e" : undefined,
                            borderColor: mode === "view" ? "#bdbdbd" : undefined,
                            cursor: mode === "view" ? "not-allowed" : "pointer",
                          }}
                        >
                          {answer.content}
                        </Button>
                      </Grid2>
                    );
                  })}
                </Grid2>
              </CardContent>
            </Card>
          </div>
        ))}

        {mode === "edit" && (
          <Button
            variant="contained"
            color="success"
            onClick={submitResponses}
            sx={{ marginTop: 4 }}
          >
            Envoyer les réponses
          </Button>
        )}
      </div>
    </>
  );
}
