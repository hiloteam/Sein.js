/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-audio';

import {createDefaultLights, createDefaultCamera, config, createLoadingHUD} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  private hud: any;

  public onPreload() {
    const game = this.getGame();
    this.hud = createLoadingHUD(game);

    game.resource.register('Audio', Sein.Audio.Loader);
    game.addActor('audioSystem', Sein.Audio.SystemActor);

    // Stream模式，惰性加载
    game.resource.load({type: 'Audio', mode: 'Stream', isLazy: true, name: 'sakura.mp3', url: getStaticAssetUrl('/assets/audios/sakura.mp3')});
    // Buffer模式，惰性加载
    game.resource.load({type: 'Audio', mode: 'Buffer', isLazy: true, name: 'clock.mp3', url: getStaticAssetUrl('/assets/audios/clock.mp3')});
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

    // Stream模式的音频
    world.addActor('streamSource', Sein.Audio.SourceActor, {
      system: audioSystem,
      clips: [{
        name: 'sakura',
        clip: game.resource.get<'Audio'>('sakura.mp3')
      }],
      autoPlay: {loop: true}
    });

    // Buffer模式的音频
    world.addActor('bufferSource', Sein.Audio.SourceActor, {
      system: audioSystem,
      clips: [{
        name: 'clock',
        clip: game.resource.get<'Audio'>('clock.mp3')
      }],
      autoPlay: {loop: true}
    });

    world.addActor('audioListener', Sein.Audio.ListenerActor);

    const box = world.addActor('box', Sein.BSPBoxActor, {
      width: 2, height: 2, depth: 2,
      material: new Sein.BasicMaterial({
        diffuse: config.theme,
        lightType: 'PHONG'
      })
    });
    createDefaultLights(game);
    createDefaultCamera(game, {target: box, position: new Sein.Vector3(0, 0, 6)});
  }
}
