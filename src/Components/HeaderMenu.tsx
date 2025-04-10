import { inject, observer } from "mobx-react";
import React, {useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Divider, Drawer, IconButton, Stack } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DevicesIcon from '@mui/icons-material/Devices';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { useStores } from "../Stores";
import { Role } from "../Utils/Types/role";

interface HeaderMenuProps {
     allowBack?: boolean
     headerText: string
}

const HeaderMenu = (observer(({ allowBack, headerText }: HeaderMenuProps) => {
     const {userStore, apiStore} = useStores()
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
                              {userStore.user?.role === Role.OWNER && 
                              <Link to={"/dashboard"} className="navigation-sector-text">
                                   <section className="sector-clients">
                                        <HomeIcon />
                                        <h4>Accueil</h4>
                                   </section>
                              </Link>}


                              <Link to={"/models"} className="navigation-sector-text">
                                   <section className="sector-clients">
                                        <DevicesIcon />
                                        <h4>Maturity Models </h4>
                                   </section>
                              </Link>

                              {
                                   userStore.user?.role !== Role.MEMBER &&
                                   <Link to={"/members"} className="navigation-sector-text">
                                        <section className="sector-clients">
                                             <PersonIcon />
                                             <h4>Members</h4>
                                        </section>
                                   </Link>
                              }
                         </Stack>
                         </div>
                         <div>
                         <section className="sector-clients navigation-sector-text drawer-bottom-align">
                              <SettingsIcon />
                              <Link to={"/profile"} style={{ textDecoration: 'none' }}>
                                   <h4>Paramètres</h4>
                              </Link>
                         </section>
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