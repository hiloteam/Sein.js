/**
 * @File   : SideBar.tsx
 * @Author : 瞬光 (shunguang.dty@antfin.com)
 * @Date   : 2/15/2019, 7:33:18 PM
 * @Description:
 */
import * as React from 'react';
import * as cx from 'classnames';
import {Link, withRouter} from 'react-router-dom';
import {Menu, MenuItem, SubMenu} from 'hana-ui/dist/seeds/Menu';
import Sidebar from 'hana-ui/dist/seeds/Sidebar';

import config from './config';
import langManager from '../../i18n';

const SideBar = ({match, location}) => {
  const lang = langManager.lang;
  let base = match.url;

  if (match.params.mode) {
    base = base.replace(`/${match.params.mode}`, '');
  }

  if (match.params.page) {
    base = base.replace(`/${match.params.page}`, '');
  }

  return (
    <Sidebar>
      <Menu
        value={match.params.page}
        className={cx('demo-guide-sidebar-content')}
        type={'linear'}
      >
        {
          config.map(({label, path, pages}) => (
            <SubMenu
              title={label[lang]}
              active={new RegExp(`\/${path}\/`).test(location.pathname)}
              key={path}
            >
              {
                pages.map(item => (
                  <MenuItem
                    value={`${base}/${path}/${item.path}`}
                    active={new RegExp(`\/${item.path}`).test(location.pathname)}
                    key={item.path}
                  >
                    <Link to={`${base}/${path}/${item.path}`}>{item.label[lang]}</Link>
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
