/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/25 下午3:56:14
 * @Description:
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {AppContainer} from 'react-hot-loader';
import Router from './routes';

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Router />
    </AppContainer>,
    document.getElementById('container')
  );
};

render();

// if (module.hot) {
//   module.hot.accept();
//   render();
// }
