/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/1/2018, 11:03:48 PM
 * @Description:
 */
import * as React from 'react';
import {withRouter} from 'react-router-dom';
import * as cx from 'classnames';
import axios from 'axios';

import './base.scss';

export interface IStateTypes {
  content: string;
}

class Documents extends React.PureComponent<any, IStateTypes> {
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
    const {location, match} = props;
    let url: string = location.pathname.replace(match.url, '');

    if (url[0] === '/') {
      url = url.slice(1);
    }

    if (url && !/.+\.html$/.test(url)) {
      url += '.html';
    }

    if (!url || url === 'index.html') {
      this.props.history.push(`${match.url}/globals.html`);
      return;
    }

    const html: string = (await axios.get(`/assets/documents/${url}`)).data;
    const res = /<body>([\s\S]+)<\/body>/g.exec(html);

    if (!res) {
      return;
    }

    const content = res[1]
      .replace(`<input type="checkbox" id="tsd-filter-inherited" checked />`, `<input type="checkbox" id="tsd-filter-inherited" />`)
      .replace(`<input type="checkbox" id="tsd-filter-only-exported" />`, `<input type="checkbox" id="tsd-filter-only-exported" checked />`);

    await this.initStylesAndScripts();
    this.setState({content});
  }

  private async initStylesAndScripts() {
    return new Promise((resolve) => {  
      if (!document.body.querySelector('#typedoc-script-main')) {
        const tag = document.createElement('script');
        tag.id = 'typedoc-script-main';
        tag.src = '/assets/documents/assets/js/main.js';
        tag.defer = true;
        document.body.appendChild(tag);
      }
  
      if (!document.body.querySelector('#typedoc-script-search')) {
        const tag = document.createElement('script');
        tag.id = 'typedoc-script-search';
        tag.src = '/assets/documents/assets/js/search.js';
        tag.defer = true;
        document.body.appendChild(tag);
      }

      if (!document.body.querySelector('#typedoc-style')) {
        const tag = document.createElement('link');
        tag.id = 'typedoc-style';
        tag.rel = 'stylesheet';
        tag.onload = () => resolve();
        tag.href = '/assets/documents/assets/css/main.css';
        document.body.appendChild(tag);
      } else {
        resolve();
      }
    });
  }

  public componentDidUpdate() {
    const {hash} = this.props.location;
    if (hash) {
      const anchor = document.querySelector(`a[name=${hash.replace('#', '')}]`) as HTMLDivElement;

      if (anchor) {
        document.querySelector('.demo-document').scrollTo(0, anchor.getBoundingClientRect().top);
      }
    }
  }

  public render() {
    return (
      <div className={cx('demo-document')}>
       <div dangerouslySetInnerHTML={{__html: this.state.content}} />
      </div>
    );
  }
}

export default withRouter(Documents);
