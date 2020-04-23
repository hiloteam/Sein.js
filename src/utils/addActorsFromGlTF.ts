/**
 * @File   : createActorFromGlTF.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/15/2018, 5:00:10 PM
 * @Description:
 */
import Game from '../Core/Game';
import Hilo3d from '../Core/Hilo3d';
import SceneActor, {isSceneActor} from '../Renderer/SceneActor';
import SceneComponent from '../Renderer/SceneComponent';
import SkeletalMeshActor from '../Renderer/SkeletalMeshActor';
import StaticMeshActor from '../Renderer/StaticMeshActor';
import OrthographicCameraActor from '../Camera/OrthographicCameraActor';
import PerspectiveCameraActor from '../Camera/PerspectiveCameraActor';
import AmbientLightActor from '../Light/AmbientLightActor';
import DirectionalLightActor from '../Light/DirectionalLightActor';
import PointLightActor from '../Light/PointLightActor';
import SpotLightActor from '../Light/SpotLightActor';
import SkeletalMeshComponent from '../Renderer/SkeletalMeshComponent';
import StaticMeshComponent from '../Renderer/StaticMeshComponent';
import OrthographicCameraComponent from '../Camera/OrthographicCameraComponent';
import PerspectiveCameraComponent from '../Camera/PerspectiveCameraComponent';
import AmbientLightComponent from '../Light/AmbientLightComponent';
import DirectionalLightComponent from '../Light/DirectionalLightComponent';
import PointLightComponent from '../Light/PointLightComponent';
import SpotLightComponent from '../Light/SpotLightComponent';
import {ESeinNodeType, INodeWithGlTFExtensions, ISeinNodeExtension, IGlTFModel} from '../types/Resource';
import AnimatorComponent from '../Animation/AnimatorComponent';
import World from '../Core/World';
import SArray from '../DataStructure/SArray';
import {MetaSClasses} from '../Core/MetaTypes';
import BSPMorphComponent from '../BSP/BSPMorphComponent';
import BSPMorphActor from '../BSP/BSPMorphActor';
import Debug from '../Debug';
import {FakeHiloSprite} from '../Resource/GlTFExtensions';
import SpriteActor from '../Renderer/SpriteActor';
import SpriteComponent from '../Renderer/SpriteComponent';

/* tslint:disable */
/**
 * @hidden
 */
function generateActorOrComponentFromNode(
  node: INodeWithGlTFExtensions,
  parentActor: SceneActor,
  parent: SceneComponent,
  isComponent: boolean,
  resource: IGlTFModel,
  world: World
): SceneActor {
  const child = node.children[0] as (Hilo3d.Node | Hilo3d.Mesh | Hilo3d.SkinedMesh
    | Hilo3d.OrthographicCamera | Hilo3d.PerspectiveCamera
    | Hilo3d.AmbientLight | Hilo3d.DirectionalLight | Hilo3d.PointLight | Hilo3d.SpotLight
  );
  let result = null;
  let root = null;

  let Class;
  let initOptions: any = {__fromGlTF: true, matrix: node.matrix};
  if (node.gltfExtensions.Sein_node && node.gltfExtensions.Sein_node.className) {
    const className = node.gltfExtensions.Sein_node.className;
    Class = MetaSClasses[className];

    if (!Class) {
      Debug.warn(`No class named '${className}', no effect, you must use decorator 'SClass' to annotate your class before use it !`);
    }
    else {
      Object.assign(initOptions, node.gltfExtensions.Sein_node.initOptions || {});
    }
  }
  
  if (!child) {
    if (isComponent) {
      root = result = parentActor.addComponent(node.name, Class || SceneComponent, initOptions, parent);
    } else {
      root = (result = world.addActor(node.name, Class || SceneActor, initOptions, parentActor, parent)).root;
    }
  } else if ((child as Hilo3d.SkinedMesh).isSkinedMesh) {
    let length = node.children.length;
    const meshes = [];
    for (let index = 0; index < length; index += 1) {
      const mesh = node.children[index] as Hilo3d.SkinedMesh;
      if (!(mesh as any).isSkinedMesh) {
        break;
      }

      meshes.push(mesh);
      (node as any).childrenOffset += 1;
    }

    length = meshes.length;
    const {geometry, material} = child as Hilo3d.SkinedMesh;
    Object.assign(initOptions, {__doNotUseMultiPrimitiveYourself: meshes, geometry, material});
    if (isComponent) {
      root = result = parentActor.addComponent(node.name, Class || SkeletalMeshComponent, initOptions, parent);
      (parentActor as any).skeletalMeshComponents.push([root, meshes]);
    } else {
      root = (result = world.addActor(node.name, Class || SkeletalMeshActor, initOptions, parentActor, parent)).root;
      (parentActor as any).skeletalMeshComponents = [[root, meshes]];
    }
  } else if ((child as Hilo3d.Mesh).isMesh) {
    let length = node.children.length;
    const meshes = [];
    for (let index = 0; index < length; index += 1) {
      const mesh = node.children[index] as Hilo3d.Mesh;
      if (!(mesh as any).isMesh) {
        break;
      }

      meshes.push(mesh);
      (node as any).childrenOffset += 1;
    }

    length = meshes.length;
    const {geometry, material} = child as Hilo3d.Mesh;

    Object.assign(initOptions, {__doNotUseMultiPrimitiveYourself: meshes, geometry, material});
    if ((geometry as Hilo3d.MorphGeometry).isMorphGeometry) {
      if (isComponent) {
        root = result = parentActor.addComponent(node.name, Class || BSPMorphComponent, initOptions, parent);
      } else {
        root = (result = world.addActor(node.name, Class || BSPMorphActor, initOptions, parentActor, parent)).root;
      }
    } else {
      if (isComponent) {
        root = result = parentActor.addComponent(node.name, Class || StaticMeshComponent, initOptions, parent);
      } else {
        root = (result = world.addActor(node.name, Class || StaticMeshActor, initOptions, parentActor, parent)).root;
      }
    }
  } else if ((child as FakeHiloSprite).isFakeHiloSprite) {
    const {width, height, isBillboard, frustumTest, atlas} = (child as FakeHiloSprite).sprite;
    const {material} = (child as FakeHiloSprite);
    const {frameName, index} = atlas;
    const atlasManager = resource['atlases'][index];
    Object.assign(initOptions, {width, height, isBillboard, frustumTest, frameName, atlas: atlasManager, material, materialOptions: {alphaMode: 'BLEND'}});
    if (isComponent) {
      root = result = parentActor.addComponent(node.name, Class || SpriteComponent, initOptions, parent);
    } else {
      root = (result = world.addActor(node.name, Class || SpriteActor, initOptions, parentActor, parent)).root;
    }
    (node as any).childrenOffset += 1;
  } else if ((child as Hilo3d.OrthographicCamera).isOrthographicCamera) {
    const {far, near, left, right, top, bottom, backgroundMat} = child as any;
    Object.assign(initOptions, {far, near, left, right, top, bottom, backgroundMat});
    if (isComponent) {
      root = result = parentActor.addComponent(node.name, Class || OrthographicCameraComponent, initOptions, parent);
    } else {
      root = (result = world.addActor(node.name, Class || OrthographicCameraActor, initOptions, parentActor, parent)).root;
    }
    (node as any).childrenOffset += 1;
  } else if ((child as Hilo3d.PerspectiveCamera).isPerspectiveCamera) {
    const {far, near, fov, aspect, backgroundMat} = child as any;
    Object.assign(initOptions, {far, near, fov, aspect, backgroundMat});
    if (isComponent) {
      root = result = parentActor.addComponent(node.name, Class || PerspectiveCameraComponent, initOptions, parent);
    } else {
      root = (result = world.addActor(node.name, Class || PerspectiveCameraActor, initOptions, parentActor, parent)).root;
    }
    (node as any).childrenOffset += 1;
  } else if ((child as Hilo3d.AmbientLight).isAmbientLight) {
    const {amount, color, shadow} = child as Hilo3d.AmbientLight;
    Object.assign(initOptions, {amount, color, shadow});
    if (isComponent) {
      root = result = parentActor.addComponent(node.name, Class || AmbientLightComponent, initOptions, parent);
    } else {
      root = (result = world.addActor(node.name, Class || AmbientLightActor, initOptions, parentActor, parent)).root;
    }
    (node as any).childrenOffset += 1;
  } else if ((child as Hilo3d.DirectionalLight).isDirectionalLight) {
    const {amount, color, shadow, direction} = child as Hilo3d.DirectionalLight;
    Object.assign(initOptions, {amount, color, shadow, direction});
    if (isComponent) {
      root = result = parentActor.addComponent(node.name, Class || DirectionalLightComponent, initOptions, parent);
    } else {
      root = (result = world.addActor(node.name, Class || DirectionalLightActor, initOptions, parentActor, parent)).root;
    }
    (node as any).childrenOffset += 1;
  } else if ((child as Hilo3d.PointLight).isPointLight) {
    const {amount, color, shadow, range, constantAttenuation, linearAttenuation, quadraticAttenuation} = child as Hilo3d.PointLight;
    Object.assign(initOptions, {amount, color, shadow, range, constantAttenuation, linearAttenuation, quadraticAttenuation});
    if (isComponent) {
      root = result = parentActor.addComponent(node.name, Class || PointLightComponent, initOptions, parent);
    } else {
      root = (result = world.addActor(node.name, Class || PointLightActor, initOptions, parentActor, parent)).root;
    }
    (node as any).childrenOffset += 1;
  } else if ((child as Hilo3d.SpotLight).isSpotLight) {
    const {amount, color, shadow, range, constantAttenuation, linearAttenuation, quadraticAttenuation, cutoff, outerCutoff, direction} = child as Hilo3d.SpotLight;
    Object.assign(initOptions, {amount, color, shadow, range, constantAttenuation, linearAttenuation, quadraticAttenuation, cutoff, outerCutoff, direction});
    if (isComponent) {
      root = result = parentActor.addComponent(node.name, Class || SpotLightComponent, initOptions, parent);
    } else {
      root = (result = world.addActor(node.name, Class || SpotLightActor, initOptions, parentActor, parent)).root;
    }
    (node as any).childrenOffset += 1;
  } else {
    if (isComponent) {
      root = result = parentActor.addComponent(node.name, Class || SceneComponent, initOptions, parent);
    } else {
      root = (result = world.addActor(node.name, Class || SceneActor, initOptions, parentActor, parent)).root;
    }
  }

  root.cloneFromHiloNode(node as Hilo3d.Node);
  root.needReleaseGlRes = false;

  const animationId = root.hiloNode.animationId;
  if (isComponent && resource.anim && resource.anim.validAnimationIds[animationId]) {
    (parentActor as any).animNameMap[animationId] = root.hiloNode;
    (parentActor as any).animCount += 1;
  }

  if (isComponent && (parentActor as any).jointNameMap && root.hiloNode.jointName !== undefined) {
    (parentActor as any).jointNameMap[root.hiloNode.jointName] = root.hiloNode;
  }

  return result;
}

/**
 * @hidden
 */
function convert(
  game: Game,
  parent: SceneActor | SceneComponent,
  children: INodeWithGlTFExtensions[],
  actors: SArray<SceneActor>,
  resource: IGlTFModel,
  forceAsComponent: boolean = false,
  className: string = null
) {
  // if parent is null
  let isComponent: boolean = false;
  let parentNode: INodeWithGlTFExtensions = null;
  let parentSeinNode: ISeinNodeExtension = null;

  if (parent) {
    if (isSceneActor(parent)) {
      parentNode = parent.root.hiloNode as INodeWithGlTFExtensions;
    } else {
      parentNode = parent.hiloNode as INodeWithGlTFExtensions;
      // parent is component, child must be component
      isComponent = true;
    }
  }

  if (parentNode && parentNode.gltfExtensions && parentNode.gltfExtensions.Sein_node) {
    parentSeinNode = parentNode.gltfExtensions.Sein_node;
  } else {
    parentSeinNode = {};
  }

  const length = children.length;

  for (let i = 0; i < length; i += 1) {
    const child = children[i];
    child.gltfExtensions = child.gltfExtensions || {};
    (child as any).childrenOffset = 0;

    let childSeinNode: ISeinNodeExtension;
    let skipThisNode: boolean = false;
    if (child.gltfExtensions.Sein_node) {
      childSeinNode = child.gltfExtensions.Sein_node;
      skipThisNode = childSeinNode.skipThisNode;
    }

    if (forceAsComponent || className) {
      childSeinNode = childSeinNode || {
        selfType: ESeinNodeType.Actor,
        childrenType: ESeinNodeType.Component
      };
    }

    if (forceAsComponent) {
      childSeinNode.selfType = ESeinNodeType.Component;
    }

    if (className) {
      childSeinNode.className = className;
    }

    // parent is actor, childrenType is component and selfType of child is component
    if (childSeinNode && childSeinNode.selfType === ESeinNodeType.Actor) {
      isComponent = false;
    } else if (
      !isComponent
      && parentSeinNode.childrenType === ESeinNodeType.Component
      && (!childSeinNode || childSeinNode.selfType !== ESeinNodeType.Actor)
    ) {
      isComponent = true;
    } else if (childSeinNode && childSeinNode.selfType === ESeinNodeType.Component) {
      isComponent = true;
    }

    let result = parent;
    if (!skipThisNode) {
      result = generateActorOrComponentFromNode(
        child,
        (parent && !isSceneActor(parent)) ? (parent as any).getOwner() : parent,
        (parent && isSceneActor(parent)) ? null : parent as SceneComponent,
        isComponent,
        resource,
        game.world
      );
  
      if (isSceneActor(result)) {
        const actor = result;
  
        (actor as any).animNameMap = {};
        (actor as any).jointNameMap = {};
        (actor as any).animCount = 0;
        (actor as any).skeletalMeshComponents = (actor as any).skeletalMeshComponents || [];
        const animationId = actor.root.hiloNode.animationId;
        if (resource.anim && resource.anim.validAnimationIds[animationId]) {
          (actor as any).animNameMap[animationId] = actor.root.hiloNode;
          (actor as any).animCount += 1;
        }
        if (actor.root.hiloNode.jointName !== undefined) {
          (actor as any).jointNameMap[actor.root.hiloNode.jointName] = actor.root.hiloNode;
        }

        actors.add(actor);
      }
  
      Object.keys(child.gltfExtensions).forEach(name => {
        // 避免循环依赖，临时解决方案
        const handler = (Hilo3d.GLTFParser as any).extensionHandlers[name];
        if (handler && handler.instantiate) {
          handler.instantiate(result, child.gltfExtensions[name], game, child, resource);
        }
      });
    }

    const offset = (child as any).childrenOffset || 0;
    // Leaf node
    if (!child.children || child.children.length === offset) {
      continue;
    }
    
    // const grandson = child.children[offset];
    // if (child.children.length === offset + 1 && (!grandson.children || grandson.children.length === 0)) {
    //   console.log(child, child.jointName);
    //   continue;
    // }

    convert(game, result, child.children.slice(offset) as INodeWithGlTFExtensions[], actors, resource);
  }
}
/* tslint:enable */

/**
 * @hidden
 */
export default function addActorsFromGlTF(
  game: Game,
  entity: any,
  options?: any
): SArray<SceneActor> {
  const resource = entity.result;

  let node = resource.node as INodeWithGlTFExtensions;

  if (options && options.nodePath && options.nodePath.length !== 0) {
    node = resource.node.getChildByNamePath(options.nodePath) as INodeWithGlTFExtensions;

    if (!node) {
      throw new Error(`Resource "${entity.name}" in type "GlTF" dose not has node "${options.nodePath.toString()}" !`);
    }
  }

  let children: Hilo3d.Node[] = null;
  const actors = new SArray<SceneActor>();

  if (node !== resource.node) {
    children = [node];
  } else {
    children = node.children.slice() as Hilo3d.Node[];
    
    const al = resource['ambientLight'];
    if (al && !(game.world as any).__gltfAmbientLightCreated) {
      const lNode = new Hilo3d.Node();
      lNode.name = al.name;
      lNode.addChild(al);
      children.push(lNode);
      (game.world as any).__gltfAmbientLightCreated = true;
    }
  }

  if (options && options.name && children.length === 1) {
    const child = children[0];
    child.name = options.name;
  }

  convert(
    game,
    options && (options.parentActor || options.parentComponent),
    children as INodeWithGlTFExtensions[],
    actors,
    resource,
    options && options.asComponent,
    options && (options.className || (options.Class && options.Class.CLASS_NAME.value))
  );

  actors.forEach(a => {
    const {animCount, animNameMap, jointNameMap, skeletalMeshComponents} = a as any;

    let length = skeletalMeshComponents.length;
    for (let i = 0; i < length; i += 1 ) {
      const [component, meshes] = skeletalMeshComponents[i];
      const len = meshes.length;

      for (let index = 0; index < len; index += 1) {
        component.cloneSkinningFromHilo(meshes[index], jointNameMap, index);
      }
    }

    delete (a as any).animCount;
    delete (a as any).animNameMap;
    delete (a as any).jointNameMap;
    delete (a as any).skeletalMeshComponents;

    if (animCount > 0) {
      const hiloNode = a.root.hiloNode as INodeWithGlTFExtensions;
      hiloNode.anim = resource.anim.clone(null);
      (hiloNode as any).anim.nodeNameMap = animNameMap;

      if (hiloNode.gltfExtensions.Sein_animator) {
        const {modelAnimations, prefix, prefixes} = hiloNode.gltfExtensions.Sein_animator;

        length = modelAnimations.length;

        if (length !== 0) {
          const originClips = hiloNode.anim.clips;
          const clips = hiloNode.anim.clips = {};

          for (let index = 0; index < length; index += 1) {
            const name = modelAnimations[index];
            const finalPrefix = prefixes ? (prefixes[index] || prefix) : prefix;
            clips[name] = originClips[finalPrefix ?  `${finalPrefix}@${name}` : name];
          }
        }
      }

      a.addComponent('animator', AnimatorComponent);

      if (hiloNode.gltfExtensions.Sein_animator) {
        const {defaultAnimation} = hiloNode.gltfExtensions.Sein_animator;

        if (defaultAnimation) {
          a.animator.setDefault(defaultAnimation);
        }
      }
    }

    if (options.preRender) {
      a.preRender();
    }

    a.instantiated();
  });

  return actors;
}
