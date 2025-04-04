import { useState } from "react";
import { Button, TextField, Card, CardContent } from "@mui/material";
import { Form } from "../Utils/Types/form";
import { Question } from "../Utils/Types/question";
import { Answer } from "../Utils/Types/answer";

export default function MaturityForm() {
  const [title, setTitle] = useState<string>("");

  const [questions, setQuestions] = useState<Question[]>([
    { id: Date.now(), content: "", answers: [{ id: Date.now(), content: "", score: 0 }] }
  ]);

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].content = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = <K extends keyof Answer>(
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
      { id: Date.now(), content: "", answers: [{ id: Date.now(), content: "", score: 0 }] }
    ]);
  };

  const addAnswer = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers.push({ id: Date.now(), content: "", score: 0 });
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    const model: Form = { id: 0, title, questions };

    // Récupère le token JWT depuis le localStorage
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjb2NvIiwiaWF0IjoxNzQzNDI2MzU4LCJleHAiOjE3NDM0MjcyNTh9.vz-7pfnW8bfqsvd78lKvWVBin4aJoGCPpvIhSYPTkQI";

    if (token) {
      console.log("Token trouvé :", token);
    } else {
      console.log("Aucun token trouvé dans le localStorage.");
    }

    // Effectuer la requête POST avec le token dans l'en-tête Authorization
    const response = await fetch("http://localhost:8080/api/v1/models", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Ajouter le token dans les headers
      },
      body: JSON.stringify(model),
    });

    if (response.ok) {
      alert("Modèle créé avec succès !");
      setTitle("");
      setQuestions([{ id: Date.now(), content: "", answers: [{ id: Date.now(), content: "", score: 0 }] }]);
    } else {
      alert("Échec de la création du modèle. Veuillez vérifier les informations.");
    }
  };

  return (
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
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              />
              {question.answers.map((answer, aIndex) => (
                <div key={answer.id} className="flex gap-2 mt-2">
                  <TextField
                    label="Réponse"
                    value={answer.content}
                    onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value, "content")}
                  />
                  <TextField
                    type="number"
                    label="Score"
                    value={answer.score}
                    onChange={(e) => handleAnswerChange(qIndex, aIndex, Number(e.target.value), "score")}
                  />
                </div>
              ))}
              <Button onClick={() => addAnswer(qIndex)} className="mt-2">Ajouter une Réponse</Button>
            </div>
          ))}
          <Button onClick={addQuestion} className="mt-4">Ajouter une Question</Button>
          <Button onClick={handleSubmit} className="mt-4" variant="contained" color="primary">Créer</Button>
        </CardContent>
      </Card>
    </div>
  );
}
