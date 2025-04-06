import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Button,
  CircularProgress,
  Typography,
  Box,
  Grid2,
} from "@mui/material";
import { Model } from "../../Utils/Types/model";
import { useStores } from "../../Stores";

export default function ModelView() {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { apiStore, userStore } = useStores();

  useEffect(() => {
    if (id) getModel(id);
  }, [id]);

  const getModel = async (modelId: string) => {
    setLoading(true);
    try {
      const data = await apiStore.get(`models/${modelId}`, {
        Authorization: `Bearer ${userStore.token}`,
      }) as Model;
      setModel(data);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération du modèle :", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !model) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="model-qa">
      <h3 className="dashboard-title">
        {model.title}
      </h3>

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
  );
}
