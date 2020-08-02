/**
 * @File   : Markdown.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/2/2018, 1:32:01 PM
 * @Description:
 */
import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {HashLink as Link} from 'react-router-hash-link';
import * as marked from 'marked';
import * as cx from 'classnames';
import * as highlight from 'highlight.js/lib/highlight';
import * as typescript from 'highlight.js/lib/languages/typescript';
import * as bash from 'highlight.js/lib/languages/bash';
import * as glsl from 'highlight.js/lib/languages/glsl';
import * as cs from 'highlight.js/lib/languages/cs';
import * as json from 'highlight.js/lib/languages/json';
import * as xml from 'highlight.js/lib/languages/xml';
import Icon from 'hana-ui/dist/seeds/Icon';

import './markdown.scss';
import './github.scss';

highlight.registerLanguage('ts', typescript);
highlight.registerLanguage('typescript', typescript);
highlight.registerLanguage('tsx', typescript);
highlight.registerLanguage('js', typescript);
highlight.registerLanguage('bash', bash);
highlight.registerLanguage('txt', bash);
highlight.registerLanguage('shell', bash);
highlight.registerLanguage('glsl', glsl);
highlight.registerLanguage('c#', cs);
highlight.registerLanguage('json', json);
highlight.registerLanguage('xml', xml);

const GUIDE: {
  currentH2: string;
  h2s: string[],
  h3s: {
    [h2: string]: {id: string, text: string}[]
  }
} = {
  currentH2: '',
  h2s: [],
  h3s: {}
};

class MyRenderer extends marked.Renderer {
  public heading(text: string, level: number, raw: string, slugger?: any) {
    if (level === 1) {
      return (super.heading as any)(text, level, raw, slugger);
    }

    text = raw.replace(/#/g, '').replace(/\//g, '');
    let id = text.replace(/[(). ]/g, '-');

    if (level === 2) {
      GUIDE.currentH2 = text;
      GUIDE.h2s.push(text);
      GUIDE.h3s[text] = [];
    } else if (level === 3) {
      if (GUIDE.currentH2) {
        id = GUIDE.currentH2 + '-' + text.replace(/[(). ]/g, '-');
        GUIDE.h3s[GUIDE.currentH2].push({text, id});
      }
    }

    return `<h${level}><a href="#${id}" id="${id}">#</a>${text}</h${level}>`;
  }
}

const renderer = new MyRenderer();

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: (code, lang) => highlight.highlight(lang, code).value,
  renderer
});

export interface IPropTypes {
  style?: React.CSSProperties;
  className?: string;
  text: string;
  anchorParent?: string;
  location: any;
}

export interface IStateTypes {
  text: string;
  anchorID: string;
  openGuides: boolean;
}

class Markdown extends React.PureComponent<IPropTypes, IStateTypes> {
  public static defaultProps = {
    text: '',
    className: 'demo-markdown-element'
  };

  public state: IStateTypes = {
    text: '',
    anchorID: '',
    openGuides: true
  };

  public componentDidMount() {
    this.init(this.props);
  }

  public componentWillReceiveProps(nextProps: IPropTypes) {
    if (this.props.text === nextProps.text) {
      return;
    }

    this.init(nextProps);
  }

  private init(props: IPropTypes) {
    GUIDE.currentH2 = '';
    GUIDE.h2s = [];
    GUIDE.h3s = {};

    const md = props.text.replace(/(\/assets.*?(png|jpg|mp4))/g, (url) => getStaticAssetUrl(url));
    const text = marked(md);
    const {hash} = props.location;
    const anchorID = decodeURIComponent(hash.replace('#', ''));

    this.setState({text, anchorID}, () => {
      const {hash} = this.props.location;
      if (hash) {
        const anchor = document.querySelector(`a#${anchorID}`) as HTMLDivElement;

        if (anchor && this.props.anchorParent) {
          const parent = document.querySelector(this.props.anchorParent);
          setTimeout(() => {
            parent.scrollTo(0, anchor.getBoundingClientRect().top - 64);
          }, 20);
        }
      }
    });
  }

  public componentDidUpdate() {
    // const {hash} = this.props.location;
    // if (hash) {
    //   const anchor = document.querySelector(`a${decodeURIComponent(hash)}`) as HTMLDivElement;

    //   if (anchor && this.props.anchorParent) {
    //     const parent = document.querySelector(this.props.anchorParent);
    //     setTimeout(() => {
    //       parent.scrollTo(0, anchor.getBoundingClientRect().top - 64);
    //     }, 20);
    //   }
    // }
  }

  public render() {
    const {style, className} = this.props;

    const {text} = this.state;

    return (
      <div
        className={cx(className)}
        style={style || {}}
      >
        <div
          className={cx('markdown-body')}
          dangerouslySetInnerHTML={{__html: text}}
        />
        {this.renderGuide()}
      </div>
    );
  }

  private renderGuide() {
    if (!this.props.anchorParent || GUIDE.h2s.length === 0) {
      return null;
    }

    if (!this.state.openGuides) {
      return (
        <div
          className={'markdown-guides-open'}
          onClick={() => this.setState({openGuides: true})}
        >
          <Icon type={'menu'} />
        </div>
      );
    }

    return (
      <ol className={cx('markdown-guides')}>
        <div
          className={'markdown-guides-close'}
          onClick={() => this.setState({openGuides: false})}
        >
          <Icon
            type={'close'}
            size={'large'}
            color={'#000'}
          />
        </div>
        {
          GUIDE.h2s.map(h2 => (
            <React.Fragment key={h2}>
              <li
                className={cx(
                  'markdown-guides-h2',
                  `markdown-guides-anchor${this.state.anchorID === h2 ? '-active' : ''}`
                )}
              >
                <a href={`#${h2}`}>{h2}</a>
              </li>
              {
                GUIDE.h3s[h2].length > 0 && (
                  <ul className={cx('markdown-guides-h3s')}>
                    {
                      GUIDE.h3s[h2].map(({text: h3, id}) => (
                        <li
                          key={h3}
                          className={cx(
                            'markdown-guides-h3',
                            `markdown-guides-anchor${this.state.anchorID === id ? '-active' : ''}`
                          )}
                        >
                          <a href={`#${id}`}>{h3}</a>
                        </li>
                      ))
                    }
                  </ul>
                )
              }
            </React.Fragment>
          ))
        }
      </ol>
    )
  }
}

export default withRouter(Markdown);
