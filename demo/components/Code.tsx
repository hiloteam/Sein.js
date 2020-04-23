/**
 * @File   : Code.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/2/2018, 2:29:26 PM
 * @Description:
 */
import * as React from 'react';
import * as cx from 'classnames';
import Card from 'hana-ui/dist/burgeon/Card';

import langManager from '../i18n';
import Markdown from './Markdown';

const styles = {
  markdown: {
    overflow: 'auto',
    maxHeight: 480,
    transition: 'max-height .8s ease-in-out',
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
    borderBottom: '1px solid #ddd',
    background: 'transparent'
  }
};

export interface IPropTypes {
  code: string;
  className?: string;
}

export default class CodeView extends React.PureComponent<IPropTypes> {
  public render() {
    const text = `\`\`\`ts
${this.props.code}
    \`\`\``;

    return (
      <Card
        title={langManager.lang === 'cn' ? '源码' : 'Code'}
        className={cx('demo-code', this.props.className)}
        expand
        defaultOpen
      >
        <Markdown
          style={styles.markdown}
          text={text}
        />
      </Card>
    );
  }
}
