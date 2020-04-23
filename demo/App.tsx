/**
 * @File   : App.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/25 下午3:57:38
 * @Description:
 */
import * as React from 'react';
import * as cx from 'classnames';
import {Route, Switch, Redirect} from 'react-router-dom';
import 'hana-ui/hana-style.scss';

import langManager, {languages} from './i18n';
import Topbar from './components/Topbar';
import Song from './pages/song';
import Overview from './pages/overview';
import Example from './pages/example';
import Document from './pages/document';
import Tutorial from './pages/tutorial';
import Guide from './pages/guide';
import Extension from './pages/extension';
import Production from './pages/production';
import Team from './pages/team';
import Future from './pages/future';

import './base.scss';

export default class App extends React.Component<any, any> {
  private handleChangeLang = lang => {
    const path = this.context.router.route.location.pathname.split(/\//g);
    path[1] = lang;

    this.context.router.history.push(path.join('/'));
  };

  public render() {
    return (
      <Switch>
        {
          languages.map(({value: lang}) => (
            <Route key={lang} path={`/${lang}`} render={this.renderLang} />
          ))
        }
        <Route render={() => (<Redirect to={languages[0].value} />)} />
      </Switch>
    );
  }

  private renderLang = ({match}) => {
    langManager.lang = match.url.substr(1);

    return (
      <React.Fragment>
        <div className={cx('demo-bg')} />
        <Topbar onChangeLang={this.handleChangeLang} />
        <div className={cx('demo-content')}>
          <Switch>
            <Route path={`${match.url}/song`} component={Song} />
            <Route path={`${match.url}/overview`} component={Overview} />
            <Route path={`${match.url}/tutorial/:mode?/:page?`} component={Tutorial} />
            <Route path={`${match.url}/guide`} component={Guide} />
            <Route path={`${match.url}/document`} component={Document} />
            <Route path={`${match.url}/example`} component={Example} />
            <Route path={`${match.url}/production`} component={Production} />
            <Route path={`${match.url}/extension`} component={Extension} />
            <Route path={`${match.url}/team`} component={Team} />
            <Route render={() => (<Redirect to={`${match.url}/overview`} />)} />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}
