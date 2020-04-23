/**
 * @File   : SideBar.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/2/2018, 3:43:09 PM
 * @Description:
 */
import * as React from 'react';
import * as cx from 'classnames';
import {Link, withRouter} from 'react-router-dom';
import {Menu, SubMenu, MenuItem} from 'hana-ui/dist/seeds/Menu';
import Sidebar from 'hana-ui/dist/seeds/Sidebar';

import {components} from './config';
import langManager from '../../i18n';

const SideBar = ({match, location}) => {
  const lang = langManager.lang;

  return (
    <Sidebar>
      <Menu
        value={location.pathname}
        className={cx('demo-example-sidebar-content')}
        type={'linear'}
        auto
      >
        {
          components.categories.map(({label, path}) => (
            <SubMenu
              title={label[lang]}
              active={new RegExp(`\/${path}\/`).test(location.pathname)}
              key={path}
            >
              {
                components[path].map(item => (
                  <MenuItem
                    value={`${match.url}/${path}/${item.path}`}
                    key={item.path}
                  >
                    <Link to={`${match.url}/${path}/${item.path}`}>{item.label[lang]}</Link>
                  </MenuItem>
                ))
              }
            </SubMenu>
          ))
        }
      </Menu>
    </Sidebar>
  );
};

export default withRouter(SideBar);
