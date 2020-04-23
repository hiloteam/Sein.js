/**
 * @File   : config.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 9/18/2019, 1:15:54 PM
 * @Description:
 */
export default [
  {
    id: 'start',
    name: '开始',
    list: [
      {
        id: 'start',
        name: '开始'
      }
    ]
  },
  {
    id: 'core',
    name: '核心基础',
    list: [
      {
        id: 'actor-component',
        name: '角色与组件'
      },
      {
        id: 'scene-component-compose',
        name: '场景组件组合'
      },
      {
        id: 'life-cycle',
        name: '生命周期'
      },
      {
        id: 'unlink-relink',
        name: 'UnLink与ReLink'
      },
      {
        id: 'error-chain',
        name: '异常链'
      },
      {
        id: 'timer',
        name: '定时器'
      }
    ]
  },
  {
    id: 'dispatch',
    name: '场景调度',
    list: [
      {
        id: 'single-level',
        name: '单关卡游戏'
      },
      {
        id: 'multiple-level',
        name: '多关卡游戏'
      },
      {
        id: 'multiple-world',
        name: '多世界游戏'
      }
    ]
  },
  {
    id: 'render',
    name: '渲染',
    list: [
      {
        id: 'layers',
        name: '图层'
      },
      {
        id: '2d-sprite',
        name: '2D精灵'
      },
      {
        id: 'render-order',
        name: '渲染顺序'
      },
      {
        id: 'fog',
        name: '雾'
      },
      {
        id: 'advance',
        name: '进阶渲染'
      },
      {
        id: 'refraction',
        name: 'PBR折射'
      }
    ]
  },
  {
    id: 'material',
    name: '材质系统',
    list: [
      {
        id: 'pbr-material',
        name: 'PBR材质'
      },
      {
        id: 'shader-material',
        name: 'Shader材质'
      },
      {
        id: 'raw-shader-material',
        name: 'RawShader材质'
      },
      {
        id: 'shader-chunk',
        name: 'Shader块'
      },
      {
        id: 'material-extension',
        name: '材质扩展'
      },
      {
        id: 'khr-technique-webgl',
        name: 'KHRTechnique扩展'
      },
      {
        id: 'global-uniform-material',
        name: '自定义全局Uniform'
      },
      {
        id: 'custom-semantic',
        name: '自定义Semantic'
      },
      {
        id: 'render-options',
        name: '修改渲染配置'
      }
    ]
  },
  {
    id: 'atlas',
    name: '图集',
    list: [
      {
        id: 'basic',
        name: '基础'
      },
      {
        id: 'from-grid',
        name: '通过格子创建'
      },
      {
        id: 'from-texture',
        name: '通过纹理创建'
      },
      {
        id: 'allocate-release',
        name: '动态分配释放'
      }
    ]
  },
  {
    id: 'camera',
    name: '摄像机',
    list: [
      {
        id: 'perspective-camera',
        name: '透视摄像机'
      },
      {
        id: 'orthographic-camera',
        name: '正交摄像机'
      },
      {
        id: 'actor-observe-control',
        name: 'Actor观察控制器'
      },
      {
        id: 'camera-orbit-control',
        name: '绕轨相机控制器'
      },
      {
        id: 'camera-free-control',
        name: '自由相机控制器'
      }
    ]
  },
  {
    id: 'light',
    name: '灯光',
    list: [
      {
        id: 'ambient-light',
        name: '环境光'
      },
      {
        id: 'directional-light',
        name: '平行光'
      },
      {
        id: 'point-light',
        name: '点光'
      },
      {
        id: 'spot-light',
        name: '聚光'
      },
      {
        id: 'shadow',
        name: '实时阴影'
      },
      {
        id: 'baking',
        name: '烘焙'
      }
    ]
  },
  {
    id: 'bsp',
    name: '基础几何体',
    list: [
      {
        id: 'box',
        name: '立方体'
      },
      {
        id: 'sphere',
        name: '球体'
      },
      {
        id: 'plane',
        name: '平面'
      },
      {
        id: 'cylinder',
        name: '圆柱体'
      },
      {
        id: 'morph',
        name: '变形体'
      }
    ]
  },
  {
    id: 'event',
    name: '事件系统',
    list: [
      {
        id: 'basic',
        name: '基础'
      },
      {
        id: 'custom-trigger',
        name: '自定义触发器'
      },
      {
        id: 'global',
        name: '全局事件'
      }
    ]
  },
  {
    id: 'hid',
    name: '人体接口设备',
    list: [
      {
        id: 'touch',
        name: '触摸'
      }
    ]
  },
  {
    id: 'resource',
    name: '资源管理',
    list: [
      {
        id: 'image-loader',
        name: '图片加载器'
      },
      {
        id: 'texture-loader',
        name: '纹理加载器'
      },
      {
        id: 'cube-texture-loader',
        name: '立方体纹理加载器'
      },
      {
        id: 'atlas-loader',
        name: '图集加载器'
      },
      {
        id: 'gltf-loader',
        name: 'GlTF加载器'
      },
      {
        id: 'free-load',
        name: '自由加载'
      },
      {
        id: 'cancel',
        name: '取消加载'
      },
      {
        id: 'gltf-morph',
        name: 'GlTF变形体'
      },
      {
        id: 'gltf-skeletal',
        name: 'GlTF骨骼'
      }
    ]
  },
  {
    id: 'animation',
    name: '动画系统',
    list: [
      {
        id: '2d-sprite',
        name: '2D精灵'
      },
      {
        id: 'model',
        name: '模型动画'
      },
      {
        id: 'tween',
        name: 'Tween动画'
      },
      {
        id: 'custom',
        name: '自定义动画'
      },
      {
        id: 'events',
        name: '事件'
      },
      {
        id: 'combination',
        name: '动画组合'
      }
    ]
  },
  {
    id: 'physic',
    name: '物理系统',
    list: [
      {
        id: 'base',
        name: '基础'
      },
      {
        id: 'collision-events',
        name: '碰撞事件'
      },
      {
        id: 'pick',
        name: '拾取'
      },
      {
        id: 'disable',
        name: '停止运作'
      }
    ]
  },
  {
    id: 'player',
    name: '玩家系统',
    list: [
      {
        id: 'ai',
        name: 'AI'
      },
      {
        id: 'player',
        name: '自定义玩家'
      }
    ]
  },
  {
    id: 'gpu-particle-system',
    name: 'GPU粒子系统',
    list: [
      {
        id: 'edge-emitter',
        name: '边界发射器'
      },
      {
        id: 'atlas',
        name: '图集'
      },
      {
        id: 'wind-emitter',
        name: '风场发射器'
      },
      {
        id: 'sphere-emitter',
        name: '球体发射器'
      },
      {
        id: 'hemispheric-emitter',
        name: '半球发射器'
      },
      {
        id: 'custom-trajectory',
        name: '自定义轨迹'
      }
    ]
  },
  {
    id: 'post-processing-system',
    name: '后处理系统',
    list: [
      {
        id: 'threshold',
        name: '全局阈值化'
      },
      {
        id: 'local-threshold',
        name: '局部阈值化'
      },
      {
        id: 'bloom',
        name: '泛光'
      }
    ]
  }
];
