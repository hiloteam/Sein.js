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
  private source: Sein.Audio.SourceActor;

  public onPreload() {
    const game = this.getGame();
    this.hud = createLoadingHUD(game);

    game.resource.register('Audio', Sein.Audio.Loader);
    game.addActor('audioSystem', Sein.Audio.SystemActor);

    game.resource.load({type: 'Audio', name: 'sakura.mp3', url: getStaticAssetUrl('/assets/audios/sakura.mp3'), mode: 'Buffer'});
  }

  public onLoading(state: Sein.IResourceState) {
    this.hud.update(state);
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    this.hud.destroy();

    const audioSystem = Sein.findActorByClass(game, Sein.Audio.SystemActor);
    world.addActor('audioListener', Sein.Audio.ListenerActor);
    this.source = world.addActor('audioSource1', Sein.Audio.SourceActor, {
      system: audioSystem,
      clips: [{
        name: 'sakura',
        clip: game.resource.get<'Audio'>('sakura.mp3')
      }],
      autoPlay: {loop: true}
    });

    const {audio} = this.source;
    game.event.add<{type: string, value: {loop: boolean, range: number[]}}>('AudioControl', ({type, value}) => {
      switch (type) {
        case 'Play':
          audio.play(null, {
            loop: value.loop,
            start: value.range[0],
            end: value.range[1]
          });
          break;
        case 'Pause':
          audio.pause();
          break;
        case 'Resume':
          audio.resume();
          break;
        case 'Stop':
          audio.stop();
          break;
        default:
          break;
      }
    });

    createDefaultLights(game);
    createDefaultCamera(game, {target: new Sein.Vector3(0, 0, 0), position: new Sein.Vector3(0, 20, 1)});
  }

  public onUpdate() {
    const {current} = this.source.audio;

    if (!current) {
      return;
    }

    this.getGame().event.trigger('AudioDetails', {
      paused: current.paused,
      stopt: current.stopt,
      currentTime: current.currentTime,
      duration: current.duration,
      range: current.range,
      loop: current.loop
    });
  }
}
