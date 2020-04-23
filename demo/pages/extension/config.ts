/**
 * @File   : config.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 8/11/2019, 2:46:17 PM
 * @Description:
 */
export default {
  categories: [
    {path: 'intro', label: {en: 'Intro', cn: '介绍'}},
    {path: 'templates', label: {en: 'Templates', cn: '扩展模板'}},
    {path: 'containers', label: {en: 'Containers', cn: '扩展容器'}},
    {path: 'toolchains', label: {en: 'Toolchains', cn: '工具链'}},
    {path: 'common-extensions', label: {en: 'Common Extensions', cn: '通用扩展组件'}},
    {path: 'web-extensions', label: {en: 'Web Extensions', cn: 'Web扩展组件'}},
    {path: 'tinyprogram-extensions', label: {en: 'Tiny Extension', cn: '小程序(游戏)扩展组件'}},
  ],
  intro: [
    {path: 'intro', label: {en: 'Intro', cn: '介绍'}}
  ],
  templates: [
    {path: 'lite', label: {en: 'Lite', cn: 'Lite'}},
    {path: 'tiny', label: {en: 'Tiny', cn: 'Tiny'}},
    {path: 'simple', label: {en: 'Simple', cn: 'Simple'}},
    {path: 'tabs-switch', label: {en: 'TabsSwitch', cn: 'TabsSwitch'}},
  ],
  containers: [
    {path: 'none', label: {en: 'None', cn: 'None'}},
    {path: 'react', label: {en: 'React', cn: 'React'}},
    {path: 'my-tiny-program', label: {en: 'MY Tiny Program', cn: '阿里小程序'}},
    {path: 'my-tiny-game', label: {en: 'MY Tiny Game', cn: '阿里小游戏'}}
  ],
  toolchains: [
    {path: 'inspector', label: {en: 'Inspector', cn: 'Inspector'}},
    {path: 'seinjs-gltf-loader', label: {en: 'seinjs-gltf-loader', cn: 'seinjs-gltf-loader'}},
    {path: 'seinjs-atlas-loader', label: {en: 'seinjs-atlas-loader', cn: 'seinjs-atlas-loader'}},
    {path: 'seinjs-url-loader', label: {en: 'seinjs-url-loader', cn: 'seinjs-url-loader'}},
    {path: 'seinjs-platform-webpack-plugin', label: {en: 'seinjs-platform-webpack-plugin', cn: 'seinjs-platform-webpack-plugin'}},
    {path: 'resource-publisher', label: {en: 'Resource Publisher', cn: '资源发布CDN'}},
    {path: 'png-compress-processor', label: {en: 'PNG Compress Processor', cn: 'PNG压缩处理器'}}
  ],
  'common-extensions': [
    {path: 'gui', label: {en: 'GUI System', cn: 'GUI系统'}},
    {path: 'camera-controls', label: {en: 'Camera Controls', cn: '摄像机控制器'}},
    {path: 'gpu-particles', label: {en: 'GPU Particles', cn: 'GPU粒子系统'}},
    {path: 'post-processing', label: {en: 'Post processing', cn: '后处理系统'}},
    {path: 'alipay-fallback', label: {en: 'Alipay fallback', cn: '支付宝通用降级'}},
  ],
  'web-extensions': [
    {path: 'audio', label: {en: 'Space Audio System', cn: '空间音频系统'}},
    {path: 'dom-hud', label: {en: 'Dom HUD', cn: '基于DOM的HUD'}},
    {path: 'react-hud', label: {en: 'React HUD', cn: '基于React的HUD'}},
  ],
  'tinyprogram-extensions': [
    {path: 'tinyprogram-hud', label: {en: 'Tiny program hud', cn: '基于小程序的HUD'}},
  ]
};
