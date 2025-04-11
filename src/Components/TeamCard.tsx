import React from "react";
import { Card } from "@mui/material";
import Team from "../Utils/Types/team";

interface TeamCardProps {
     team: Team;
     onClick?: () => void;
   }
   
   const TeamCard: React.FC<TeamCardProps> = ({ team, onClick }) => {

  return (
     <Card className="team-card" onClick={onClick}>
          <div>
               <h3>{team.name}</h3>
          </div>
     </Card>
  );
};

export default TeamCard;
