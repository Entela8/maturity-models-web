import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Card, CircularProgress, Stack, Box } from "@mui/material";
import { useStores } from '../../Stores';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Model } from "../../Utils/Types/model";
import { Question } from "../../Utils/Types/question";
import { Answer } from "../../Utils/Types/answer";
import { isAxiosError } from "axios";
import HeaderMenu from "../../Components/HeaderMenu";

export default function MaturityModel() {
  const { userStore, apiStore } = useStores();
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [collapsedQuestions, setCollapsedQuestions] = useState<Record<number, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<{
    title: boolean;
    questions: { content: boolean; answers: boolean[] }[];
  }>({
    title: false,
    questions: [],
  });
  

  const questionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].content = value;
    setQuestions(newQuestions);
  };

  const toggleCollapse = (id: number) => {
    setCollapsedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const answerChange = <K extends keyof Answer>(
    qIndex: number,
    aIndex: number,
    value: Answer[K],
    type: K
  ) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex][type] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    const id = Date.now();
    const newQuestion: Question = {
      id,
      content: "",
      answers: Array.from({ length: 5 }, (_, i) => ({
        id: id + i + 1,
        content: "",
        score: i + 1
      }))
    };
    setQuestions([...questions, newQuestion]);
  };

  const submit = () => {
    let hasError = false;
  
    const newFieldErrors = {
      title: !title.trim(),
      questions: questions.map((q) => ({
        content: !q.content.trim(),
        answers: q.answers.map((a) => !a.content.trim()),
      })),
    };
  
    hasError = newFieldErrors.title || newFieldErrors.questions.some(
      (q) => q.content || q.answers.some((a) => a)
    );
  
    if (hasError) {
      setFieldErrors(newFieldErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  
    setFieldErrors({ title: false, questions: [] });
  
    const model: Model = { id: Date.now(), title, questions };
    createModel(model);
    submitLocalStorage(model);
    navigate("/models");
  };

  const submitLocalStorage = (model: Model) => {
    const existingModels = JSON.parse(localStorage.getItem("maturityModels") || "[]");
    const updatedModels = [...existingModels, model];
    localStorage.setItem("maturityModels", JSON.stringify(updatedModels));
  };

  const createModel = async (model: Model) => {
    setLoading(true);

    try {
      const token = userStore.token;

      if (!token) {
        console.error("Token manquant");
        setLoading(false);
        return;
      }

      const payload = {
        title: model.title,
        questions: model.questions.map((q) => ({
          content: q.content,
          answers: q.answers.map((a) => ({
            content: a.content,
            score: a.score,
          })),
        })),
      };
  
      const response = await apiStore.post('models/new', payload, {
        Authorization: `Bearer ${token}`,
      });

      if (response) {
        console.log("Réponse de l'API :", response);
      } else {
        console.error("Erreur de réponse API", response);
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        console.error('Non autorisé : token invalide ou expiré');
      } else {
        console.error("Erreur lors de l'envoi du modèle :", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div style={{ justifyContent: 'center', alignContent: 'center' }}>
          <CircularProgress />
        </div>
      )}

      <HeaderMenu headerText={"Créer un modèle de maturité"} />

      <section className="create-model-s">
        <Card className="create-model-card">
          <Stack spacing={3}>
            <TextField 
              fullWidth 
              label="Titre du modèle" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              error={fieldErrors.title}
              helperText={fieldErrors.title ? "Le titre est requis." : ""}
            />

            {questions.map((question, qIndex) => {
              const isCollapsed = collapsedQuestions[qIndex] ?? false;

              return (
                <Stack key={question.id} spacing={2} className='create-model-input'>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      fullWidth
                      label={"Question " + (qIndex + 1)}
                      value={question.content}
                      onChange={(e) => questionChange(qIndex, e.target.value)}
                      error={fieldErrors.questions[qIndex]?.content}
                      helperText={fieldErrors.questions[qIndex]?.content ? "La question est requise." : ""}
                    />
                    <ExpandMoreIcon
                      onClick={() => toggleCollapse(qIndex)}
                      sx={{
                        cursor: 'pointer',
                        transform: isCollapsed ? 'rotate(-180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    />

                  </Box>

                  {!isCollapsed && question.answers.map((answer, aIndex) => (
                    <Stack key={answer.id} direction="row" spacing={2}>
                      <TextField
                        fullWidth
                        label={`Réponse ${aIndex + 1}`}
                        value={answer.content}
                        onChange={(e) => answerChange(qIndex, aIndex, e.target.value, "content")}
                        error={fieldErrors.questions[qIndex]?.answers[aIndex]}
                        helperText={fieldErrors.questions[qIndex]?.answers[aIndex] ? "La réponse est requise." : ""}
                      />
                      <TextField
                        type="number"
                        label="Score"
                        value={answer.score}
                        InputProps={{ readOnly: true }}
                      />
                    </Stack>
                  ))}
                </Stack>
              );
            })}

            <Button 
              onClick={addQuestion}
              type="button"
              variant="outlined"
              endIcon={
                <img 
                  src="/elements/add.svg" 
                  alt="Ajouter" 
                  height={20} 
                  width={20} 
                  style={{ filter: 'invert(1)' }}
                />
              }
            >
              Ajouter une Question
            </Button>
          </Stack>
        </Card>

        <Button 
          type="submit"
          onClick={submit} 
          variant="contained" 
          color="primary"
          sx={{ width: '500px', marginTop: '50px' }}
          disabled={questions.length === 0}
          endIcon={
            <img 
              src="/elements/create-model.svg" 
              alt="Créer" 
              height={20} 
              width={20} 
              style={{ filter: 'invert(1)' }}
            />
          }
        >
          Créer
        </Button>

      </section>
    </>
  );
}
