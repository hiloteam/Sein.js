/**
 * @File   : config.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/2/2018, 3:44:01 PM
 * @Description:
 */
/* -------------- Start --------------- */
import * as StartPure from './Start/StartPure';
import * as StartWithReact from './Start/StartWithReact';

/* -------------- Core --------------- */
import * as ActorComponent from './Core/ActorComponent';
import * as SceneComponentCompose from './Core/SceneComponentCompose';
import * as LifeCycle from './Core/LifeCycle';
import * as ErrorChain from './Core/ErrorChain';
import * as Timer from './Core/Timer';
import * as UnLinkReLink from './Core/UnLinkReLink';

/* -------------- Dispatch --------------- */
import * as SingleLevel from './Dispatch/SingleLevel';
import * as MultipleLevel from './Dispatch/MultipleLevel';
import * as MultipleWorld from './Dispatch/MultipleWorld';
import * as MultipleGame from './Dispatch/MultipleGame';

/* -------------- Material --------------- */
import * as PBRMaterial from './Material/PBRMaterial';
import * as ShaderMaterial from './Material/ShaderMaterial';
import * as RawShaderMaterial from './Material/RawShaderMaterial';
import * as ShaderChunk from './Material/ShaderChunk';
import * as MaterialExtension from './Material/MaterialExtension';
import * as MatScriptsInGlTF from './Material/MatScriptsInGlTF';
import * as KHRTechniqueWebgl from './Material/KHRTechniqueWebgl';
import * as GlobalUniformMaterial from './Material/GlobalUniformMaterial';
import * as CustomSemantic from './Material/CustomSemantic';
import * as CustomSpriteMaterial from './Material/CustomSpriteMaterial';
import * as RenderOptions from './Material/RenderOptions';

/* -------------- Camera --------------- */
import * as PerspectiveCamera from './Camera/PerspectiveCamera';
import * as OrthographicCamera from './Camera/OrthographicCamera';
import * as Skybox from './Camera/Skybox';
import * as ActorObserveControl from './Camera/ActorObserveControl';
import * as CameraOrbitControl from './Camera/CameraOrbitControl';
import * as CameraFreeControl from './Camera/CameraFreeControl';
import * as CaptureScreen from './Camera/CaptureScreen';

/* -------------- Light --------------- */
import * as AmbientLight from './Light/AmbientLight';
import * as DirectionalLight from './Light/DirectionalLight';
import * as PointLight from './Light/PointLight';
import * as SpotLight from './Light/SpotLight';
import * as Shadow from './Light/Shadow';
import * as Baking from './Light/Baking';

/* -------------- BSP --------------- */
import * as Box from './BSP/Box';
import * as Sphere from './BSP/Sphere';
import * as Plane from './BSP/Plane';
import * as Cylinder from './BSP/Cylinder';
import * as Morph from './BSP/Morph';

/* -------------- Event --------------- */
import * as EventBasic from './Event/Basic';
import * as EventCustomTrigger from './Event/CustomTrigger';
import * as EventGlobal from './Event/Global';
import * as EventPriorityAndPrevent from './Event/PriorityAndPrevent';

/* -------------- HID --------------- */
import * as HIDKeyboard from './HID/Keyboard';
import * as HIDMouse from './HID/Mouse';
import * as HIDTouch from './HID/Touch';

/* -------------- Resource --------------- */
import * as ImageLoader from './Resource/ImageLoader';
import * as TextureLoader from './Resource/TextureLoader';
import * as CubeTextureLoader from './Resource/CubeTextureLoader';
import * as AtlasLoader from './Resource/AtlasLoader';
import * as GlTFLoader from './Resource/GlTFLoader';
import * as ResourceFreeLoad from './Resource/FreeLoad';
import * as ResourceGLBLoad from './Resource/GLBLoad';
import * as ResourceCancel from './Resource/Cancel';
import * as GlTFMorph from './Resource/GlTFMorph';
import * as GlTFSkeletal from './Resource/GlTFSkeletal';
import * as GlTFScriptBinding from './Resource/GlTFScriptBinding';

/* -------------- Render --------------- */
import * as Sprite from './Render/Sprite';
import * as Layers from './Render/Layers';
import * as RenderOrder from './Render/RenderOrder';
import * as Fog from './Render/Fog';
import * as Advance from './Render/Advance';
import * as Refraction from './Render/Refraction';

/* -------------- Atlas --------------- */
import * as AtlasBasic from './Atlas/Basic';
import * as AtlasAllocateRelease from './Atlas/AllocateRelease';
import * as AtlasFromGrid from './Atlas/FromGrid';
import * as AtlasFromTexture from './Atlas/FromTexture';
import * as AtlasGetTexture from './Atlas/GetTexture';
import * as AtlasFromGlTF from './Atlas/FromGlTF';

/* -------------- Animation --------------- */
import * as SpriteAnimation from './Animation/Sprite';
import * as ModelAnimation from './Animation/Model';
import * as TweenAnimation from './Animation/Tween';
import * as CustomAnimation from './Animation/Custom';
import * as EventsAnimation from './Animation/Events';
import * as CombinationAnimation from './Animation/Combination';

/* -------------- Physic --------------- */
import * as PhysicBase from './Physic/Base';
import * as PhysicCollisionEvents from './Physic/CollisionEvents';
import * as Disable from './Physic/Disable';
import * as Joint from './Physic/Joint';
import * as PhysicPick from './Physic/Pick';

/* -------------- HUD --------------- */
import * as DomHUD from './HUD/DomHUD';
import * as ReactHUD from './HUD/ReactHUD';

/* -------------- Player --------------- */
import * as PlayerBasic from './Player/Basic';
import * as PlayerAI from './Player/AI';
import * as PlayerPlayer from './Player/Player';

/* -------------- GPUParticleSystem --------------- */
import * as GPUEdgeEmitter from './GPUParticleSystem/EdgeEmitter';
import * as ParticlesAtlas from './GPUParticleSystem/Atlas';
import * as GPUWindEmitter from './GPUParticleSystem/WindEmitter';
import * as GPUSphereEmitter from './GPUParticleSystem/SphereEmitter';
import * as GPUHemisphericEmitter from './GPUParticleSystem/HemisphericEmitter';
import * as CustomTrajectory from './GPUParticleSystem/CustomTrajectory';
import * as GPUCircleEmitter from './GPUParticleSystem/CircleEmitter';
import * as GPURectangleEmitter from './GPUParticleSystem/RectangleEmitter';
import * as GPUConeEmitter from './GPUParticleSystem/ConeEmitter';

/* -------------- PostProcessing --------------- */
import * as Threshold from './PostProcessing/Threshold';
import * as LocalThreshold from './PostProcessing/LocalThreshold';
import * as Bloom from './PostProcessing/Bloom';

/* -------------- Audio --------------- */
import * as AudioBasic from './Audio/Basic';
import * as AudioMode from './Audio/Mode';
import * as AudioLazy from './Audio/Lazy';
import * as AudioSpace from './Audio/Space';
import * as AudioBGM from './Audio/BGM';
import * as AudioVolume from './Audio/Volume';
import * as AudioMultiListener from './Audio/MultiListener';
import * as AudioMultiSystem from './Audio/MultiSystem';
import * as AudioControl from './Audio/Control';
import * as AudioGlTF from './Audio/GlTF';

/* -------------- GUI --------------- */
import * as GUIBase from './GUI/Base';
import * as GUIBasicEvent from './GUI/BasicEvent';
import * as GUILabel from './GUI/Label-Button';
import * as GUISelection from './GUI/Selection';
import * as GUISlider from './GUI/Slider';
import * as GUICombineContainer from './GUI/Combine';
import * as GUIClip from './GUI/Clip';
import * as GUIList from './GUI/List';
import * as GUIScroll from './GUI/Scroll';
import * as GUIComplex from './GUI/Complex';
import * as GUIBitmapFont from './GUI/BitmapFont';

/* -------------- DebugTools --------------- */
import * as Inspector from './DebugTools/Inspector';

export interface II18NLabel {
  en: string;
  cn: string;
}

export interface IComponents {
  categories: {path: string, label: II18NLabel}[];
  [path: string]: {
    path: string;
    label: II18NLabel;
    Component?: any;
    desc?: string;
  }[];
}

export const components: IComponents = {
  categories: [
    {path: 'start', label: {en: 'Start', cn: '开始'}},
    {path: 'core', label: {en: 'Core', cn: '核心基础'}},
    {path: 'dispatch', label: {en: 'Dispatch', cn: '场景调度'}},
    {path: 'render', label: {en: 'Render', cn: '渲染'}},
    {path: 'material', label: {en: 'Material', cn: '材质系统'}},
    {path: 'atlas', label: {en: 'Atlas', cn: '图集'}},
    {path: 'camera', label: {en: 'Camera', cn: '摄像机'}},
    {path: 'light', label: {en: 'Light', cn: '灯光'}},
    {path: 'bsp', label: {en: 'BSP', cn: '基础几何体'}},
    {path: 'event', label: {en: 'Event', cn: '事件系统'}},
    {path: 'hid', label: {en: 'HID', cn: '人体接口设备'}},
    {path: 'resource', label: {en: 'Resource', cn: '资源管理'}},
    {path: 'animation', label: {en: 'Animation', cn: '动画系统'}},
    {path: 'physic', label: {en: 'Physic', cn: '物理系统'}},
    {path: 'hud', label: {en: 'HUD', cn: '平视显示器'}},
    {path: 'player', label: {en: 'Player', cn: '玩家系统'}},
    {path: 'audio', label: {en: 'Audio', cn: '音频系统'}},
    {path: 'gpu-particle-system', label: {en: 'GPUParticleSystem', cn: 'GPU粒子系统'}},
    {path: 'post-processing-system', label: {en: 'PostProcessingSystem', cn: '后处理系统'}},
    {path: 'gui', label: {en: 'GUI', cn: 'GUI系统'}},
    {path: 'debug-tools', label: {en: 'DebugTools', cn: '调试工具'}}
  ],
  start: [
    {path: 'start', ...StartPure},
    {path: 'start-with-react', ...StartWithReact}
  ],
  core: [
    {path: 'actor-component', ...ActorComponent},
    {path: 'scene-component-compose', ...SceneComponentCompose},
    {path: 'life-cycle', ...LifeCycle},
    {path: 'unlink-relink', ...UnLinkReLink},
    {path: 'error-chain', ...ErrorChain},
    {path: 'timer', ...Timer}
  ],
  dispatch: [
    {path: 'single-level', ...SingleLevel},
    {path: 'multiple-level', ...MultipleLevel},
    {path: 'multiple-world', ...MultipleWorld},
    // {path: 'multiple-game', ...MultipleGame}
  ],
  render: [
    {path: 'layers', ...Layers},
    {path: '2d-sprite', ...Sprite},
    {path: 'render-order', ...RenderOrder},
    {path: 'fog', ...Fog},
    {path: 'advance', ...Advance},
    {path: 'refraction', ...Refraction}
  ],
  material: [
    {path: 'pbr-material', ...PBRMaterial},
    {path: 'shader-material', ...ShaderMaterial},
    {path: 'raw-shader-material', ...RawShaderMaterial},
    {path: 'shader-chunk', ...ShaderChunk},
    {path: 'material-extension', ...MaterialExtension},
    {path: 'mat-script-in-gltf', ...MatScriptsInGlTF},
    {path: 'khr-technique-webgl', ...KHRTechniqueWebgl},
    {path: 'global-uniform-material', ...GlobalUniformMaterial},
    {path: 'custom-semantic', ...CustomSemantic},
    {path: 'custom-sprite-material', ...CustomSpriteMaterial},
    {path: 'render-options', ...RenderOptions}
  ],
  atlas: [
    {path: 'basic', ...AtlasBasic},
    {path: 'from-gird', ...AtlasFromGrid},
    {path: 'from-texture', ...AtlasFromTexture},
    {path: 'get-texture', ...AtlasGetTexture},
    {path: 'from-gltf', ...AtlasFromGlTF},
    {path: 'allocate-release', ...AtlasAllocateRelease}
  ],
  camera: [
    {path: 'perspective-camera', ...PerspectiveCamera},
    {path: 'orthographic-camera', ...OrthographicCamera},
    {path: 'skybox', ...Skybox},
    {path: 'actor-observe-control', ...ActorObserveControl},
    {path: 'camera-orbit-control', ...CameraOrbitControl},
    {path: 'camera-free-control', ...CameraFreeControl},
    {path: 'capture-screen', ...CaptureScreen}
  ],
  light: [
    {path: 'ambient-light', ...AmbientLight},
    {path: 'directional-light', ...DirectionalLight},
    {path: 'point-light', ...PointLight},
    {path: 'spot-light', ...SpotLight},
    {path: 'shadow', ...Shadow},
    {path: 'baking', ...Baking}
  ],
  bsp: [
    {path: 'box', ...Box},
    {path: 'sphere', ...Sphere},
    {path: 'plane', ...Plane},
    {path: 'cylinder', ...Cylinder},
    {path: 'morph', ...Morph}
  ],
  event: [
    {path: 'basic', ...EventBasic},
    {path: 'custom-trigger', ...EventCustomTrigger},
    {path: 'global', ...EventGlobal},
    {path: 'priority-and-prevent',...EventPriorityAndPrevent}
  ],
  hid: [
    {path: 'keyboard', ...HIDKeyboard},
    {path: 'mouse', ...HIDMouse},
    {path: 'touch', ...HIDTouch}
  ],
  resource: [
    {path: 'image-loader', ...ImageLoader},
    {path: 'texture-loader', ...TextureLoader},
    {path: 'cube-texture-loader', ...CubeTextureLoader},
    {path: 'atlas-loader', ...AtlasLoader},
    {path: 'gltf-loader', ...GlTFLoader},
    {path: 'free-load', ...ResourceFreeLoad},
    {path: 'glb-load', ...ResourceGLBLoad},
    {path: 'cancel', ...ResourceCancel},
    {path: 'gltf-morph', ...GlTFMorph},
    {path: 'gltf-skeletal', ...GlTFSkeletal},
    {path: 'gltf-script-binding', ...GlTFScriptBinding}
  ],
  animation: [
    {path: '2d-sprite', ...SpriteAnimation},
    {path: 'model', ...ModelAnimation},
    {path: 'tween', ...TweenAnimation},
    {path: 'custom', ...CustomAnimation},
    {path: 'events', ...EventsAnimation},
    {path: 'combination', ...CombinationAnimation}
  ],
  physic: [
    {path: 'base', ...PhysicBase},
    {path: 'collision-events', ...PhysicCollisionEvents},
    {path: 'pick', ...PhysicPick},
    {path: 'disable', ...Disable},
    {path: 'joint', ...Joint}
  ],
  hud: [
    {path: 'dom-hud', ...DomHUD},
    {path: 'react-hud', ...ReactHUD}
  ],
  player: [
    {path: 'basic', ...PlayerBasic},
    {path: 'ai', ...PlayerAI},
    {path: 'player', ...PlayerPlayer}
  ],
  audio: [
    {path: 'basic', ...AudioBasic},
    {path: 'mode', ...AudioMode},
    {path: 'lazy', ...AudioLazy},
    {path: 'space', ...AudioSpace},
    {path: 'bgm', ...AudioBGM},
    {path: 'volume', ...AudioVolume},
    {path: 'control', ...AudioControl},
    {path: 'multi-listener', ...AudioMultiListener},
    {path: 'multi-system', ...AudioMultiSystem},
    {path: 'gltf', ...AudioGlTF}
  ],
  'gpu-particle-system': [
    {path: 'edge-emitter', ...GPUEdgeEmitter},
    {path: 'particles-atlas', ...ParticlesAtlas},
    {path: 'wind-emitter', ...GPUWindEmitter},
    {path: 'sphere-emitter', ...GPUSphereEmitter},
    {path: 'hemispheric-emitter', ...GPUHemisphericEmitter},
    {path: 'custom-trajectory', ...CustomTrajectory},
    {path: 'circle-emitter', ...GPUCircleEmitter},
    {path: 'rectangle-emitter', ...GPURectangleEmitter},
    {path: 'cone-emitter', ...GPUConeEmitter}
  ],
  'post-processing-system': [
    {path: 'threshold', ...Threshold},
    {path: 'local-threshold', ...LocalThreshold},
    {path: 'bloom', ...Bloom}
  ],
  gui: [
    {path: 'base', ...GUIBase},
    {path: 'basic-event', ...GUIBasicEvent},
    {path: 'label', ...GUILabel},
    {path: 'selection', ...GUISelection},
    {path: 'slider', ...GUISlider},
    {path: 'combine-container', ...GUICombineContainer},
    {path: 'clip', ...GUIClip},
    {path: 'list', ...GUIList},
    {path: 'scroll', ...GUIScroll},
    {path: 'complex', ...GUIComplex},
    {path: 'bitmapfont', ...GUIBitmapFont}
  ],
  'debug-tools': [
    {path: 'inspector', ...Inspector}
  ]
};
