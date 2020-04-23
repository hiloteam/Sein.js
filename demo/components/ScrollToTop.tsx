/**
 * @File   : ScrollToTop.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/3/2018, 3:49:41 PM
 * @Description:
 */
import {Component} from 'react';
import {withRouter} from 'react-router-dom';

class ScrollToTop extends Component<any> {

  public componentDidUpdate(prevProps: any) {
    const {hash} = window.location;

    if (hash) {
      // Push onto callback queue so it runs after the DOM is updated,
      // this is required when navigating from a different page so that
      // the element is rendered on the page before trying to getElementById.
      setTimeout(
        () => {
          const id = hash.replace('#', '');
          const element = document.getElementById(id);

          if (element) {
            element.scrollIntoView();
          }
        },
        0
      );
    } else {
      if (this.props.location !== prevProps.location) {
        window.scrollTo(0, 0);
      }
    }
  }

  public render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
