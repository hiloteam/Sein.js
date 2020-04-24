/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import {React} from 'seinjs-gui';

import {createDefaultCamera} from '../../utils';

class Root1 extends Sein.GUI.Component<{}, {}> {
  public state = {inited: false};

  public componentDidMount() {
    this.setState({inited: true});
  }

  public render() {
    return (
      <Sein.GUI.Container
        id={'root-1'}
        shape={new Sein.Vector2(200, 200)}
        x={500} y={100}
        background={new Sein.Color(0.85, 0.32, 0.48, 1.0)}
        rotation={Math.PI/4}
      >
        <Sein.GUI.Container
          id={'child-1'}
          shape={new Sein.Vector2(100, 100)}
          background={new Sein.Color(0.3, 0.5, 0.85, 1.0)}
          x={70}  y={50}
        />
        {/* {this.state.inited && [<Sein.GUI.Container shape={new Sein.Vector2(1, 1)} />]} */}
        <Sein.GUI.Container
          id={'child-2'}
          shape={new Sein.Vector2(70, 50)}
          background={new Sein.Color(0.5, 0.7, 0.3, 1.0)}/>
      </Sein.GUI.Container>
    );
  }
}

class Root extends Sein.GUI.Component<{}, {}> {
  public render() {
    const game = this.system.getGame();

    return (
      <React.Fragment>
        <Sein.GUI.Container
          id={'root-0'}
          shape={new Sein.Vector2(300, 200)}
          x={120} y={100}>
          <Sein.GUI.Container
            id={'child-0'}
            shape={new Sein.Vector2(128, 128)}
            background={game.resource.get<'Texture'>('paradise.jpg')}
            x={100}
          />
        </Sein.GUI.Container>
        <Root1 />
        <Sein.GUI.Container
          id={'root-2'}
          shape={new Sein.Vector2(100, 100)}
          x={10}y={150}
          background={{atlas: game.resource.get<'Atlas'>('22.json'), frame: '01'}}
          transparent={true}/>
      </React.Fragment>
    );
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();

    game.resource.load({type: 'Texture', url: getStaticAssetUrl('/assets/paradise.jpg'), name: 'paradise.jpg', flipY: true});
    game.resource.load({type: 'Atlas', name: '22.json', url: getStaticAssetUrl('/assets/sprites/22.json')});
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state);
  }

  public onCreate() {
    const game = this.getGame();

    createDefaultCamera(game);

    // 在实际使用GUI系统的所有功能之前，先至少添加一个GUI系统
    const guiSystem = game.addActor('guiSystem', Sein.GUI.SystemActor);

    guiSystem.createLayer('ui', {
      priority: 0,
      element: <Root />,
    });
  }
}
