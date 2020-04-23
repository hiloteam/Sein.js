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
    game.resource.load({type: 'Audio', name: 'subarashii.mp3', url: '/assets/audios/subarashii.mp3'});
  }

  public onLoading(state: Sein.IResourceState) {
    this.hud.update(state);
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    this.hud.destroy();

    const audioSystem = Sein.findActorByClass(game, Sein.Audio.SystemActor);
    const source1 = world.addActor('audioSource1', Sein.Audio.SourceActor, {
      system: audioSystem,
      clips: [{
        name: 'sakura',
        clip: game.resource.get<'Audio'>('sakura.mp3')
      }],
      autoPlay: {loop: true}
    });
    const source2 = world.addActor('audioSource2', Sein.Audio.SourceActor, {
      system: audioSystem,
      clips: [{
        name: 'subarashi',
        clip: game.resource.get<'Audio'>('subarashii.mp3')
      }],
      autoPlay: {loop: true}
    });
    const listener = world.addActor('audioListener', Sein.Audio.ListenerActor);

    game.event.add<{name: string, value: number}>('AudioControl', ({name, value}) => {
      switch (name) {
        // 设置音频源1的音量
        case 'Source1':
          source1.audio.volume = value;
          break;
        // 设置音频源2的音量
        case 'Source2':
          source2.audio.volume = value;
          break;
        // 设置总体的音量
        case 'System':
          audioSystem.volume = value;
          break;
        // 设置监听器的音量
        case 'Listener':
            listener.listener.volume = value;
          break;
        default:
          break;
      }
    });

    createDefaultLights(game);
    createDefaultCamera(game, {target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 20, 5)});
  }
}
