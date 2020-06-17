/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-camera-controls';

import {createDefaultLights, createDefaultCamera} from '../../utils';

const actorColor = new Sein.Color(1, 1, 1);
const actorMaterial = new Sein.BasicMaterial({diffuse: actorColor, lightType: 'PHONG'});

@Sein.SClass({className: 'CustomSceneActor'})
class CustomSceneActor extends Sein.SceneActor {
  public onAdd() {
    this.addComponent('head', Sein.BSPSphereComponent, {
      radius: 1,
      widthSegments: 16,
      heightSegments: 32,
      material: actorMaterial,
      position: new Sein.Vector3(0, 7.5, 0)
    });

    this.addComponent('neck', Sein.BSPCylinderComponent, {
      radiusTop: .4,
      radiusBottom: .4,
      height: 1.5,
      material: actorMaterial,
      position: new Sein.Vector3(0, 6.5, 0)
    });

    const body = this.addComponent('body', Sein.BSPBoxComponent, {
      width: 4, height: 4, depth: 2,
      material: actorMaterial,
      position: new Sein.Vector3(0, 4, 0)
    });

    this.addComponent(
      'leftArm',
      Sein.BSPCylinderComponent,
      {
        radiusTop: .5, radiusBottom: .5, height: 3,
        material: actorMaterial,
        position: new Sein.Vector3(-3.5, 1, 0),
        rotation: new Sein.Euler(0, 0, Sein.degToRad(90))
      },
      body
    );

    this.addComponent(
      'rightArm',
      Sein.BSPCylinderComponent,
      {
        radiusTop: .5, radiusBottom: .5, height: 3,
        material: actorMaterial,
        position: new Sein.Vector3(3.5, 1, 0),
        rotation: new Sein.Euler(0, 0, Sein.degToRad(90))
      },
      body
    );

    this.addComponent('leftLeg', Sein.BSPCylinderComponent, {
      radiusTop: .5, radiusBottom: .5, height: 4,
      material: actorMaterial,
      position: new Sein.Vector3(-1, 0, 0)
    });

    this.addComponent('rightLeg', Sein.BSPCylinderComponent, {
      radiusTop: .5, radiusBottom: .5, height: 4,
      material: actorMaterial,
      position: new Sein.Vector3(1, 0, 0)
    });
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    createDefaultLights(game);
    createDefaultCamera(game, {position: new Sein.Vector3(0, 4, -20), target: new Sein.Vector3(0, 4, 0)});

    const man = world.addActor('man', CustomSceneActor);
    const a = world.addActor('a', Sein.BSPBoxActor, {width: 1, height: 1, material: new Sein.BasicMaterial({diffuse: new Sein.Color(1, 0, 0)})});
    (man as any).addChild(a, man.findComponentByName('rightArm'));
  }
}
