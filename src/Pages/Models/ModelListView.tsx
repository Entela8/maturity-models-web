import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ModelDTO } from "../../Utils/Types/model";
import { useStores } from "../../Stores";
import { Button, CircularProgress } from "@mui/material";
import ModelCard from "./ModelCard";
import HeaderMenu from "../../Components/HeaderMenu";

const ModelList = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [apiModels, setApiModels] = useState<ModelDTO[]>([]);
  const navigate = useNavigate();
  const { userStore, apiStore } = useStores();

  useEffect(() => {
      getModels();
  }, [userStore.token]);

  const getModels = async () => {
    setLoading(true);

    try {
        const data = await apiStore.get('models/all', {
            Authorization: `Bearer ${userStore.token}`,
        }) as ModelDTO[];
    
        setApiModels(data);
    } catch (error) {
        console.error("Erreur lors de la récupération des modèles :", error);
    }
    finally {
        setLoading(false);
    }
  };

  return (
    <>
      {loading && 
        <div style={{alignItems: 'center'}}>
          <CircularProgress />
        </div>
      }
      <HeaderMenu headerText={"Liste de modéles de maturité"} />

      <div className="container-list-view">
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

        <section className="models-container">  
          {apiModels.length === 0 ? (
            <p>Aucun modèle disponible depuis l'API.</p>
          ) : (
            apiModels.map((model: ModelDTO) => (
              <ModelCard
                model={model}
                key={model.id}
                onClick={() => navigate(`/models/${model.id}`)}
              />
            ))
          )}
        </section>
      </div>
    </>
  
  );
};

export default ModelList;
