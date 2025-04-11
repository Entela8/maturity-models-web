import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ModelDTO } from "../../Utils/Types/model";
import { useStores } from "../../Stores";
import { Button, CircularProgress } from "@mui/material";
import ModelCard from "../../Components/ModelCard";
import HeaderMenu from "../../Components/HeaderMenu";
import { Role } from "../../Utils/Types/role";

const ModelList = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [apiModels, setApiModels] = useState<ModelDTO[]>([]);
  const navigate = useNavigate();
  const { userStore, apiStore } = useStores();

  const role = userStore.user?.role ?? Role.MEMBER;

  useEffect(() => {
      getModels();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getModels = async () => {
    setLoading(true);
    var data = [] as ModelDTO[];

    try {
        data = await apiStore.get('models/all', {
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
