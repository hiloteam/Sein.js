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

    // 首先注册音频加载器
    game.resource.register('Audio', Sein.Audio.Loader);

    // 在实际使用音频系统的所有功能之前，先至少添加一个音频系统
    game.addActor('audioSystem', Sein.Audio.SystemActor);

    // 加载音频
    game.resource.load({type: 'Audio', name: 'sakura.mp3', url: getStaticAssetUrl('/assets/audios/sakura.mp3')});
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

    // 添加一个音频源组件，默认添加一个clip，后面也可以通过`source.addClip`来添加。
    // 一般添加的第一个clip为默认clip，也可以通过`isDefault`指定。
    world.addActor('audioSource', Sein.Audio.SourceActor, {
      system: audioSystem,
      clips: [{
        name: 'sakura',
        clip: game.resource.get<'Audio'>('sakura.mp3')
      }],
      autoPlay: {loop: true}
    });

    // 添加一个监听器来让声音可以输出，你可以添加多个监听器，并用`listener.enable`来切换他们。
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
