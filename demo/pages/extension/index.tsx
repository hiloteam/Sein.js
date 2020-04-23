/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 7/27/2019, 7:18:05 PM
 * @Description:
 */
import * as React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import axios from 'axios';
import * as cx from 'classnames';

import Markdown from 'components/Markdown';
import config from './config';
import SideBar from './SideBar';

import './base.scss';

export interface IPropTypes {
  category: string;
  page: string;
}

export interface IStateTypes {
  content: string
}

class ExtensionContent extends React.PureComponent<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    content: ''
  };

  public componentDidMount() {
    this.loadNextPage(this.props);
  }

  public componentWillReceiveProps(nextProps: IPropTypes) {
    this.loadNextPage(nextProps);
  }

  private async loadNextPage(props: IPropTypes) {
    const {page, category} = props;

    const mdUrl = `/assets/extensions/${category}/${page}.md`;
    const {data: content} = await axios.get(mdUrl);

    this.setState({content});

    document.querySelector('.demo-extension').scrollTo(0, 0);
  }

  public render() {
    return (
      <Markdown
        anchorParent={'.demo-extension'}
        text={this.state.content}
      />
    );
  }
}

const genCategory = (key) => ({match}) => (
  <Switch>
    {
      config[key].map(item => (
        <Route
          key={item.path}
          path={`${match.url}/${item.path}`}
          component={() => <ExtensionContent category={key} page={item.path} />}
        />
      ))
    }
    <Route render={() => (<Redirect to={`${match.url}/${config[key][0].path}`} />)} />
  </Switch>
);

const Extension = ({match}) => (
  <div className={cx('demo-extension')}>
    <SideBar match={match} />
    <div className={cx('demo-extension-content')}>
      <Switch>
        {
          config.categories.map(({path}) => (
            <Route key={path} path={`${match.url}/${path}`} render={genCategory(path)} />
          ))
        }
        <Route render={() => (<Redirect to={`${match.url}/${config.categories[0].path}`} />)} />
      </Switch>
    </div>
  </div>
);

export default Extension;
