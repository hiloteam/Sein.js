/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 7/27/2019, 7:18:05 PM
 * @Description:
 */
import * as React from 'react';
import * as cx from 'classnames';
import {Image} from 'hana-ui/dist/seeds/Image'
import Tooltip from 'hana-ui/dist/seeds/Tooltip';

import Footer from 'components/Footer';

import './base.scss';

const PRODUCTIONS = [
  {
    name: '支付宝福满全球',
    onwer: '支付宝',
    cover: 'bftw',
    video: 'https://gw.alipayobjects.com/mdn/rms_eb930c/afts/file/A*4vFmR7z5mIQAAAAAAAAAAABkARQnAQ',
    desc: (
      <p>2020新春红包的福满全球项目，整体绝大部分在3D场景实现，粒子效果也令人惊艳，引入压缩纹理等技术，保证效果的情况下达到了极低的内存开销，是一个里程碑。</p>
    )
  },
  {
    name: '支付宝2020新春首页',
    onwer: '支付宝',
    cover: 'fu2020',
    video: 'https://gw.alipayobjects.com/mdn/rms_eb930c/afts/file/A*RSryRa5v1tIAAAAAAAAAAABkARQnAQ',
    desc: (
      <p>2020新春红包首页的3D模型展示，利用模型压缩、压缩纹理等方案，以及整套工作流，达到了效果、性能、内存的极佳平衡，还提供了<a href='./extension/templates/tabs-switch'>快速实现模板</a>。</p>
    )
  },
  {
    name: '惠星球(全新版本)',
    onwer: '支付宝营销业务',
    cover: 'minestars',
    video: 'https://gw.alipayobjects.com/mdn/rms_eb930c/afts/file/A*JfaxR4viPIgAAAAAAAAAAABkARQnAQ',
    desc: (
      <p>支付宝惠支付旗下长线养成3D游戏，是目前最复杂的3D项目。全新版本的惠星球引入了传统游戏的一些经典玩法，在探索性和自由度上迈出了一大步。</p>
    )
  },
  {
    name: '小鸡登山赛(全新版本)',
    onwer: '蚂蚁庄园',
    cover: 'chickenclimbing',
    video: 'https://gw.alipayobjects.com/mdn/rms_eb930c/afts/file/A*JxQhSo_9_xwAAAAAAAAAAABkARQnAQ',
    desc: (
      <p>全新版本的小鸡登山赛由Sein.js强力驱动，玩法和效果均大幅升级，优秀的效果、出色的手感、平衡的性能、以及合理的彩蛋设计，取得了如潮的好评 。</p>
    )
  },
  {
    name: '这就是街舞',
    onwer: '支付宝x优酷',
    cover: 'hiphop',
    video: 'https://gw.alipayobjects.com/mdn/rms_eb930c/afts/file/A*qtumSYV8_44AAAAAAAAAAABkARQnAQ',
    desc: (
      <p>优酷和支付宝合作的3D项目，使用动捕数据和和音乐结合，利用Sein.js提供的换装功能实现了换装系统，取得了不错的效果。</p>
    )
  },
  {
    name: '3D物料展厅',
    onwer: '支付宝商家业务',
    cover: '3d-materials-gallery',
    video: 'https://gw.alipayobjects.com/mdn/rms_eb930c/afts/file/A*t60iTrRVChkAAAAAAAAAAABkARQnAQ',
    desc: (
      <p>3D物料展厅是一个探索性项目，借由Sein.js强大的开发体系和能力，其将离线烘焙、模型压缩等技术引入了项目中，取得了效果和性能、资源的良好平衡。</p>
    )
  },
  {
    name: '堆堆乐',
    onwer: '蚂蚁庄园',
    cover: 'duiduile',
    video: 'https://gw.alipayobjects.com/mdn/rms_eb930c/afts/file/A*xkYmS7UWHgoAAAAAAAAAAABkARQnAQ',
    desc: (
      <p>一款极有乐趣的休闲游戏，精巧的设计和优质的效果与玩法让人欲罢不能。目前已在多个场景达成过良好的收益，并在不断增加玩法扩展场景。</p>
    )
  },
  {
    name: '2020行业春季大促',
    onwer: '支付宝行业业务',
    cover: 'spring-agreement-2020',
    video: 'https://gw.alipayobjects.com/mdn/rms_eb930c/afts/file/A*qb4SRLwI770AAAAAAAAAAABkARQnAQ',
    desc: (
      <p>2020行业春季大促项目，直接复用五福项目的技术方案，在效果不错的同时，达到了相当的稳定和可靠，为后续3D场景推进打下了坚实基础。</p>
    )
  },
  {
    name: '3D物料展示',
    onwer: '支付宝商家业务',
    cover: '3d-materials-show',
    video: 'https://gw.alipayobjects.com/mdn/rms_eb930c/afts/file/A*d4dxR4DphTAAAAAAAAAAAABkARQnAQ',
    desc: (
      <p>将商家物料和3D技术结合，借由PBR材质，比起传统的照片，能够将物料更加真实地展示给用户，促进用户的购买欲望，已经得到了验证。</p>
    )
  }
];

class Item extends React.Component<
  {
    name: string;
    onwer: string;
    cover: string;
    video?: string;
    desc: JSX.Element;
  },
  {
    hovered: boolean
  }
> {
  public state = {hovered: false};

  public render() {
    const {props, state} = this;
    
    return (
      <div className={cx('demo-production-member')}>
        <div
          className={cx('demo-production-member-cover')}
          onMouseEnter={() => this.setState({hovered: true})}
          onMouseLeave={() => this.setState({hovered: false})}
        >
          {
            props.video && state.hovered ? (
              <video src={props.video} autoPlay={true} poster={getStaticAssetUrl(`/assets/production/${props.cover}.jpg`)} />
            ) : (
              <div style={{backgroundImage: `url(${getStaticAssetUrl('/assets/production/' + props.cover +'.jpg')})`}} />
            )
          }
        </div>
        <h3 className={cx('demo-production-member-header')}>
          {props.name}
          <Tooltip
            color={'white'}
            position={'right'}
            content={
              <Image
                className={cx('demo-production-member-qrcode')}
                src={getStaticAssetUrl(`/assets/production/${props.cover}-qrcode.png`)}
              />
            }
          >
            <img src={getStaticAssetUrl('/assets/production/scan-code.png')} style={{cursor: 'pointer'}} />
          </Tooltip>
        </h3>
        {props.desc}
      </div>
    );
  }
}

export default class Production extends React.Component<{}, {scroll: number}> {
  public state: {scroll: number} = {scroll: 0};
  private members: React.RefObject<HTMLDivElement> = React.createRef();
  private preX: number = 0;

  private handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    event.stopPropagation();

    let x = this.preX + (event.deltaX || event.deltaY) / 50;
    const membersWidth = this.members.current.offsetWidth;
    let maxX = (membersWidth - window.innerWidth * 0.9) / membersWidth;
    if (maxX <= 0) {
      maxX = 0;
    } else {
      maxX *= 100;
    }

    if (x > maxX) {
      x = maxX;
    } else if (x < 0) {
      x = 0;
    }

    this.preX = x;
    this.setState({scroll: x});
  }

  public render() {
    return (
      <div
        className={cx('demo-production')}
        style={{background: `url(${getStaticAssetUrl('/assets/production/bg.png')}`}}
      >
        <div
          className={cx('demo-production-body', 'markdown-body')}
          onWheel={this.handleScroll}
        >
          <div
            className={cx('demo-production-members')}
            style={{transform: `translateX(${this.state.scroll * -1}%)`}}
            ref={this.members}
          >
            {
              PRODUCTIONS.map((props) => (
                <Item key={props.name} {...props} />
              ))
            }
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

