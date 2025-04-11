import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import HeaderMenu from "../../Components/HeaderMenu";

const Members = () => {
    const navigate = useNavigate();


     return (
     <>
         
      <HeaderMenu headerText={"Liste des membres dans votre team"} />

      <div className="container-list-view">
        <Button 
            variant="text" 
            onClick={() => navigate(`/members/add`)}
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
          Ajouter des membres à votre team
        </Button>
        </div>
          
     </>
     );
};

export default Members;