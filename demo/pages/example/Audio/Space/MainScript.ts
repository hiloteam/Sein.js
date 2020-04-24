/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-audio';

import {createDefaultLights, createDefaultCamera, createLoadingHUD} from '../../utils';

const forwardVector = new Sein.Vector3(0, 0, -1);
const rightVector = new Sein.Vector3(1, 0, 0);
const speed = .2;
const activeKeys: {[keyCode: number]: boolean} = {};

class MoveComponent extends Sein.Component {
  public onAdd() {
    this.getGame().hid.add('KeyDown', this.handleKey);
    this.getGame().hid.add('KeyUp', this.handleKey);
  }

  private handleKey = (event: Sein.IKeyboardEvent) => {
    if (event.type === 'keydown') {
      activeKeys[event.keyCode] = true;
    } else {
      activeKeys[event.keyCode] = false;
    }
  }

  public onUpdate() {
    const {transform} = this.getOwner<Sein.Audio.ListenerActor>();

    // w
    if (activeKeys[87]) {
      transform.translate(forwardVector, speed);
    }

    // s
    if (activeKeys[83]) {
      transform.translate(forwardVector, -speed);
    }

    // a
    if (activeKeys[65]) {
      transform.translate(rightVector, -speed);
    }

    // d
    if (activeKeys[68]) {
      transform.translate(rightVector, speed);
    }
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  private hud: any;

  public onPreload() {
    const game = this.getGame();
    this.hud = createLoadingHUD(game);

    game.resource.register('Audio', Sein.Audio.Loader);
    game.addActor('audioSystem', Sein.Audio.SystemActor);

    game.resource.load({type: 'Audio', name: 'sakura.mp3', url: getStaticAssetUrl('/assets/audios/sakura.mp3')});
    game.resource.load({type: 'Audio', name: 'subarashii.mp3', url: getStaticAssetUrl('/assets/audios/subarashii.mp3')});
  }

  public onLoading(state: Sein.IResourceState) {
    this.hud.update(state);
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    this.hud.destroy();

    // 找到你需要将音频源添加到的系统
    const audioSystem = Sein.findActorByClass(game, Sein.Audio.SystemActor);

    // 添加两个音频源，启用spaceOption，并设置其位置和`maxDistance`
    const source1 = world.addActor('audioSource1', Sein.Audio.SourceActor, {
      system: audioSystem,
      clips: [{
        name: 'sakura',
        clip: game.resource.get<'Audio'>('sakura.mp3')
      }],
      spaceOptions: {
        maxDistance: 10
      },
      autoPlay: {loop: true},
      position: new Sein.Vector3(-5, 0, 0)
    });
    const source2 = world.addActor('audioSource2', Sein.Audio.SourceActor, {
      system: audioSystem,
      clips: [{
        name: 'subarashi',
        clip: game.resource.get<'Audio'>('subarashii.mp3')
      }],
      spaceOptions: {
        maxDistance: 10,
        panningModel: 'HRTF'
      },
      autoPlay: {loop: true},
      position: new Sein.Vector3(5, 0, 0)
    });

    // 为音源添加可视化的范围
    source1.addComponent('sphere', Sein.BSPSphereComponent, {
      radius: source1.audio.spaceOption.maxDistance,
      material: new Sein.PBRMaterial({baseColor: new Sein.Color(0, 1, 0, 1), wireframe: true})
    });
    source2.addComponent('sphere', Sein.BSPSphereComponent, {
      radius: source2.audio.spaceOption.maxDistance,
      material: new Sein.PBRMaterial({baseColor: new Sein.Color(0, 0, 1, 1), wireframe: true})
    });

    // 添加一个监听器来让声音可以输出，你可以添加多个监听器，并用`listener.enable`来切换他们。
    const listener = world.addActor('audioListener', Sein.Audio.ListenerActor);
    listener.addComponent('sphere', Sein.BSPSphereComponent, {
      radius: .4,
      material: new Sein.PBRMaterial({baseColor: new Sein.Color(1, 0, 0, 1)})
    });
    listener.addComponent('move', MoveComponent);

    createDefaultLights(game);
    createDefaultCamera(game, {target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 20, 5)});
  }
}
