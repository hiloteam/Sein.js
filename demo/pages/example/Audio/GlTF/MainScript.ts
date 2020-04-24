/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import 'seinjs-audio';

export default class MainScript extends Sein.LevelScriptActor {
  public onCreate() {
    const game = this.getGame();

    game.resource.register('Audio', Sein.Audio.Loader);
    game.addActor('audioSystem', Sein.Audio.SystemActor);
    game.resource.load({type: 'GlTF', name: 'bird.gltf', url: getStaticAssetUrl('/assets/models/bird/bird.gltf')})
      .then(result => {
        console.log(result);
        const actors = game.resource.instantiate<'GlTF'>('bird.gltf');
        console.log(actors);

        const bird = actors.findByName('bird');
        const camera = actors.findByName('MainCamera');
        camera.addComponent('control', Sein.CameraControls.CameraOrbitControlComponent, {
          enableDamping: true,
          dampingFactor: .2,
          zoomMax: 100,
          zoomMin: .1,
          target: new Sein.Vector3(0, 0, 0)
        });

        bird.animator.play(null, Infinity);
      });
  }
}
