import React from "react";
import { ModelDTO } from "../Utils/Types/model";
import { Card } from "@mui/material";

interface ModelCardProps {
     model: ModelDTO;
     style?: React.CSSProperties;
     onClick?: () => void;
     disabled?: boolean;
   }
   
   const ModelCard: React.FC<ModelCardProps> = ({ model, style, onClick, disabled }) => {
     const handleClick = () => {
       if (disabled) {
         alert("Le modèle n'est pas encore actif");
         return;
       }
   
       if (onClick) {
         onClick();
       }
     };
   
     return (
       <Card
         className={`model-card ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
         onClick={handleClick}
         style={style}
       >
         <div>
           <h3>{model.title}</h3>
         </div>
       </Card>
     );
};

export default ModelCard;
