/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/10/2018, 11:00:19 PM
 * @Description:
 */
import * as React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import * as cx from 'classnames';

import {components} from './config';
import SideBar from './SideBar';

import './base.scss';

const genCategory = (key) => ({match}) => (
  <Switch>
    {
      components[key].map(item => (
        <Route
          key={item.path}
          path={`${match.url}/${item.path}`}
          component={item.Component}
        />
      ))
    }
    <Route render={() => (<Redirect to={`${match.url}/${components[key][0].path}`} />)} />
  </Switch>
);

const Example = ({match}) => (
  <div className={cx('demo-example')}>
    <SideBar match={match} />
    <div className={cx('demo-example-content')}>
      <Switch>
        {
          components.categories.map(({path}) => (
            <Route key={path} path={`${match.url}/${path}`} render={genCategory(path)} />
          ))
        }
        <Route render={() => (<Redirect to={`${match.url}/${components.categories[0].path}`} />)} />
      </Switch>
    </div>
  </div>
);

export default Example;

// function toCamel(s: string) {
//   return s[0].toUpperCase() + s.substr(1).replace(/([-_][a-z])/ig, ($1) => {
//     return $1.toUpperCase()
//       .replace('-', '')
//       .replace('_', '');
//   });
  
// };
// const temp = [];
// components.categories.forEach(category => {
//   const c = {
//     id: category.path,
//     name: category.label.cn,
//     list: []
//   };
//   const {list} = c;
//   temp.push(c);
//   components[category.path].forEach(({path, label}) => {
//     list.push({
//       id: path,
//       name: label.cn,
//       pathFromHomepage: `../Sein.js/demo/pages/example/${toCamel(category.path)}/${toCamel(path)}/MainScript.ts`
//     });
//   });
// });
// console.log(JSON.stringify(temp, null, 2).replace(/"(\S+)":/g, '$1:').replace(/"/g, "'"));
