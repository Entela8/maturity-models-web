import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Model } from "../../Utils/Types/model";
import { useStores } from "../../Stores";

const LOCAL_STORAGE_KEY = "maturityModels";

const ModelList = () => {
  const [localModels, setLocalModels] = useState<Model[]>([]);
  const [apiModels, setApiModels] = useState<Model[]>([]);
  const navigate = useNavigate();
  const { userStore } = useStores();

  useEffect(() => {
    const token = userStore.token;
    console.log("Token utilisateur :", token);

    // 🔹 1. Charger les modèles locaux
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

    const fetchModels = async () => {
      if (!token) {
        console.error("Token d'authentification manquant !");
        return;
      }
    
      try {
        const response = await fetch("http://localhost:8080/api/v1/models/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Ton token JWT ici
          },
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur HTTP ${response.status} : ${errorText}`);
        }
    
        const data: Model[] = await response.json();
        setApiModels(data);
        console.log("✅ Modèles API reçus :", data);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des modèles :", error);
      }
    };
    

    fetchModels();
  }, [userStore.token]);

  //Affiche une liste de modèles
  const renderModelList = (models: Model[], source: "local" | "api") => (
    <ul className="space-y-2">
      {models.map((model) => (
        <li
          key={`${source}-${model.id}`}
          className="border p-3 rounded shadow-sm hover:shadow-md transition"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{model.title}</span>
            <button
              className="text-blue-600 hover:underline"
              onClick={() => navigate(`/models/${model.id}`)}
            >
              Voir le modèle
            </button>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modèles de Maturité</h1>

      {/* Section des modèles locaux */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Stockés localement</h2>
        {localModels.length > 0 ? (
          renderModelList(localModels, "local")
        ) : (
          <p className="text-gray-500">Aucun modèle stocké localement.</p>
        )}
      </section>

      <hr className="my-6 border-gray-300" />

      {/* Section des modèles API */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Récupérés depuis la base de données</h2>
        {apiModels.length > 0 ? (
          renderModelList(apiModels, "api")
        ) : (
          <p className="text-gray-500">Aucun modèle disponible depuis l'API.</p>
        )}
      </section>
    </div>
  );
};

export default ModelList;
