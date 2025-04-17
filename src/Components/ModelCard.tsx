import React from "react";
import { ModelDTO } from "../Utils/Types/model";
import { Card } from "@mui/material";

interface ModelCardProps {
     model: ModelDTO;
     style?: React.CSSProperties
     onClick?: () => void;
   }
   
   const ModelCard: React.FC<ModelCardProps> = ({ model, style, onClick }) => {

  return (
     <Card className="model-card" onClick={onClick} style={style}>
          <div>
               <h3>{model.title}</h3>
          </div>
     </Card>
  );
};

export default ModelCard;
