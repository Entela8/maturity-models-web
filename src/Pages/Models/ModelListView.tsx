import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Model, ModelDTO } from "../../Utils/Types/model";
import { useStores } from "../../Stores";
import { LOCAL_STORAGE_KEY } from "../../Utils/variables";
import { CircularProgress } from "@mui/material";
import ModelCard from "./ModelCard";
import HeaderMenu from "../../Components/HeaderMenu";

const ModelList = () => {
  const [localModels, setLocalModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiModels, setApiModels] = useState<ModelDTO[]>([]);
  const navigate = useNavigate();
  const { userStore, apiStore } = useStores();

  useEffect(() => {
      const storedModels = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedModels) {
          try {
              const parsedModels: Model[] = JSON.parse(storedModels);
              setLocalModels(parsedModels);
              console.log("Modèles locaux :", parsedModels);
          } catch (e) {
              console.error("Erreur parsing localStorage :", e);
          }
      }
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
        console.error("❌ Erreur lors de la récupération des modèles :", error);
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
      </div>}
      <HeaderMenu headerText={"Liste de modéles de maturité"} />

      <div className="container-list-view">
  
        {/* Section des modèles API */}
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
