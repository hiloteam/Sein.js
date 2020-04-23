/**
 * @File   : MarkdownI18N.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/2/2018, 1:33:52 PM
 * @Description:
 */
import * as React from 'react';
import Markdown from './Markdown';

import langManager, {parseText} from '../i18n';

export interface IPropTypes {
  style?: React.CSSProperties;
  className?: string;
  text: string;
}

export default class MarkdownI18N extends React.PureComponent<IPropTypes, {text: string}> {
  public static defaultProps = {
    text: ''
  };

  public state = {
    text: ''
  };

  public componentWillMount() {
    const {
      text
    } = this.props;

    this.parseText(text);
  }

  public componentWillReceiveProps(nextProps) {
    const {
      text
    } = nextProps;

    this.parseText(text);
  }

  public parseText = text => {
    this.setState({text: parseText(text)[langManager.lang]});
  };

  public render() {
    const {
      style,
      className
    } = this.props;

    const {
      text
    } = this.state;

    return (
      <Markdown
        text={text}
        style={style}
        className={className}
      />
    );
  }
}
