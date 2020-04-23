/**
 * @File   : index.tsx
 * @Author : 瞬光 (shunguang.dty@antfin.com)
 * @Date   : 2/15/2019, 7:30:15 PM
 * @Description:
 */
import * as React from 'react';
import * as cx from 'classnames';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

import Markdown from 'components/Markdown';
import SideBar from './SideBar';

import './base.scss';

export interface IStateTypes {
  content: string;
}

class Tutorial extends React.PureComponent<any, IStateTypes> {
  public state: IStateTypes = {
    content: ''
  };

  public componentDidMount() {
    this.loadNextPage(this.props);
  }

  public componentWillReceiveProps(nextProps) {
    this.loadNextPage(nextProps);
  }

  private async loadNextPage(props) {
    const {page, mode} = props.match.params;
    if (!mode || !page) {
      this.props.history.push(`/cn/tutorial/artist/preface`);
      return;
    }

    const mdUrl = `/assets/tutorials/${mode}/${page}.md`;
    const {data: content} = await axios.get(mdUrl);

    this.setState({content});

    document.querySelector('.demo-tutorial').scrollTo(0, 0);
  }

  public render() {
    return (
      <div className={cx('demo-tutorial')}>
        <SideBar match={this.props.match} />
        <div className={cx('demo-tutorial-content')}>
          <Markdown
            anchorParent={'.demo-tutorial'}
            text={this.state.content}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(Tutorial);
