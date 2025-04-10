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

export default function ModelView() {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { apiStore, userStore } = useStores();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) 
      getModel(id);
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

  if (loading || !model) {
    return (
      <div style={{display: 'flex', marginTop: 100, justifyContent: 'center'}}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
    <HeaderMenu headerText={model.title} />
    
    <div className="model-qa">
      <Button 
          variant="text" 
          onClick={deleteModel}
          endIcon={
              <img 
                  src="/elements/delete.svg" 
                  alt="Créer" 
                  height={20} 
                  width={20} 
                  style={{ filter: 'invert(1)' }}
              />
          }
      >
          Supprimer le modéle
      </Button>
      {model.questions.map((question) => (
        <div key={question.id}>
          <Card elevation={3} sx={{borderRadius: 5, width: 700}}>
              <CardContent>
                  <h3 style={{textAlign: 'center', fontWeight: 'bold'}}>
                    {question.content}
                  </h3>
                  <Grid2 container spacing={2} alignContent={'center'} justifyContent={'center'}>
                    {question.answers.map((answer) => (
                      <Grid2 key={answer.id}>
                        <Button
                          fullWidth
                          variant="outlined"
                          sx={{
                            textTransform: 'none',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {answer.content}
                        </Button>
                      </Grid2>
                    ))}
                  </Grid2>
              </CardContent>
          </Card>
        </div>
      ))}
    </div>
    </>
  );
}
