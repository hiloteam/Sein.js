/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-dom-hud';

import {createDefaultLights} from '../../utils';

class HeroState extends Sein.PlayerStateActor {
  private _hp: number = 100;

  get hp() {
    return this._hp;
  }

  public hit(strong: boolean = false) {
    if (this._hp < 5) {
      this._hp = 0;
    } else if (strong) {
      this._hp -= 20;
    } else {
      this._hp -= 10;
    }
  }
}

const forwardVector = new Sein.Vector3(0, 0, 1);
const rightVector = new Sein.Vector3(-1, 0, 0);
const speed = .2;

class AIController extends Sein.PlayerControllerActor<HeroState> {
  public onPossesActor(actor: Sein.SceneActor) {
    actor.rigidBody.event.add('Collision', this.handleCollision);
  }

  public onDisPossesActor(actor: Sein.SceneActor) {
    actor.rigidBody.event.remove('Collision', this.handleCollision);
  }

  private handleCollision = ({otherActor}: Sein.ICollisionEvent) => {
    this.state.hit(otherActor.tag.equalsTo('strong'));

    this.getLevel<LevelState>().state.kill();
    otherActor.removeFromParent();
  }

  public onUpdate() {
    if (!this.actor) {
      return;
    }

    const {z: pawnZ, x: pawnX} = this.actor.transform;
    let zDistance = 0;
    let target: Sein.ISceneActor = null;

    Sein.findActorsByName(this.getWorld(), 'enemy', (actor: Sein.SceneActor) => {
      const distanceZ = actor.transform.z - pawnZ;

      if (zDistance > 0 && distanceZ > zDistance) {
        return true;
      }

      zDistance = distanceZ;
    }).forEach(actor => {
      const distanceZ = actor.transform.z - pawnZ;

      if (distanceZ < 0) {
        actor.removeFromParent();
        return;
      }

      if (actor.tag.equalsTo('strong')) {
        return;
      }

      target = actor;
    });

    if (!target) {
      this.actor.transform.translate(forwardVector, speed);
      return;
    }

    const distanceX = target.transform.x - pawnX;
    if (distanceX < -.5) {
      this.actor.transform.translate(rightVector, speed);
    } else if (distanceX > .5) {
      this.actor.transform.translate(rightVector, -speed);
    } else {
      this.actor.transform.translate(forwardVector, speed);
    }
  }
}

class LevelState extends Sein.StateActor {
  protected _killNum = 0;

  get killNum() {
    return this._killNum;
  }

  public kill () {
    this._killNum += 1;
  }
}

export default class MainScript extends Sein.LevelScriptActor<LevelState> {
  public static LevelStateClass = LevelState;

  private heroController: AIController;
  private hud: Sein.DomHUD.Actor;

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();
    const player = game.getPlayer();

    createDefaultLights(game);

    world.enablePhysic(
      new Sein.CannonPhysicWorld(
        (window as any).CANNON,
        new Sein.Vector3(0, 0, 0)
      ),
      false
    );

    const ground = world.addActor('ground', Sein.BSPBoxActor, {
      width: 40, height: .4, depth: 150,
      material: new Sein.BasicMaterial({diffuse: new Sein.Color(1, 1, 1)})
    });
    ground.transform.y = -.9;
    ground.transform.z = 70;

    const hero = world.addActor('hero', Sein.BSPSphereActor, {
      radius: .5,
      material: new Sein.BasicMaterial({diffuse: new Sein.Color(1, 0, 0)})
    });
    hero.addComponent('rigidBody', Sein.RigidBodyComponent, {mass: 1, physicStatic: true});
    hero.addComponent('collider', Sein.SphereColliderComponent, {radius: 1});

    const heroState = game.addActor('heroState', HeroState);
    this.heroController = world.addActor('heroController', AIController, {
      actor: hero, state: heroState, followActor: true
    });
    const camera = this.heroController.addComponent('camera', Sein.PerspectiveCameraComponent, {
      aspect: game.screenAspect,
      fov: 60,
      near: 0.01,
      far: 200,
      rotation: new Sein.Euler(0, Math.PI, 0),
      position: new Sein.Vector3(0, 2, -6)
    });
    camera.lookAt(hero);
    this.heroController.addComponent('control', Sein.CameraControls.CameraOrbitControlComponent, {
      cameraComponentName: 'camera',
      enableDamping: true,
      dampingFactor: .2,
      zoomMax: 10,
      zoomMin: .5,
      target: hero
    });

    this.createEnemies();

    player.switchController(this.heroController);

    this.createHUD();
  }

  public onUpdate() {
    const state = this.heroController.state;

    if (state.hp === 0) {
      this.hud.dom.innerText = `You dead! Kill: ${this.state.killNum}`;
      this.getGame().pause();
    } else {
      this.hud.dom.innerText = `HP: ${state.hp} Kill: ${this.state.killNum}`;
    }
  }

  private createHUD() {
    const dom = document.createElement('div');
    dom.style.width = '74px';
    dom.style.backgroundColor = '#f00';
    dom.style.color = '#fff';
    dom.style.textAlign = 'center';
    dom.style.lineHeight = '32px';
    dom.style.padding = '8px';

    this.hud = this.getWorld().addActor('hud', Sein.DomHUD.Actor, {dom});
  }

  private createEnemies() {
    const world = this.getWorld();
    const num = 100;
    const offset = 1.5;

    for (let index = 0; index < num; index += 1) {
      const left = ((index % 4) - offset) - .5;
      const x = (Math.random() + left) * 8;
      const y = 0;
      const z = (~~(index / 4) + 1) * 5;
      const isStrong = Math.random() < .5;

      const enemy = world.addActor('enemy', Sein.BSPBoxActor, {
        width: 1, height: 1, depth: 1,
        material: new Sein.BasicMaterial({diffuse: !isStrong ? new Sein.Color(0, 1, 0) : new Sein.Color(0, 0, 1)})
      });
      enemy.tag = new Sein.SName(isStrong ? 'strong' : 'normal');
      enemy.transform.setPosition(x, y, z);
      enemy.updateOnEverTick = false;
      enemy.addComponent('rigidBody', Sein.RigidBodyComponent, {mass: 1, physicStatic: true, unControl: true});
      enemy.addComponent('collider', Sein.BoxColliderComponent, {size: [1, 1, 1], isTrigger: true});
    }
  }
}
