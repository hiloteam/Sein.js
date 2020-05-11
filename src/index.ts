/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-7-28 13:54:12
 * @Description:
 */
export const version = '1.5.0';
export const author = 'Tianyu Dai <dtysky@outlook.com>';

/* tslint:disable-line */
console.log(`Sein.js verison: ${version}`);

/* -------------- types --------------- */
export * from './types/Common';
export * from './types/Event';
export * from './types/Physic';
export * from './types/Renderer';
export * from './types/Resource';
export * from './types/Global';

/* -------------- Core --------------- */
export {default as SName, isSName} from './Core/SName';
export {default as SObject, isSObject} from './Core/SObject';
export {default as Actor, isActor} from './Core/Actor';
export {default as Component, isComponent} from './Core/Component';
export {default as ChildActorComponent, IChildActorComponentState} from './Core/ChildActorComponent';
export {default as Engine, isEngine} from './Core/Engine';
export {default as Game, IGameOptions, isGame} from './Core/Game';
export {default as World, isWorld} from './Core/World';
export {default as Level, isLevel} from './Core/Level';
export {default as Ticker, isTicker} from './Core/Ticker';
export {default as Tween} from './Core/Tween';
export {default as Observable, isObservable} from './Core/Observable';
export * from './Core/Decorator';
export {default as Constants} from './Core/Constants';
export * from './Core/MetaTypes';

/* -------------- Info --------------- */
export {default as InfoActor, isInfoActor} from './Info/InfoActor';
export {default as GameModeActor, isGameModeActor} from './Info/GameModeActor';
export {default as LevelScriptActor, isLevelScriptActor} from './Info/LevelScriptActor';
export {default as SystemActor, isSystemActor} from './Info/SystemActor';
export {default as StateActor, isStateActor} from './Info/StateActor';
export {default as TimerActor, isTimerActor, ITimerState} from './Info/TimerActor';

/* -------------- Math --------------- */
export * from './Core/Math';

/* -------------- DataStructure --------------- */
export {default as SIterable} from './DataStructure/SIterable';
export {default as SArray} from './DataStructure/SArray';
export {default as SMap} from './DataStructure/SMap';
export {default as SSet} from './DataStructure/SSet';

/* -------------- Exception --------------- */
export {default as BaseException, isBaseException} from './Exception/BaseException';
export {default as BreakGuardException, isBreakGuardException} from './Exception/BreakGuardException';
export {default as MemberConflictException, isMemberConflictException} from './Exception/MemberConflictException';
export {default as MissingMemberException, isMissingMemberException} from './Exception/MissingMemberException';
export {default as TypeConflictException, isTypeConflictException} from './Exception/TypeConflictException';
export {default as UnmetRequireException, isUnmetRequireException} from './Exception/UnmetRequireException';
export {default as ResourceLoadException, isResourceLoadException} from './Exception/ResourceLoadException';
export {default as throwException} from './Exception/throwException';

/* -------------- Player --------------- */
export {default as Player, isPlayer} from './Player/Player';
export {default as ControllerActor, IControllerActorState, isControllerActor} from './Player/ControllerActor';
export {default as PlayerControllerActor, isPlayerControllerActor} from './Player/PlayerControllerActor';
export {default as PlayerStateActor, isPlayerStateActor} from './Player/PlayerStateActor';

/* -------------- AI --------------- */
export {default as AIControllerActor, isAIControllerActor} from './AI/AIControllerActor';
export {default as FSMComponent, isFSMComponent} from './AI/FSMComponent';
export {default as FSMState, isFSMState} from './AI/FSMState';
// export {default as BehaviorTree} from './AI/BehaviorTree';

/* -------------- Renderer --------------- */
export {default as ISceneComponent} from './Renderer/ISceneComponent';
export {default as SceneComponent, isSceneComponent, ISceneComponentState} from './Renderer/SceneComponent';
export {default as ISceneActor} from './Renderer/ISceneActor';
export {default as SceneActor, isSceneActor} from './Renderer/SceneActor';
export {
  default as PrimitiveComponent, IPrimitiveComponentState,
  isPrimitiveComponent, isPrimitiveActor
} from './Renderer/PrimitiveComponent';
export {
  default as StaticMeshComponent, IStaticMeshComponentState,
  isStaticMeshActor, isStaticMeshComponent
} from './Renderer/StaticMeshComponent';
export {default as StaticMeshActor} from './Renderer/StaticMeshActor';
export {
  default as SkeletalMeshComponent, ISkeletalMeshComponentState,
  isSkeletalMeshActor, isSkeletalMeshComponent
} from './Renderer/SkeletalMeshComponent';
export {default as SkeletalMeshActor} from './Renderer/SkeletalMeshActor';
export {default as SpriteComponent, ISpriteComponentState, isSpriteActor, isSpriteComponent} from './Renderer/SpriteComponent';
export {default as SpriteActor} from './Renderer/SpriteActor';
export {default as Layers, isLayers} from './Renderer/Layers';
export {default as Fog, isFog} from './Renderer/Fog';
export {default as FrameBuffer, isFrameBuffer, IFrameBufferOptions} from './Renderer/FrameBuffer';
export {default as RenderSystemActor, isRenderSystemActor} from './Renderer/RenderSystemActor';
export {default as VertexArrayObject} from './Renderer/VertexArrayObject';
export {default as Program} from './Renderer/Program';
export {default as Shader} from './Renderer/Shader';
export {default as GLCapabilities} from './Renderer/GLCapabilities';
export {default as GLExtensions} from './Renderer/GLExtensions';
export {default as Buffer} from './Renderer/Buffer';

/* -------------- BSP --------------- */
export {default as BSPComponent, isBSPActor, isBSPComponent} from './BSP/BSPComponent';
export {default as BSPBoxComponent, IBSPBoxComponentState, isBSPBoxActor, isBSPBoxComponent} from './BSP/BSPBoxComponent';
export {default as BSPPlaneComponent, IBSPPlaneComponentState, isBSPPlaneActor, isBSPPlaneComponent} from './BSP/BSPPlaneComponent';
export {default as BSPSphereComponent, IBSPSphereComponentState, isBSPSphereActor, isBSPSphereComponent} from './BSP/BSPSphereComponent';
export {default as BSPMorphComponent, IBSPMorphComponentState, isBSPMorphActor, isBSPMorphComponent} from './BSP/BSPMorphComponent';
export {
  default as BSPCylinderComponent, IBSPCylinderComponentState,
  isBSPCylinderActor, isBSPCylinderComponent
} from './BSP/BSPCylinderComponent';
export {default as BSPBoxActor} from './BSP/BSPBoxActor';
export {default as BSPCylinderActor} from './BSP/BSPCylinderActor';
export {default as BSPMorphActor} from './BSP/BSPMorphActor';
export {default as BSPPlaneActor} from './BSP/BSPPlaneActor';
export {default as BSPSphereActor} from './BSP/BSPSphereActor';

/* -------------- Textures --------------- */
export {default as Texture, isTexture} from './Texture/Texture';
export {default as CubeTexture, isCubeTexture} from './Texture/CubeTexture';
export {default as LazyTexture, isLazyTexture} from './Texture/LazyTexture';
export {default as DataTexture, isDataTexture} from './Texture/DataTexture';
export {default as DynamicTexture, isDynamicTexture, IDynamicTextureOptions} from './Texture/DynamicTexture';
export {default as AtlasManager, isAtlasManager, IAtlasOptions, IAtlasCreationOptions} from './Texture/AtlasManager';

/* -------------- Material --------------- */
export {default as Material, IMaterial, isMaterial} from './Material/Material';
export {default as BasicMaterial, isBasicMaterial} from './Material/BasicMaterial';
export {default as GeometryMaterial, isGeometryMaterial} from './Material/GeometryMaterial';
export {default as PBRMaterial, isPBRMaterial} from './Material/PBRMaterial';
export {default as RawShaderMaterial, IShaderMaterialOptions, isRawShaderMaterial} from './Material/RawShaderMaterial';
export {default as ShaderMaterial, isShaderMaterial} from './Material/ShaderMaterial';
export {default as SkyboxMaterial, isSkyboxMaterial} from './Material/SkyboxMaterial';
export {
  default as ShaderChunk, IMaterialUniform,
  IShaderChunk, IShaderChunkCode, IMaterialAttribute, isShaderChunk
} from './Material/ShaderChunk';
export {default as shaderChunks} from './Material/shaderChunks';
export {default as Semantic, ISemanticObject} from './Material/Semantic';

/* -------------- Geometry --------------- */
export {default as GeometryData, isGeometryData} from './Geometry/GeometryData';
export {default as Geometry, isGeometry} from './Geometry/Geometry';
export {default as BoxGeometry, isBoxGeometry} from './Geometry/BoxGeometry';
export {default as SphereGeometry, isSphereGeometry} from './Geometry/SphereGeometry';
export {default as PlaneGeometry, isPlaneGeometry} from './Geometry/PlaneGeometry';
export {default as CylinderGeometry, isCylinderGeometry} from './Geometry/CylinderGeometry';
export {default as MorphGeometry, isMorphGeometry} from './Geometry/MorphGeometry';

/* -------------- Mesh --------------- */
export {default as Mesh, isMesh} from './Mesh/Mesh';
export {default as SkeletalMesh, isSkeletalMesh} from './Mesh/SkeletalMesh';

/* -------------- Camera --------------- */
export {default as CameraComponent, isCameraActor} from './Camera/CameraComponent';
export {
  default as PerspectiveCameraComponent, IPerspectiveCameraComponentState,
  isPerspectiveCameraActor, isPerspectiveCameraComponent
} from './Camera/PerspectiveCameraComponent';
export {default as PerspectiveCameraActor} from './Camera/PerspectiveCameraActor';
export {
  default as OrthographicCameraComponent, IOrthographicCameraComponentState,
  isOrthographicCameraActor, isOrthographicCameraComponent
} from './Camera/OrthographicCameraComponent';
export {default as OrthographicCameraActor} from './Camera/OrthographicCameraActor';

/* -------------- Light --------------- */
export {
  default as LightComponent, ILightComponentState,
  isLightComponent, isLightActor
} from './Light/LightComponent';
export {
  default as AmbientLightComponent, IAmbientLightComponentState,
  isAmbientLightComponent, isAmbientLightActor
} from './Light/AmbientLightComponent';
export {
  default as DirectionalLightComponent, IDirectionalLightComponentState,
  isDirectionalLightActor, isDirectionalLightComponent
} from './Light/DirectionalLightComponent';
export {
  default as PointLightComponent, IPointLightComponentState,
  isPointLightActor, isPointLightComponent
} from './Light/PointLightComponent';
export {
  default as SpotLightComponent, ISpotLightComponentState,
  isSpotLightActor, isSpotLightComponent
} from './Light/SpotLightComponent';
export {default as AmbientLightActor} from './Light/AmbientLightActor';
export {default as DirectionalLightActor} from './Light/DirectionalLightActor';
export {default as PointLightActor} from './Light/PointLightActor';
export {default as SpotLightActor} from './Light/SpotLightActor';

/* -------------- Animation --------------- */
export {default as AnimatorComponent, IAnimatorComponentState, isAnimatorComponent} from './Animation/AnimatorComponent';
export {default as Animation, IAnimationState, isAnimation} from './Animation/Animation';
export {default as ModelAnimation, IModelAnimationState, isModelAnimation} from './Animation/ModelAnimation';
export {default as SpriteAnimation, ISpriteAnimationState, isSpriteAnimation} from './Animation/SpriteAnimation';
export {default as TweenAnimation, ITweenAnimationState, isTweenAnimation} from './Animation/TweenAnimation';
export {default as CombineAnimation, ICombineAnimationState, isCombineAnimation} from './Animation/CombineAnimation';

/* -------------- Physic --------------- */
export {default as CannonPhysicWorld} from './Physic/CannonPhysicWorld';
export {default as RigidBodyComponent, IRigidBodyComponentState, isRigidBodyComponent} from './Physic/RigidBodyComponent';
export {default as ColliderComponent, isColliderComponent} from './Physic/ColliderComponent';
export {default as BoxColliderComponent, isBoxColliderComponent} from './Physic/BoxColliderComponent';
export {default as CylinderColliderComponent, isCylinderColliderComponent} from './Physic/CylinderColliderComponent';
export {default as PlaneColliderComponent, isPlaneColliderComponent} from './Physic/PlaneColliderComponent';
export {default as SphereColliderComponent, isSphereColliderComponent} from './Physic/SphereColliderComponent';
export {default as JointComponent, isJointComponent} from './Physic/JointComponent';
export {default as PointToPointJointComponent, isPointToPointJointComponent} from './Physic/PointToPointJointComponent';
export {default as DistanceJointComponent, isDistanceJointComponent} from './Physic/DistanceJointComponent';
export {default as HingeJointComponent, isHingeJointComponent} from './Physic/HingeJointComponent';
export {default as LockJointComponent, isLockJointComponent} from './Physic/LockJointComponent';
export {default as SpringJointComponent, isSpringJointComponent} from './Physic/SpringJointComponent';
export {default as PhysicPicker, isPhysicPicker} from './Physic/PhysicPicker';

/* -------------- Event --------------- */
export {default as EventManager, isEventManager} from './Event/EventManager';
export {default as EventTrigger, isEventTrigger} from './Event/EventTrigger';

/* -------------- HID --------------- */
export * from './HID/MouseTrigger';
export * from './HID/TouchTrigger';
export * from './HID/KeyboardTrigger';
export {default as WindowResizeTrigger} from './HID/WindowResizeTrigger';

/* -------------- Resource --------------- */
export {default as ResourceManager, isResourceManager} from './Resource/ResourceManager';
export {default as ResourceLoader, isResourceLoader} from './Resource/ResourceLoader';
export {default as GlTFLoader, isGlTFLoader} from './Resource/GlTFLoader';
export {default as ImageLoader, isImageLoader} from './Resource/ImageLoader';
export {default as TextureLoader, isTextureLoader} from './Resource/TextureLoader';
export {default as CubeTextureLoader, isCubeTextureLoader} from './Resource/CubeTextureLoader';
export {default as AtlasLoader, isAtlasLoader} from './Resource/AtlasLoader';
export {IGlTFExtension, AliAMCExtension} from './Resource/GlTFExtensions';

/* -------------- NetWork --------------- */
export {default as HTTP} from './Network/HTTP';

/* -------------- Utils --------------- */
export * from './utils/actorIterators';
export * from './utils/actorFinders';
export {default as ContextSupports} from './utils/ContextSupports';

/* -------------- Debug --------------- */
export {default as Debug} from './Debug';

if(typeof window !== 'undefined' && !window['Sein']) {
  window['Sein'] = module.exports;
}
