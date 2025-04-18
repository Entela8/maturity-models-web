import React from "react";
import { Card } from "@mui/material";
import { Session } from "../Utils/Types/session";

interface SessionCardProps {
     session: Session;
     style?: React.CSSProperties;
     onClick?: () => void;
     disabled?: boolean;
   }
   
   const SessionCard: React.FC<SessionCardProps> = ({ session, style, onClick, disabled }) => {
      const date = new Date(session.date);

      const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',  
      }).format(date);
      
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
            <h3>{formattedDate}</h3>
            <h3>{"Session ID: " +session.id}</h3>
            <h3>{"Team ID: " + session.teamId}</h3>
          </div>
        </Card>
      );
};

export default SessionCard;
