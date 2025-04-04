import { useState, useEffect } from "react";
import { Form } from "../Utils/Types/form";
import { Question } from "../Utils/Types/question";
import { Answer } from "../Utils/Types/answer";

const API_URL = "http://localhost:8080/api/v1";

const FormList = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/models`)
      .then((response) => response.json())
      .then((data: Form[]) => setForms(data))
      .catch((error) => console.error("Erreur lors de la récupération des formulaires:", error));
  }, []);

  const fetchQuestions = (formId: number) => {
    fetch(`${API_URL}/questions?modelId=${formId}`)
      .then((response) => response.json())
      .then((data: Question[]) => {
        setQuestions(data);
        setSelectedForm(formId);
      })
      .catch((error) => console.error("Erreur lors de la récupération des questions:", error));
  };

  return (
    <div>
      <h1>Liste des Formulaires</h1>
      <ul>
        {forms.map((form) => (
          <li key={form.id}>
            {form.title}
            <button onClick={() => fetchQuestions(form.id)}>Voir les questions</button>
          </li>
        ))}
      </ul>

      {selectedForm && (
        <div>
          <h2>Questions du formulaire</h2>
          <ul>
            {questions.map((question) => (
              <li key={question.id}>
                <p>{question.content}</p>
                <ul>
                  {question.answers.map((answer) => (
                    <li key={answer.id}>{answer.content}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FormList;