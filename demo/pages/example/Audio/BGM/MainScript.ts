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
    game.resource.load({type: 'Audio', name: 'sakura.mp3', url: getStaticAssetUrl('/assets/audios/sakura.mp3')});
  }

  public onLoading(state: Sein.IResourceState) {
    this.hud.update(state);
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    this.hud.destroy();

    const audioSystem = Sein.findActorByClass(game, Sein.Audio.SystemActor);

    world.addActor('audioSource', Sein.Audio.SourceActor, {
      system: audioSystem,
      clips: [{
        name: 'sakura',
        clip: game.resource.get<'Audio'>('sakura.mp3')
      }],
      autoPlay: {loop: true}
    });

    const box = world.addActor('box', Sein.BSPBoxActor, {
      width: 2, height: 2, depth: 2,
      material: new Sein.BasicMaterial({
        diffuse: config.theme,
        lightType: 'PHONG'
      })
    });

    // 向立方体下面添加一个音频源组件
    box.addComponent('audioSource', Sein.Audio.SourceComponent, {
      system: audioSystem,
      clips: [{
        name: 'sakura',
        clip: game.resource.get<'Audio'>('sakura.mp3')
      }],
      autoPlay: {loop: true}
    });

    // 向立方体下面添加一个监听器组件
    box.addComponent('audioListener', Sein.Audio.ListenerComponent);

    createDefaultLights(game);
    createDefaultCamera(game, {target: box, position: new Sein.Vector3(0, 0, 6)});
  }
}
