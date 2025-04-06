import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Button,
} from "@mui/material";
import { Model } from "../../Utils/Types/model";

export default function ModelView() {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<Model | null>(null);

  useEffect(() => {
    const storedModels = localStorage.getItem("maturityModels");
    if (storedModels) {
      const parsedModels: Model[] = JSON.parse(storedModels);
      const foundModel = parsedModels.find((m) => m.id?.toString() === id);
      if (foundModel) {
        setModel(foundModel);
      }
    }
  }, [id]);

  if (!model) return <Typography>Chargement...</Typography>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {model.title}
          </Typography>
          <List>
            {model.questions.map((question) => (
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
