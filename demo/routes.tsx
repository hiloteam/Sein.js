import * as React from 'react';
import {BrowserRouter} from 'react-router-dom';

import App from './App';
import ScrollToTop from './components/ScrollToTop';

const Router = () => (
  <BrowserRouter>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </BrowserRouter>
);

export default Router;
