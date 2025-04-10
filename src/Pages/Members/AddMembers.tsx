import { useState } from "react";
import { Button, TextField, Card, CircularProgress, Stack, Box } from "@mui/material";
import HeaderMenu from "../../Components/HeaderMenu";
import { useStores } from '../../Stores';
import { isAxiosError } from "axios";

export default function AddMembers() {
  const { userStore, apiStore } = useStores();
  const [emails, setEmails] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<boolean[]>([]);

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const validateEmails = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validation = emails.map(email => !emailRegex.test(email));
    setErrors(validation);
    return !validation.includes(true);
  };

  const submitEmails = async () => {
    if (!validateEmails()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      const token = userStore.token;

      if (!token) {
        console.error("Token manquant");
        setLoading(false);
        return;
      }

      const payload = { emails };

      const response = await apiStore.post('emails/send', payload, {
        Authorization: `Bearer ${token}`,
      });

      if (response) {
        console.log("Emails envoyés avec succès :", response);
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        console.error("Non autorisé : token invalide ou expiré");
      } else {
        console.error("Erreur lors de l'envoi des emails :", error);
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

      <HeaderMenu headerText={"Ajouter des membres à votre équipe"} />

      <section className="send-email-section">
        <Card className="send-email-card">
          <Stack spacing={3}>
            {emails.map((email, index) => (
              <TextField
                key={index}
                fullWidth
                label={`Adresse e-mail ${index + 1}`}
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                error={errors[index]}
                helperText={errors[index] ? "Adresse email invalide" : ""}
              />
            ))}

            <Button
              onClick={addEmailField}
              type="button"
              variant="outlined"
              endIcon={
                <img
                  src="/elements/add.svg"
                  alt="Ajouter"
                  height={20}
                  width={20}
                  style={{ filter: "invert(1)" }}
                />
              }
            >
              Ajouter une adresse
            </Button>
          </Stack>
        </Card>

        <Button
          type="submit"
          onClick={submitEmails}
          variant="contained"
          color="primary"
          sx={{ width: "500px", marginTop: "50px" }}
        
        >
        Envoyer
        </Button>
      </section>
    </>
  );
}
