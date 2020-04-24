/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 7/27/2019, 1:35:08 PM
 * @Description:
 */
import * as React from 'react';
import * as cx from 'classnames';
import Tooltip from 'hana-ui/dist/seeds/Tooltip';
import {Link} from 'react-router-dom';

import './base.scss';

const Footer = () => (
	<div className={cx('demo-footer')}>
		<div className={cx('demo-footer-item')}>
			<h3>友情链接</h3>
			<div>
				<a href={'https://hilo3d.js.org/docs/index.html'} target={'_blank'}>Hilo3d</a>
				<a href={'http://tinyjs.net'} target={'_blank'}>Tiny.js</a>
			</div>
		</div>

		<div className={cx('demo-footer-item')}>
			<h3>帮助反馈</h3>
			<div>
				<Tooltip
					color={'#0D1A26'}
					position={'top'}
					content={(
						<div>
							<p style={{fontSize: 14, lineHeight: '22px'}}>若无法加入请联系微信：dtysky</p>
							<img src={getStaticAssetUrl('/assets/wx-qrcode.png')} className={cx('demo-footer-item-qrcode')} />
						</div>
					)}
				>
					<p>微信群二维码</p>
				</Tooltip>
				<br />
				<Tooltip
					color={'#0D1A26'}
					position={'top'}
					content={<img src={getStaticAssetUrl('/assets/ding-qrcode.png')} className={cx('demo-footer-item-qrcode')} />}
				>
					<p>阿里内部钉钉群</p>
				</Tooltip>
			</div>
		</div>

		<div className={cx('demo-footer-item')}>
			<h3><img src={getStaticAssetUrl('/assets/footer-logo.svg')} /></h3>
			<div>
				<Link to={'/cn/team'}>核心团队</Link>
				<a href={'https://github.com/hiloteam'} target={'_blank'}>hiloteam</a>
			</div>
		</div>
	</div>
);

export default Footer;
