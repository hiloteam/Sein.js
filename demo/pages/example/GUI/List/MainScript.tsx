/**
 * @File   : MainScript.tsx
 * @Author : AlchemyZJK (alchemyzjk@foxmail.com)
 * @Link   : 
 * @Date   : 8/23/2019, 3:28:21 PM
 */

import * as Sein from 'seinjs';
import {React} from 'seinjs-gui';

import {createDefaultCamera} from '../../utils';

class List extends React.Component {
  public render() {
    return (
      <Sein.GUI.List
        shape={new Sein.Vector2(220, 300)}
        itemWidth={80}
        itemHeight={80}
        rowSpace={10}
        columnNum={2}
        padding={new Sein.Vector4(5, 30, 5, 10)}
        x={100}
        y={50}
        data={[
          {shape: new Sein.Vector2(80, 80), background: new Sein.Color(0.8, 0.6, 0.4)}, 
          {shape: new Sein.Vector2(80, 80), background: new Sein.Color(0.8, 0.4, 0.6)},
          {shape: new Sein.Vector2(80, 80), background: new Sein.Color(0.6, 0.8, 0.4)},
          {shape: new Sein.Vector2(80, 80), background: new Sein.Color(0.6, 0.4, 0.8)},
          {shape: new Sein.Vector2(80, 80), background: new Sein.Color(0.4, 0.8, 0.6)},
          {shape: new Sein.Vector2(80, 80), background: new Sein.Color(0.4, 0.6, 0.8)},
          {shape: new Sein.Vector2(80, 80), background: new Sein.Color(0.6, 0.4, 0.2)},
          {shape: new Sein.Vector2(80, 80), background: new Sein.Color(0.6, 0.2, 0.4)}
        ]}
        renderItem={(data: any, index: number, transform: {x: number, y: number}) => (
          <Sein.GUI.Container
            key={index}
            shape={data.shape}
            x={transform.x}
            y={transform.y}
            background={data.background}
          />
        )}
        scrollBar={true}
        renderScrollBar={(percent, height, onScroll) => (
          <Sein.GUI.SliderBar
            shape={new Sein.Vector2(20, height)}
            x={300}
            y={50}
            layout={'column'}
            percent={percent}
            onChange={onScroll}
            trackBackground={new Sein.Color(0.8, 0.8, 0.8)}
            pieceBackground={new Sein.Color(0.8, 0.8, 0.8)}
            thumbShape={new Sein.Vector2(20, 100)}
            thumbBackground={new Sein.Color(0.6, 0.6, 0.6)}
          />
        )}
        initialPos={40}
      />
    );
  }
}

class Root extends React.Component {
  public render() {
    return (
      <List/>
    );
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();
    game.resource.load({type: 'Texture', url: getStaticAssetUrl('/assets/paradise.jpg'), name: 'paradise.jpg', flipY: true});
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state);
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    createDefaultCamera(game);

    // 在实际使用GUI系统的所有功能之前，先至少添加一个GUI系统
    const guiSystem = game.addActor('guiSystem', Sein.GUI.SystemActor);

    guiSystem.createLayer('ui', {
      priority: 0,
      element: <Root />
    });
  }
}