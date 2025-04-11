import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Button,
  CircularProgress,
  Grid2,
} from "@mui/material";
import { Model } from "../../Utils/Types/model";
import { useStores } from "../../Stores";
import HeaderMenu from "../../Components/HeaderMenu";
import { Role } from "../../Utils/Types/role";

type Mode = "view" | "edit";

export default function ModelView() {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { apiStore, userStore } = useStores();
  const navigate = useNavigate();

  const role = userStore.user?.role ?? Role.MEMBER;
  const mode: Mode = role === Role.OWNER ? "view" : "edit";

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    if (id) getModel(id);
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

  const deleteModel = async () => {
    setLoading(true);
    try {
      await apiStore.delete(`models/${id}`, {
        Authorization: `Bearer ${userStore.token}`,
      });
      navigate('/models')
    } catch (error) {
      console.error("Erreur lors de la suppression du modèle :", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectAnswer = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmitAnswers = () => {
    const payload = Object.entries(selectedAnswers).map(([question_id, answer_id]) => ({
      question_id: Number(question_id),
      answer_id: answer_id,
    }));
    console.log("Réponses à envoyer :", JSON.stringify(payload, null, 2));
    // tu peux faire un apiStore.post() ici si besoin
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
        {role === 'OWNER' && (
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
        )}

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
                          onClick={() => mode === "edit" && question.id !== undefined && answer.id !== undefined && handleSelectAnswer(question.id, answer.id)}
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
            onClick={handleSubmitAnswers}
            sx={{ marginTop: 4 }}
          >
            Envoyer les réponses
          </Button>
        )}
      </div>
    </>
  );
}
