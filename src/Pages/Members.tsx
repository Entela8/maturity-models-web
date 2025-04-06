import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../Stores';
import HeaderMenu from '../Components/HeaderMenu';

const Members = () => {
    const navigate = useNavigate();

     return (
          <>
               <HeaderMenu headerText={"Members"}  />
               <h1> Members </h1>
          </>
     );
};

export default Members;