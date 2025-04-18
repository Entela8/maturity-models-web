import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ModelDTO } from "../../Utils/Types/model";
import { useStores } from "../../Stores";
import {
  Button,
  CircularProgress
} from "@mui/material";
import ModelCard from "../../Components/ModelCard";
import HeaderMenu from "../../Components/HeaderMenu";
import { Role } from "../../Utils/Types/role";
import { Session } from "../../Utils/Types/session";

const ModelList = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [apiModels, setApiModels] = useState<ModelDTO[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const navigate = useNavigate();
  const { userStore, apiStore } = useStores();
  const teamId = userStore.user?.team;
  const role = userStore.user?.role ?? Role.MEMBER;

  useEffect(() => {
      if (userStore.user?.role === Role.OWNER) {
        getAllSessions();
      }
      getAllModels();
      if (userStore.user?.role !== Role.OWNER && teamId) {
        getSessionsForTeam(teamId);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllModels = async () => {
    setLoading(true);
    try {
      const data = await apiStore.get("models/all", {
        Authorization: `Bearer ${userStore.token}`,
      }) as ModelDTO[];
      setApiModels(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des modèles :", error);
    } finally {
      setLoading(false);
    }
  };

  const getSessionsForTeam = async (teamId: string) => {
    setLoading(true);
    try {
      const data = await apiStore.get(`sessions/team/${teamId}`, {
        Authorization: `Bearer ${userStore.token}`,
      }) as Session[];
      setSessions(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des sessions ou modèles :", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllSessions = async () => {
    setLoading(true);
    try {
      const data = await apiStore.get(`sessions/all`, {
        Authorization: `Bearer ${userStore.token}`,
      }) as Session[];
      setSessions(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des sessions ou modèles :", error);
    } finally {
      setLoading(false);
    }
  }

  const navigateToModelView = (modelId: number) => {
    if (role === Role.OWNER) {
      navigate(`/models/${modelId}`);
    } else {
      const session = sessions.find(s => s.modelId === modelId);
      if (session) {
        localStorage.setItem("selectedSessionId", session.id.toString());
      } else {
        console.warn("Aucune session trouvée pour ce modèle.");
      }
      navigate(`/models/${modelId}`);
    }
  };
  

  return (
    <>
      {loading && 
        <div className='loading'>
          <CircularProgress />
        </div>
      }

      <HeaderMenu headerText={"Liste de modèles de maturité"} />

      <div className="container-list-view">
        {role === Role.OWNER && (
          <Button 
            variant="text" 
            onClick={() => navigate(`/models/create`)}
            endIcon={
              <img 
                src="/elements/create.svg" 
                alt="Créer un modéle" 
                height={20} 
                width={20} 
                style={{ filter: 'invert(1)' }}
              />
            }
          > 
            Créer un modèle
          </Button>
        )}

        <section className="models-container">  
          {
            apiModels.length === 0 ? (
              <p>Aucun modèle disponible.</p>
            ) :
            (
              apiModels.map((model: ModelDTO) => {
              const hasActiveSession = sessions.some(
                session => session.modelId === model.id && session.active
              );
            
              return (
                <ModelCard
                  model={model}
                  disabled={userStore.user?.role === Role.MEMBER && !hasActiveSession}
                  key={model.id}
                  onClick={() => navigateToModelView(model.id ? Number(model.id) : 0)}
                  style={hasActiveSession ? { border: '2px solid green' } : {}}
                />
              );
            })
            
            )
          }
        </section>
      </div>
    </>
  );
};

export default ModelList;
