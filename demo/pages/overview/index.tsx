/**
 * @File   : index.tsx
 * @Author : 瞬光 (shunguang.dty@antfin.com)
 * @Date   : 3/22/2019, 1:42:46 PM
 * @Description:
 */
import * as React from 'react';
import * as cx from 'classnames';
import {Link} from 'react-router-dom';

import Footer from '../../components/Footer';

import './base.scss';

const contentList = [
  {
    title: '拥抱标准，引入最佳实践',
    content: '综合引入Web和游戏业界最佳实践。使用标准GlTF格式序列化场景，Unity作为场景编辑器、VSCode作为IDE。集成支持物理、资源管理、事件、玩家、AI等系统，让开发变得简单便捷。',
    icon: 'small'
  },
  {
    title: '渐进式设计',
    content: '不懂游戏编程？没关系，借鉴自UE4的强大Gameplay架构，提供了丰富的模板，可以让你很容易在良好规范中起步，为简单到复杂的项目都找到合适的方案。',
    icon: 'cresendo'
  },
  {
    title: '追求极致效果和性能',
    content: '支持PBR，引入了大量游戏领域技术，比如光照贴图、全局照明。在保证效果优秀的同时，还达到了良好的性能。模型压缩方案、压缩纹理方案，助你最高降低十倍资源大小和运行时内存。',
    icon: 'effect'
  },
  {
    title: '精准定位异常',
    content: '极低崩溃和异常率。纯Typescript编写，并提供了标准异常链系统，能够精确定位异常来源，帮助统一监控埋点，解决埋点监控和后续排查的痛点。',
    icon: 'monitor'
  },
  {
    title: '生态丰富，多平台支持',
    content: '支持Web、小游戏、小程序等多个平台，同时组件化设计带来了强扩展性，HUD、粒子系统、空间音频系统等扩展应有尽有，助你快速上线。经历了亿万级业务验证，保证稳定性。',
    icon: 'stable'
  },
  {
    title: '可靠而专业的团队',
    content: '数位前端、游戏等不同领域的技术专家强强联手，拥有一支既懂Web，也懂游戏的专业团队，能够快速、即时响应解决任何问题。',
    icon: 'team'
  }
]

export interface IStateTypes {}

export default class Overview extends React.PureComponent<any, IStateTypes> {
  private video: React.RefObject<HTMLVideoElement> = React.createRef();

  private handleBannerEnd = () => {
    // console.log('end');
    // this.video.current.currentTime = 6.6;
    // this.video.current.play();
  }

  public render() {
    return (
      <div className={cx('demo-overview')}>
        <div className={cx('demo-overview-banner')}>
          <video
            src={'/assets/overview/banner.mp4'}
            autoPlay
            muted
            loop
            onEnded={this.handleBannerEnd}
            ref={this.video}
          />
          <div className={cx('demo-overview-banner-content')}>
            <div className={cx('demo-overview-buttons')}>
              <Link to={'./tutorial'}>
                立即开始
              </Link>
              <Link to={'./example'}>
                查看示例
              </Link>
            </div>
          </div>
        </div>
        <div className={cx('demo-overview-list-container')}>
          <div className={cx('demo-overview-list')}>
            {
              contentList.map(({title, content, icon}) => (
                <div className={cx('demo-overview-content')} key={title}>
                  <div>
                    <img src={`/assets/overview/${icon}.svg`} />
                  </div>
                  <h2>{title}</h2>
                  <p>{content}</p>
                </div>
              ))
            }
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
