/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 7/27/2019, 7:18:05 PM
 * @Description:
 */
import * as React from 'react';
import * as cx from 'classnames';

import Footer from 'components/Footer';
import Markdown from 'components/Markdown';

import './base.scss';

const text = require('./future.md');

export interface IStateTypes {}

export default class Future extends React.PureComponent<any, IStateTypes> {
  public render() {
    return (
      <div className={cx('demo-future')}>
        <Markdown
          anchorParent={'.demo-future'}
          text={text}
        />
        <Footer />
      </div>
    );
  }
}
