import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Card, CardContent, CircularProgress, Box } from "@mui/material";
import { useStores } from '../../Stores';
import { Model } from "../../Utils/Types/model";
import { Question } from "../../Utils/Types/question";
import { Answer } from "../../Utils/Types/answer";
import { isAxiosError } from "axios";

export default function MaturityModel() {
  const { userStore, apiStore } = useStores()
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([
    { id: Date.now(), content: "", answers: [{ id: Date.now(), content: "", score: 1 }] }
  ]);

  const questionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].content = value;
    setQuestions(newQuestions);
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
    setQuestions([
      ...questions,
      { id: Date.now(), content: "", answers: [{ id: Date.now(), content: "", score: 1 }] }
    ]);
  };

  const addAnswer = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers.push({ id: Date.now(), content: "", score: 1 });
    setQuestions(newQuestions);
  };

  const submit = () => {
    const model: Model = { id: Date.now(), title, questions };
    
    createModel(model);
    submitLocalStorage(model);

    navigate("/models");
  };

  const submitLocalStorage = (model: Model) => {
    const existingModels = JSON.parse(localStorage.getItem("maturityModels") || "[]");
    const updatedModels = [...existingModels, model];
    localStorage.setItem("maturityModels", JSON.stringify(updatedModels));
  }

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

          console.log("Payload à envoyer :", payload);

          const response = await apiStore.post('models/new', payload, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
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
      {loading &&       
          <Box className="flex justify-center items-center h-screen">
            <CircularProgress />
          </Box>
      }

      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent>
            <h2 className="text-xl font-bold mb-4">Créer un Modèle de Maturité</h2>
            <TextField fullWidth label="Titre du modèle" value={title} onChange={(e) => setTitle(e.target.value)} />
            {questions.map((question, qIndex) => (
              <div key={question.id} className="mt-4">
                <TextField
                  fullWidth
                  label="Question"
                  value={question.content}
                  onChange={(e) => questionChange(qIndex, e.target.value)}
                />
                {question.answers.map((answer, aIndex) => (
                  <div key={answer.id} className="flex gap-2 mt-2">
                    <TextField
                      label="Réponse"
                      value={answer.content}
                      onChange={(e) => answerChange(qIndex, aIndex, e.target.value, "content")}
                    />
                    <TextField
                      type="number"
                      label="Score"
                      value={answer.score}
                      onChange={(e) => answerChange(qIndex, aIndex, Number(e.target.value), "score")}
                    />
                  </div>
                ))}
                <Button onClick={() => addAnswer(qIndex)} className="mt-2">Ajouter une Réponse</Button>
              </div>
            ))}
            <Button onClick={addQuestion} className="mt-4">Ajouter une Question</Button>
            <Button onClick={submit} className="mt-4" variant="contained" color="primary">Créer</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );

}
