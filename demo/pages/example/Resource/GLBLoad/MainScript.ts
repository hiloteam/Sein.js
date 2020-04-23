/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-audio';

import {createDefaultCamera, createDefaultLights} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {
  public onCreate() {
    const game = this.getGame();

    // 首先注册音频加载器
    game.resource.register('Audio', Sein.Audio.Loader);

    // 在实际使用音频系统的所有功能之前，先至少添加一个音频系统
    game.addActor('audioSystem', Sein.Audio.SystemActor);

    const camera = createDefaultCamera(game, {target: new Sein.Vector3(.2, 0, 0), position: new Sein.Vector3(.2, 0, 1)});
    camera.addComponent('listener', Sein.Audio.ListenerComponent);
    createDefaultLights(game);
    game.resource.load({type: 'GlTF', name: 'bird.glb', url: '/assets/models/bird/bird.glb'})
      .then(result => {
        console.log(result);
        game.resource.instantiate<'GlTF'>('bird.glb').forEach(actor => {
          actor.animator.play(null, Infinity);
        });
      });
  }
}
