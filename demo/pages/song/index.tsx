/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 6/30/2019, 4:56:55 PM
 * @Description:
 */
import * as React from 'react';
import * as cx from 'classnames';

import Markdown from 'components/Markdown';

import './base.scss';

const song = require('./song.md');

export interface IStateTypes {}

export default class Song extends React.PureComponent<any, IStateTypes> {
  public render() {
    return (
      <div className={cx('demo-song')}>
        <Markdown text={song} />
      </div>
    );
  }
}
