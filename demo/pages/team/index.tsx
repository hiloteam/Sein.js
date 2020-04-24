/**
 * @File   : index.tsx
 * @Author : 瞬光 (shunguang.dty@antfin.com)
 * @Date   : 3/22/2019, 1:42:46 PM
 * @Description:
 */
import * as React from 'react';
import * as cx from 'classnames';
import {Image} from 'hana-ui/dist/seeds/Image'

import Footer from 'components/Footer';

import './base.scss';

const SEINJS_GROUP = [
  {
    name: '瞬光',
    title: '前端技术专家',
    avatar: getStaticAssetUrl('/assets/contributors/h.png'),
    link: 'https://github.com/dtysky',
    desc: (
      <p>
        Sein.js全局设计和内核开发，Hilo3d核心成员，工具链设计和维护。专攻游戏架构、图形学和性能优化在前端方向的应用，有任何问题可以直接钉钉搜索<b>瞬光</b>联系或者邮箱到
        <a href="mailto:shunguang.dty@antfin.com" target="_blank">shunguang.dty@antfin.com</a>
        或
        <a href="mailto:dtysky@outlook.com" target="_blank">dtysky@outlook.com</a>。
      </p>
    )
  },
  {
    name: '墨川',
    title: '前端技术专家',
    avatar: getStaticAssetUrl('/assets/contributors/mochuan.png'),
    link: 'https://github.com/06wj',
    desc: (
      <p>
        Sein.js渲染层 Hilo3d 的核心成员，以及目前的主要维护者。在WebGL、图形互动领域有多年经验，擅长解决疑难杂症，非常靠谱。我们未来还会就新一代渲染引擎等有更深入的合作。
      </p>
    )
  },
  {
    name: '圆空',
    title: '前端技术专家',
    avatar: getStaticAssetUrl('/assets/contributors/yuankong.png'),
    link: 'https://github.com/steel1990',
    desc: (
      <p>
        Hilo3d团队核心成员，负责了引擎相当部分的开发，设计到各个方面。一手研发了AMC模型压缩技术，解决了模型资源大小的痛点。技术过硬，涉猎广泛，专业可靠。
      </p>
    )
  },
  {
    name: '江成',
    title: '前端技术专家',
    avatar: getStaticAssetUrl('/assets/contributors/jiangcheng.png'),
    link: 'https://github.com/picacure',
    desc: (
      <p>
        Hilo3d团队核心成员，具有游戏行业从业经验，一直致力于探索3D技术在前端场景的可能，争取将更多技术引入Hilo3d，达到更好的效果。
      </p>
    )
  },
  {
    name: '橘西',
    title: '高级体验设计师',
    avatar: getStaticAssetUrl('/assets/contributors/juxi.png'),
    link: 'https://www.behance.net/DraftWang',
    desc: (
      <p>
        专业的3D美术和体验设计，负责了大量3D业务的美术输出，包括但不限于建模、效果研究、素材把控等，在Sein.js的业务落地中具有重要地位。
      </p>
    )
  },
  {
    name: '奇林',
    title: '前端技术专家',
    link: 'https://github.com/chqilin',
    avatar: getStaticAssetUrl('/assets/contributors/qilin.png'),
    desc: (
      <p>
        拥有八年Unity开发经验，擅长在移动平台的性能限制下达到极好的渲染和互动效果，为我们带来了大量的宝贵经验和指导，Sein.js深度用户。
      </p>
    )
  },
  {
    name: '燃然',
    title: '前端技术专家',
    avatar: getStaticAssetUrl('/assets/contributors/ranran.png'),
    desc: (
      <p>
        3D业务的探索推进者和深度实践者，致力于产出精品3D业务，特效方面的一把好手，推出的“堆堆乐”业务破2KW日活，之后将是Sein.js的深度用户。
      </p>
    )
  },
  {
    name: '星微',
    title: '前实习前端工程师',
    avatar: getStaticAssetUrl('/assets/contributors/xingwei.png'),
    link: 'https://github.com/AlchemyZJK',
    desc: (
      <p>
        前支付宝美少女学霸实习生，能力优秀，已经足够独立承担业务，目前负责部分3D业务的开发，以及Sein.js的关键扩展组件开发（比如UI系统）。
      </p>
    )
  },
  {
    name: '冬去',
    title: '前端技术专家',
    avatar: getStaticAssetUrl('/assets/contributors/dongqu.png'),
    desc: (
      <p>
        在Autodesk工作五年，其间积累了丰富的3D图形经验。目前积极寻找Sein.js的业务应用场景，并会加入下一代渲染引擎的建设。
      </p>
    )
  },
  {
    name: '遥清',
    title: '前端技术专家',
    avatar: getStaticAssetUrl('/assets/contributors/yaoqing.png'),
    desc: (
      <p>
        蚂蚁庄园项目主力开发之一，一手打造了“小鸡登山赛”等项目，做出了支付宝端内3D游戏的宝贵实践。将会使用Sein.js打造出更多有趣的作品。
      </p>
    )
  },
  {
    name: '修雷',
    title: '前端技术专家',
    avatar: getStaticAssetUrl('/assets/contributors/xiulei.png'),
    link: 'https://github.com/SevenElement',
    desc: (
      <p>
        饿了么图形互动方面的专家，持续探索互动图形技术、游戏化方向在前端领域的实践，持续推进Sein.js的应用，同时参与Inspector的建设。
      </p>
    )
  },
  {
    name: '战蚂',
    title: '客户端程序',
    avatar: getStaticAssetUrl('/assets/contributors/zhanma.jpg'),
    link: 'https://github.com/wewell',
    desc: (
      <p>
        11年专职游戏开发经验，开发过多款成功产品。熟悉各引擎、插件开发，擅长微端、页游、H5游戏优化
        <a href={'http://www.evil3d.cn'} target="_blank">Evil3d</a>团队成员、<a href={'https://gamua.com/starling/'} target="_blank">Starling</a>中国区贡献者。        
      </p>
    )
  },
  {
    name: '允元',
    title: '客户端程序',
    avatar: getStaticAssetUrl('/assets/contributors/yunyuan.jpg'),
    desc: (
      <p>
        多年unity大型游戏开发经验，长期致力于3D项目的研发。擅长解决性能瓶颈、兼容性瓶颈等各种痛点、槽点。目前主要支持H5游戏开发工作，用于丰富的优化经验。
      </p>
    )
  },
  {
    name: '昆松',
    title: '高级技术专家',
    avatar: getStaticAssetUrl('/assets/contributors/kunsong.jpg'),
    desc: (
      <p>
        负责Unity引擎组和H5技术组，多年自研引擎开发经验。目前从事Unity引擎定制开发与维护，对Sein.js的相关业务的难点提供指导，给出经验方案。
      </p>
    )
  }
];

function getBGRotation(): any {
  const deg = Math.random() * 16 - 8;

  return deg;
}

class TeamMember extends React.Component<
  {
    name: string;
    title?: string;
    avatar: string;
    link?: string;
    desc: JSX.Element;
  },
  {hovered: boolean}
> {
  public state: {hovered: boolean} = {hovered: false};
  private rotation: number = getBGRotation();

  public render() {
    const props = this.props;

    const {link} = props;
    const linkName = link ? link.split('/').pop() : '';

    return (
      <div
        className={cx('demo-contribution-member')}
        style={{background: `url(${getStaticAssetUrl('/assets/contributors/bj.png')}`}}
        onMouseEnter={() => this.setState({hovered: true})}
        onMouseLeave={() => this.setState({hovered: false})}
      >
        <div className={cx('demo-contribution-member-content')}>
          <div
            className={cx('demo-contribution-member-bg')}
            style={{transform: `rotate(${this.state.hovered ? 0 : this.rotation}deg)`}}
          />
          <div className={cx('demo-contribution-member-fg')}>
            <Image
              className={cx('demo-contribution-member-avatar')}
              src={props.avatar}
            />
            <div className={cx('demo-contribution-member-header')}>
              <h3>{props.name}{link && <a className={'demo-contribution-member-link'} href={link} target={'_blank'}>({linkName})</a>}</h3>
              <p>{props.title}</p>
            </div>
            <div className={cx('demo-contribution-member-desc')}>
              {props.desc}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const Team = () => (
  <div className={cx('demo-contribution')}>
    <div className={cx('demo-contribution-body', 'markdown-body')}>
      <div className={cx('demo-contribution-members')}>
        {
          SEINJS_GROUP.map((props) => (
            <TeamMember key={props.name} {...props} />
          ))
        }
        <div className={cx('demo-contribution-member', 'demo-contribution-member-blank')} />
        <div className={cx('demo-contribution-member', 'demo-contribution-member-blank')} />
      </div>
    </div>
    <Footer />
  </div>
);

export default Team;
