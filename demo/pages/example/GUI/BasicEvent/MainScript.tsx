/**
 * @File   : MainScript.tsx
 * @Author : AlchemyZJK (alchemyzjk@foxmail.com)
 * @Link   : 
 * @Date   : 8/21/2019, 3:54:40 PM
 */

import * as Sein from 'seinjs';
import {React} from 'seinjs-gui';

import {createDefaultCamera, createDefaultLights} from '../../utils';

class Root extends Sein.GUI.Component<{}, {}> {
    public render() {
      return (
        <React.Fragment>
          {/* <Sein.GUI.Container
            shape={new Sein.Vector2(800, 400)}
            background={new Sein.Color(0.4, 0.6, 0.8)}
            visibility={false}
          /> */}
          <Sein.GUI.Container
            shape={new Sein.Vector2(200, 200)}
            x={100} y={100}
            onTouchStart={()=>{console.log('TOUCHSTART_ROOT_0')}}
            onTouchMove={()=>{console.log('TOUCHMOVE_ROOT_0')}}
            onTouchEnd={()=>{console.log('TOUCHEND_ROOT_0')}}
            onTouchCancel={()=>{console.log('TOUCHCANCEL_ROOT_0')}}
            onClick={()=>{console.log('CLICK_ROOT_0')}}
          >
            <Sein.GUI.Container
              shape={new Sein.Vector2(100, 50)}
              background={new Sein.Color(0, 0, 0, 1.0)}
              x={20}  y={50}
              onClick={()=>{console.log('CLICK_CHILD_0')}}
            />
            <Sein.GUI.Container
              shape={new Sein.Vector2(50, 50)}
              background={new Sein.Color(0.5, 0.5, 0.5, 1.0)}
              x={120} y={120}
              onTouchStart={()=>{console.log('TOUCHSTART_CHILD_1')}}
              onTouchMove={()=>{console.log('TOUCHMOVE_CHILD_1')}}
              onTouchEnd={()=>{console.log('TOUCHEND_CHILD_1')}}
              onTouchCancel={()=>{console.log('TOUCHCANCEL_CHILD_1')}}
            />
          </Sein.GUI.Container>

          <Sein.GUI.Container
            id={'root-1'}
            shape={new Sein.Vector2(200, 200)}
            x={500} y={100}
            background={new Sein.Color(0.85, 0.32, 0.48, 1.0)}
            rotation={Math.PI/4}
            onTouchStart={()=>{console.log('TOUCHSTART_ROOT_1')}}
            onTouchMove={()=>{console.log('TOUCHMOVE_ROOT_1')}}
            onTouchEnd={()=>{console.log('TOUCHEND_ROOT_1')}}
          >
            <Sein.GUI.Container
              id={'child-2'}
              shape={new Sein.Vector2(100, 100)}
              background={new Sein.Color(0.3, 0.5, 0.85, 1.0)} 
              x={70}  y={50}
              onTouchStart={()=>{console.log('TOUCHSTART_CHILD_2')}}
              onTouchMove={()=>{console.log('TOUCHMOVE_CHILD_2')}}
              onTouchEnd={()=>{console.log('TOUCHEND_CHILD_2')}}
            />
            <Sein.GUI.Container
              id={'child-3'}
              shape={new Sein.Vector2(70, 50)}
              background={new Sein.Color(0.5, 0.7, 0.3, 1.0)}
            />
          </Sein.GUI.Container>
        </React.Fragment>
      );
    }
  }

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state);
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    createDefaultCamera(game);
    createDefaultLights(game);

    // 在实际使用GUI系统的所有功能之前，先至少添加一个GUI系统
    const guiSystem = game.addActor('guiSystem', Sein.GUI.SystemActor);

    guiSystem.createLayer('ui', {
      priority: 0,
      element: <Root/>,
    });

    // 加入三维世界的物体进行测试（UI的交互事件不穿透到三维世界）
    world.addActor('box', Sein.BSPBoxActor, {
      width: 5, height: 5, depth: 5,
      material: new Sein.BasicMaterial({diffuse: new Sein.Color(0.9, 0.3, 0.2)}),
      position: new Sein.Vector3(0, 5, 0)
    });
  }
}
