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

    // 添加多个系统
    game.addActor('bgmSystem', Sein.Audio.SystemActor);
    game.addActor('soundSystem', Sein.Audio.SystemActor);

    game.resource.load({type: 'Audio', name: 'sakura.mp3', url: '/assets/audios/sakura.mp3'});
    game.resource.load({type: 'Audio', name: 'clock.mp3', url: '/assets/audios/clock.mp3', mode: 'Buffer'});
  }

  public onLoading(state: Sein.IResourceState) {
    this.hud.update(state);
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    this.hud.destroy();

    // 找到你需要将音频源添加到的系统
    const bgmSystem = Sein.findActorByName<Sein.Audio.SystemActor>(game, 'bgmSystem');
    const soundSystem = Sein.findActorByName<Sein.Audio.SystemActor>(game, 'soundSystem');

    // 添加两个音频源到不同的系统
    world.addActor('audioSource1', Sein.Audio.SourceActor, {
      system: bgmSystem,
      clips: [{
        name: 'sakura',
        clip: game.resource.get<'Audio'>('sakura.mp3')
      }],
      autoPlay: {loop: true}
    });
    world.addActor('clock', Sein.Audio.SourceActor, {
      system: soundSystem,
      clips: [{
        name: 'clock',
        clip: game.resource.get<'Audio'>('clock.mp3')
      }],
      autoPlay: {loop: true}
    });

    world.addActor('audioListener', Sein.Audio.ListenerActor);

    game.event.add<{name: string, value: number}>('AudioControl', ({name, value}) => {
      switch (name) {
        // 设置BGM系统的音量
        case 'BGM':
          bgmSystem.volume = value;
          break;
        // 设置Sound系统的音量
        case 'Sound':
          soundSystem.volume = value;
          break;
        default:
          break;
      }
    });

    game.event.add<{name: string, value: number}>('AudioSwitch', ({name}) => {
      let system: Sein.Audio.SystemActor;
      switch (name) {
        // 设置BGM系统的音量
        case 'BGM':
          system = bgmSystem;
          break;
        // 设置Sound系统的音量
        case 'Sound':
          system = soundSystem;
          break;
        default:
          break;
      }

      if (system.context.state === 'running') {
        system.pause();
      } else {
        system.resume();
      }
    });

    createDefaultLights(game);
    createDefaultCamera(game, {target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 20, 5)});
  }
}
