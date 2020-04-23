/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-audio';

import {createDefaultLights, createDefaultCamera, createLoadingHUD} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  private hud: any;

  public onPreload() {
    const game = this.getGame();
    this.hud = createLoadingHUD(game);

    game.resource.register('Audio', Sein.Audio.Loader);
    game.addActor('audioSystem', Sein.Audio.SystemActor);

    game.resource.load({type: 'Audio', name: 'sakura.mp3', url: '/assets/audios/sakura.mp3'});
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

    // 添加音频源
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
      position: new Sein.Vector3(0, 0, 0)
    });
    source1.addComponent('sphere', Sein.BSPSphereComponent, {
      radius: source1.audio.spaceOption.maxDistance,
      material: new Sein.PBRMaterial({baseColor: new Sein.Color(1, 0, 0, 1), wireframe: true})
    });

    // 添加两个监听器，分别在不同位置
    const listener1 = world.addActor('audioListener', Sein.Audio.ListenerActor, {
      position: new Sein.Vector3(-5, 0, 0)
    });
    listener1.addComponent('sphere', Sein.BSPSphereComponent, {
      radius: .4,
      material: new Sein.PBRMaterial({baseColor: new Sein.Color(0, 1, 0, 1)})
    });

    const listener2 = world.addActor('audioListener', Sein.Audio.ListenerActor, {
      position: new Sein.Vector3(5, 0, 0)
    });
    listener2.addComponent('sphere', Sein.BSPSphereComponent, {
      radius: .4,
      material: new Sein.PBRMaterial({baseColor: new Sein.Color(0, 0, 1, 1)})
    });

    game.event.add<number>('AudioControl', (value) => {
      if (value === 1) {
        listener1.enable();
      } else {
        listener2.enable();
      }
    });

    createDefaultLights(game);
    createDefaultCamera(game, {target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 20, 1)});
  }
}
