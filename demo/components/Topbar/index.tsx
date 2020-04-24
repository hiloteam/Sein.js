/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/3/2018, 4:01:38 PM
 * @Description:
 */
import * as React from 'react';
import {Link, withRouter} from 'react-router-dom';
import * as cx from 'classnames';
import {Menu, MenuItem} from 'hana-ui/dist/seeds/Menu';

import langManager, {languages} from '../../i18n';
import './base.scss';

const navs = [
  {
    path: 'overview',
    en: 'Overview',
    cn: '概览',
    icon: 'himawari',
    useATag: false
  },
  {
    path: 'tutorial',
    en: 'Tutorial',
    cn: '开始',
    icon: 'snowflake-o',
    useATag: false
  },
  {
    path: 'guide',
    en: 'Guide',
    cn: '教程',
    icon: 'snowflake-o',
    useATag: false
  },
  {
    path: 'extension',
    en: 'Extensions',
    cn: '扩展',
    icon: 'package',
    useATag: false
  },
  {
    path: 'example',
    en: 'Example',
    cn: '示例',
    icon: 'clover',
    useATag: false
  },
  {
    path: 'document',
    en: 'Document',
    cn: '文档',
    icon: 'log',
    useATag: false
  },
  {
    path: 'production',
    en: 'Production',
    cn: '产品',
    icon: 'package',
    useATag: false
  },
  {
    path: 'team',
    en: 'Team',
    cn: '团队',
    icon: 'users',
    useATag: false
  },
  // {
  //   path: 'future',
  //   en: 'Future',
  //   cn: '规划',
  //   icon: 'users',
  //   useATag: false
  // },
  {
    path: 'https://github.com/hiloteam/Sein.js',
    en: 'Github',
    cn: 'Github',
    icon: 'github',
    useATag: true
  }
];

const NavItem = ({icon, lang, path, useATag, ...name}) => (
  <MenuItem
    value={path}
    className={cx('demo-topbar-item')}
    onClick={() => {}}
  >
    {/* <Icon type={icon} className={cx('demo-topbar-item-icon')} /> */}
    {
      !useATag ? (
        <Link
          className={cx('demo-topbar-item-link')}
          to={`/${lang}/${path}`}
        >
          {name[lang]}
        </Link>
      ) : (
        <a
          className={cx('demo-topbar-item-link')}
          href={path}
          target={'_blank'}
        >
          {name[lang]}
        </a>
      )
    }
  </MenuItem>
);

const Topbar = ({onChangeLang, location, match}) => {
  const lang = langManager.lang;
  const root = location.pathname.split('/')[2];

  return (
    <header
      className={cx(
        'demo-topbar',
        `demo-topbar-${lang}`,
        `demo-topbar-${root}`
      )}
    >
      <div className={cx('demo-topbar-container')}>
        <div className={cx('demo-topbar-left')}>
          <Link
            className={cx('demo-topbar-logo')}
            to={`/${lang}/song`}
          >
            <img
              src={getStaticAssetUrl('/assets/logo.svg')}
              alt={'hana-logo'}
            />
          </Link>
          {/* <Select
            className={cx('demo-topbar-lang')}
            value={lang}
            onChange={onChangeLang}
          >
            {
              languages.map(({value, label}) =>
                <Option value={value} label={label} key={value} />
              )
            }
          </Select> */}
        </div>
          <Menu
            auto
            horizonal
            type={'linear'}
            value={root}
            className={cx('demo-topbar-right')}
          >
            {
              navs.map(conf => (
                <NavItem key={conf.path} {...conf} lang={lang} />
              ))
            }
          </Menu>
      </div>
    </header>
  );
};

export default withRouter(Topbar);
