/**
 * @File   : index.tsx
 * @Author : 瞬光 (shunguang.dty@antfin.com)
 * @Date   : 2/15/2019, 7:30:15 PM
 * @Description:
 */
import * as React from 'react';
import * as cx from 'classnames';
import axios from 'axios';
import {Switch, Route, Redirect} from 'react-router-dom';

import config from './config';
import Markdown from 'components/Markdown';
import SideBar from './SideBar';

import './base.scss';

interface IPropTypes {
  category: string;
  page: string;
}

interface IStateTypes {
  content: string;
}

class GuideContent extends React.PureComponent<IPropTypes, IStateTypes> {
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

    const mdUrl = getStaticAssetUrl(`/assets/guides/${category}/${page}.md`);
    const {data: content} = await axios.get(mdUrl);

    this.setState({content});

    document.querySelector('.demo-guide').scrollTo(0, 0);
  }

  public render() {
    return (
      <Markdown
        anchorParent={'.demo-guide'}
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
          component={() => <GuideContent category={key} page={item.path} />}
        />
      ))
    }
    <Route render={() => (<Redirect to={`${match.url}/${config[key][0].path}`} />)} />
  </Switch>
);

const Guide = ({match}) => (
  <div className={cx('demo-guide')}>
    <SideBar match={match} />
    <div className={cx('demo-guide-content')}>
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

export default Guide;
