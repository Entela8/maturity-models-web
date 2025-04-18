import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStores } from "../../Stores";
import {
  CircularProgress
} from "@mui/material";
import HeaderMenu from "../../Components/HeaderMenu";
import { Session } from "../../Utils/Types/session";
import SessionCard from "../../Components/SessionCard";
import { Role } from "../../Utils/Types/role";

const SessionListView = () => {
     const [loading, setLoading] = useState<boolean>(false);
     const [sessions, setSessions] = useState<Session[]>([]);
     const navigate = useNavigate();
     const { userStore, apiStore } = useStores();
     const teamId = userStore.user?.team;

     useEffect(() => {
          if (userStore.user?.role===Role.MEMBER || userStore.user?.role===Role.TEAM_LEADER){
               getSessionsForTeam();
          }
          if (userStore.user?.role===Role.OWNER || userStore.user?.role===Role.ADMIN){
               getAllSessions()
          }
     // eslint-disable-next-line react-hooks/exhaustive-deps
     }, []);

     const getSessionsForTeam = async (teamIdAdmin?: string) => {
          setLoading(true);
          const teamIdToSend = teamId ?? teamIdAdmin
          try {
            const data = await apiStore.get(`sessions/team/${teamIdToSend}`, {
              Authorization: `Bearer ${userStore.token}`,
            }) as Session[];
            console.dir(data)
            // Keep only deactivated sessions
            const inactiveSessions = data.filter(session => !session.active);
            setSessions(inactiveSessions);
          } catch (error) {
            console.error("Erreur lors de la récupération des sessions :", error);
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
     
               const filteredSessions = data.filter(session => session.active === false);
     
               // Call getSessionsForTeam for each session's teamId
               await Promise.all(
                    filteredSessions.map(session => getSessionsForTeam(session.teamId.toString()))
               );
     
          } catch (error) {
               console.error("Erreur lors de la récupération des sessions ou modèles :", error);
          } finally {
               setLoading(false);
          }
     }
     

     return (
          <>
          {loading && 
          <div className='loading'>
               <CircularProgress />
          </div>
          }

          <HeaderMenu headerText={"Liste des résultats des sessions d'évaluation"} />

          <div className="container-list-view">
               <section className="models-container">  
                    {
                         sessions.length === 0 ? 
                         (
                              <p>Aucune session désactivée trouvée.</p>
                         ) : (
                              sessions.map(session => {
                                   return (
                                   <SessionCard
                                        key={session.id}
                                        session={session}
                                        disabled={false}
                                        onClick={() => navigate(`/results/${session.modelId}/${session.id}`)}
                                        style={{ border: '2px solid gray' }}
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

export default SessionListView;
