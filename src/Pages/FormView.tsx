import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, List, ListItem, Button } from "@mui/material";
import { Form } from "../Utils/Types/form";

const API_URL = "http://localhost:8080/api/v1";

export default function FormView() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/models/${id}`)
      .then((response) => response.json())
      .then((data) => setForm(data))
      .catch((error) => console.error("Erreur lors de la récupération du formulaire:", error));
  }, [id]);

  if (!form) return <Typography>Chargement...</Typography>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {form.title}
          </Typography>
          <List>
            {form.questions.map((question) => (
              <ListItem key={question.id} className="flex flex-col">
                <Typography variant="h6">{question.content}</Typography>
                <List className="pl-4">
                  {question.answers.map((answer) => (
                    <ListItem key={answer.id}>
                      <Button variant="outlined">{answer.content}</Button>
                    </ListItem>
                  ))}
                </List>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
}
