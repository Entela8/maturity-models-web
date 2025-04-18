import { observer } from "mobx-react";
import React, {useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { Divider, Drawer, IconButton, Stack } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DevicesIcon from '@mui/icons-material/Devices';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { useStores } from "../Stores";
import { Role } from "../Utils/Types/role";
import ShowChartIcon from '@mui/icons-material/ShowChart';

interface HeaderMenuProps {
     allowBack?: boolean
     headerText: string
}

const HeaderMenu = (observer(({ allowBack, headerText }: HeaderMenuProps) => {
     const {userStore} = useStores()
     const [drawerOpen, setdrawerOpen] = useState<boolean>(false);
     const navigate = useNavigate();

     const disconnect = async () => {
          try {
               userStore.disconnect()
          } catch (error) {
               console.error(error)
          }
     }

     return (
          <header>
               <MenuIcon className="hamburger-icon" sx={{ fontSize: 30 }} onClick={() => setdrawerOpen(true)} />
               {
                    allowBack &&
                    <IconButton onClick={() => navigate(-1)}>
                         <ArrowBackIcon sx={{ fontSize: 35, marginLeft: '10px' }}></ArrowBackIcon>
                    </IconButton>
               }
               <h2 style={{ marginLeft: '30px' }}>{headerText}</h2>

               <Drawer
                    anchor={"left"}
                    open={drawerOpen}
                    onClose={() => setdrawerOpen(false)}
               >
                    <div className="drawer-content">
                         <div>
                         <div className="drawer-menu-container">
                              {userStore.user?.firstName.charAt(0).toUpperCase()}
                              {userStore.user?.lastName.charAt(0).toUpperCase()}
                              <h3 style={{ color: "white" }}>{userStore.fullName}</h3>
                         </div>

                         <Stack
                              divider={<Divider orientation="horizontal" sx={{ backgroundColor: "#4A4A95" }} />}
                         >
                              <Link to={"/dashboard"} className="navigation-sector-text">
                                   <section className="sector-clients">
                                        <HomeIcon />
                                        <h4>Accueil</h4>
                                   </section>
                              </Link>
                              {
                              userStore.user?.role === Role.OWNER && 
                                   <Link to={"/teams"} className="navigation-sector-text">
                                        <section className="sector-clients">
                                             <GroupIcon />
                                             <h4>Teams</h4>
                                        </section>
                                   </Link> 
                              }

                              <Link to={"/models"} className="navigation-sector-text">
                                   <section className="sector-clients">
                                        <DevicesIcon />
                                        <h4>Maturity Models </h4>
                                   </section>
                              </Link>
                              <Link to={"/results"} className="navigation-sector-text">
                                   <section className="sector-clients">
                                        <ShowChartIcon />
                                        <h4>Résultats session</h4>
                                   </section>
                              </Link>

                              {
                                   userStore.user?.role === Role.TEAM_LEADER &&
                                   <Link to={`/teams/${userStore.user?.team}`} className="navigation-sector-text">
                                        <section className="sector-clients">
                                             <PersonIcon />
                                             <h4>Members</h4>
                                        </section>
                                   </Link>
                              }
                         </Stack>
                         </div>
                         <div>
                         <section className="sector-clients navigation-sector-text">
                              <LogoutIcon />
                              <div onClick={() => disconnect()} >
                                   <h4>Déconnexion</h4>
                              </div>
                         </section>
                         </div>
                    </div>
               </Drawer>
          </header>
     );
}));

export default HeaderMenu;