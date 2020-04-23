/**
 * @File   : SideBar.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 8/10/2019, 3:43:09 PM
 * @Description:
 */
import * as React from 'react';
import * as cx from 'classnames';
import {Link, withRouter} from 'react-router-dom';
import {Menu, SubMenu, MenuItem} from 'hana-ui/dist/seeds/Menu';
import Sidebar from 'hana-ui/dist/seeds/Sidebar';

import config from './config';
import langManager from '../../i18n';

const SideBar = ({match, location}) => {
  const lang = langManager.lang;
  const prefix = `/${lang}/extension`;

  return (
    <Sidebar>
      <Menu
        value={location.pathname}
        className={cx('demo-example-sidebar-content')}
        type={'linear'}
        auto
      >
        {
          config.categories.map(({label, path}) => (
            <SubMenu
              title={label[lang]}
              active
              key={path}
            >
              {
                config[path].map(item => (
                  <MenuItem
                    value={`${prefix}/${path}/${item.path}`}
                    key={item.path}
                  >
                    <Link to={`${prefix}/${path}/${item.path}`}>{item.label[lang]}</Link>
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
