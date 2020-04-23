/**
 * @File   : utils.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 7/28/2019, 9:16:52 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-camera-controls';
import 'seinjs-dom-hud';

export const config = {
  background: new Sein.Color(.6, .8, .9, 1),
  theme: new Sein.Color(0, .4, 0)
};

export function createDefaultCamera(
  game: Sein.Game,
  options: {
    withController?: boolean,
    target?: Sein.CameraControls.ICameraOrbitControlComponentState['target'],
    position?: Sein.Vector3
  } = {}
) {
  const camera = game.world.addActor('camera', Sein.PerspectiveCameraActor, {
    aspect: game.screenAspect,
    fov: 60,
    near: 0.01,
    far: 100
  });
  camera.transform.position.copy(options.position || new Sein.Vector3(0, 12, -22));
  const target = options.target || new Sein.Vector3(camera.transform.position.x, camera.transform.position.y, 0);
  camera.root.lookAt(target);

  if (options.withController !== false) {
    camera.addComponent('control', Sein.CameraControls.CameraOrbitControlComponent, {
      enableDamping: true,
      dampingFactor: .2,
      zoomMax: 100,
      zoomMin: .1,
      target: target
    });
  }

  return camera;
}

export function createDefaultLights(game: Sein.Game) {
  game.world.addActor('amLight', Sein.AmbientLightActor, {
    amount: .5
  });
  game.world.addActor('dirLight1', Sein.DirectionalLightActor, {
    direction: new Sein.Vector3(0, -1, 1),
    amount: 2
  });
  game.world.addActor('dirLight2', Sein.DirectionalLightActor, {
    direction: new Sein.Vector3(0, -1, -1),
    amount: 2
  });
}

export function loadSein(game: Sein.Game) {
  game.resource.load({type: 'GlTF', name: 'sein.gltf', url: '/assets/models/sein/sein.gltf'});

  const dom = document.createElement('div');
  dom.style.width = '100%';
  dom.style.height = '100%';
  dom.style.background = 'rgba(255, 255, 255, 1)';
  dom.style.lineHeight = `${game.screenHeight}px`;
  dom.style.textAlign = 'center';
  dom.innerText = 'Loading...';
  dom.style.color = '#000';
  dom.style.fontSize = '22px';
  dom.style.transition = '.4s opacity ease-in-out';
  game.world.addActor('loadingHUD', Sein.DomHUD.Actor, {dom});
}

export function createSein(game: Sein.Game) {
  const hud = Sein.findActorByName<Sein.DomHUD.Actor>(game.world, 'loadingHUD');
  hud.dom.style.opacity = '0';
  setTimeout(() => hud.removeFromParent(), 500);

  game.resource.instantiate<'GlTF'>('sein.gltf');

  const ground = game.world.addActor('ground', Sein.BSPPlaneActor, {
    width: 50, height: 50,
    material: new Sein.PBRMaterial({baseColor: new Sein.Color(1, 1, 1), usePhysicLight: true} as any)
  });
  ground.transform.rotate(game.world.rightVector, Sein.degToRad(-90));
}

export function createLoadingHUD(game: Sein.Game) {
  const dom = document.createElement('div');
  dom.style.width = '100%';
  dom.style.height = '100%';
  dom.style.background = 'rgba(255, 255, 255, 1)';
  dom.style.lineHeight = `${game.screenHeight}px`;
  dom.style.textAlign = 'center';
  dom.innerText = 'Loading...';
  dom.style.color = '#000';
  dom.style.fontSize = '24px';
  dom.style.transition = '.4s opacity ease-in-out';

  const hud = game.world.addActor('loadingHUD', Sein.DomHUD.Actor, {dom});

  return {
    update(state: Sein.IResourceState) {
      dom.innerText = `Loading...${state.progress} ${state.current.name}`;
    },
    destroy() {
      hud.removeFromParent();
    }
  };
}
