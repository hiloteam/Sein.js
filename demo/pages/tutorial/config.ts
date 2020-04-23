/**
 * @File   : config.ts
 * @Author : 瞬光 (shunguang.dty@antfin.com)
 * @Date   : 2/15/2019, 7:32:57 PM
 * @Description:
 */
export default [
  {
    label: {cn: '艺术家', en: 'Artist'},
    path: 'artist',
    pages: [
      {label: {cn: '前言', en: 'Preface'}, path: 'preface'},
      {label: {cn: '安装Unity', en: 'Preface'}, path: 'install-unity'},
      {label: {cn: '第一步，创建新工程', en: 'create-project'}, path: 'create-project'},
      {label: {cn: '加入魔法，导入Sein扩展', en: 'import-sein'}, path: 'import-sein'},
      {label: {cn: '小试牛刀，物体、材质和纹理', en: 'create-object'}, path: 'add-object'},
      {label: {cn: '进阶，灯光和相机', en: 'create-light'}, path: 'add-light'},
      {label: {cn: '先预览一下效果', en: 'preview'}, path: 'preview'},
      {label: {cn: '导入模型！', en: 'import-model'}, path: 'import-model'},
      {label: {cn: '动起来，模型动画！', en: 'create-animation'}, path: 'create-animation'},
      {label: {cn: '导出动画并预览！', en: 'export-animation'}, path: 'export-animation'},
      {label: {cn: '加上背景吧，使用天空盒！', en: 'skybox'}, path: 'skybox'},
      {label: {cn: '更酷炫，需要全局反射？', en: 'reflection'}, path: 'reflection'},
      {label: {cn: '更真实，加入环境照明', en: 'ambient'}, path: 'ambient'},
      {label: {cn: 'Lightmap', en: 'lightmap'}, path: 'lightmap'},
      {label: {cn: '后记，和开发的协作模式', en: 'teamwork'}, path: 'teamwork'}
    ]
  },
  {
    label: {cn: '开发者', en: 'Developer'},
    path: 'developer',
    pages: [
      {label: {cn: '前言', en: 'Preface'}, path: '0'},
      {label: {cn: '新建项目和初始化', en: ''}, path: '1'},
      {label: {cn: 'glTF格式模型导出和加载显示', en: ''}, path: '2'},
      {label: {cn: '用Actor控制动态模型', en: ''}, path: '3'},
      {label: {cn: '用SystemActor管理游戏系统', en: ''}, path: '4'},
      {label: {cn: '模型编组', en: ''}, path: '5'},
      {label: {cn: '使用Sein Unity扩展自定义属性', en: ''}, path: '6'},
      {label: {cn: '引入交互', en: ''}, path: '7'},
      {label: {cn: '物理世界与碰撞检测', en: ''}, path: '8'},
      {label: {cn: '粒子系统', en: ''}, path: '9'},
      {label: {cn: 'UI', en: ''}, path: '10'},
      {label: {cn: '优化', en: ''}, path: '11'}
    ]
  },
]
