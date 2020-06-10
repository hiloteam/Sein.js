/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';

import {createDefaultCamera, createDefaultLights} from '../../utils';

export default class MainScript extends Sein.LevelScriptActor {

  public onPreload() {
    const game = this.getGame();

    game.resource.load({type: 'GlTF', name: 'pig.gltf', url: getStaticAssetUrl('/assets/models/pig/fairy_pig.gltf')});
    game.resource.load({type: 'GlTF', name: 'blue_pig.gltf', url: getStaticAssetUrl('/assets/models/blue_pig/fairy_pig.gltf')});
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state);
  }

  public onCreate() {
    const game = this.getGame();

    createDefaultCamera(game, {position: new Sein.Vector3(0, 1, -6), target: new Sein.Vector3(0, 1, 0)});
    createDefaultLights(game);

    const pig = game.resource.instantiate<'GlTF'>('pig.gltf').get(0);
    pig.transform.x += 3;
    // 修改蒙皮
    pig.findComponentByClass(Sein.SkeletalMeshComponent).changeSkin(game.resource.get<'GlTF'>('blue_pig.gltf').meshes[0]);
    pig.animator.play(null, Infinity);

    const pig2 = game.resource.instantiate<'GlTF'>('pig.gltf').get(0);
    const bluePig = game.resource.instantiate<'GlTF'>('blue_pig.gltf').get(0);
    // 修改骨架
    bluePig.findComponentByClass(Sein.SkeletalMeshComponent).changeSkeleton(pig2.findComponentByClass(Sein.SkeletalMeshComponent));
    pig2.visible = false;
    pig2.animator.play(null, Infinity);

    const pig3 = game.resource.instantiate<'GlTF'>('pig.gltf').get(0);
    pig3.transform.x -= 3;
    const oldComp = pig3.findComponentByClass(Sein.SkeletalMeshComponent);
    const {skeleton} = oldComp;
    const {geometry, material} = game.resource.get<'GlTF'>('blue_pig.gltf').meshes[0];
    // 删除原始模型，并从骨架新建
    pig3.removeComponent(oldComp);
    pig3.addComponent('blue_pig', Sein.SkeletalMeshComponent, {geometry, material, skeleton});
    pig3.animator.play(null, Infinity);
  }
}
