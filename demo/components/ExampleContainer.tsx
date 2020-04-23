/**
 * @File   : ExampleContainer.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/2/2018, 1:07:12 PM
 * @Description:
 */
import * as React from 'react';
import * as cx from 'classnames';
import Card from 'hana-ui/dist/burgeon/Card';

import langManager from '../i18n';
import MarkdownI18N from './MarkdownI18N';
import Code from './Code';

export interface IPropTypes {
  title: {cn: string, en: string};
  desc: string;
  code: string;
  footDesc?: string;
}

function isArray(value: any): value is any[] {
  return !!(value as any[]).push;
}

export default class ExampleContainer extends React.PureComponent<IPropTypes> {
  public ref: React.RefObject<HTMLDivElement> = React.createRef();

  public render() {
    const {
      title,
      code,
      desc,
      footDesc
    } = this.props;

    const {lang} = langManager;

    return (
      <div
        className={cx('example-game-container')}
        ref={this.ref}
      >

        {/* <h2 className={cx('example-game-title')}>{title[lang]}</h2> */}
        {this.renderChildren()}
        <Card
          className={cx('example-game-desc')}
          title={title[lang]}
          expand
          open
        >
          <MarkdownI18N text={desc} />
        </Card>
        <Code
          className={cx('example-game-code')}
          code={code}
        />
        <div className={cx('example-game-desc')}>
          <MarkdownI18N text={footDesc} />
        </div>
      </div>
    );
  }

  private renderChildren() {
    const {children} = this.props;

    // if (isArray(children)) {
    //   return children.map((child, index) => child && (
    //     <div
    //       key={index}
    //       className={cx('example-game-content')}
    //       style={this.state}
    //     >
    //       {child}
    //     </div>  
    //   ));
    // }

    return (
      <div
        className={cx('example-game-content')}
        style={this.state}
      >
        {children}
      </div>
    );
  }
}
