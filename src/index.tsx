import React from 'react';
import ReactDOM from 'react-dom/client';
import './Styles/fonts.css';
import './Styles/index.css';
import './Styles/responsive.css';
import Navigations from './Navigations/navigations';
import { Provider } from 'mobx-react';
import { rootStore } from './Stores';
import { ThemeProvider } from '@mui/material';
import theme from './Styles/theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider {...rootStore.getStores()}>
      <ThemeProvider theme={theme}>
        <Navigations />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);