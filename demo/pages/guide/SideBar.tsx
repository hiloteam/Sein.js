/**
 * @File   : SideBar.tsx
 * @Author : 瞬光 (shunguang.dty@antfin.com)
 * @Date   : 2/15/2019, 7:33:18 PM
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
  const prefix = `/${lang}/guide`;

  return (
    <Sidebar>
      <Menu
        value={match.params.page}
        className={cx('demo-guide-sidebar-content')}
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
