/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import {React} from 'seinjs-gui';

import {createDefaultCamera, createDefaultLights, loadSein, createSein} from '../../utils';

import config from './config';

interface IItem {
  type: 'category' | 'item';
  text: string;
  cID: string;
  id: string
};

const data: IItem[] = [];
config.forEach(category => {
  data.push({type: 'category', text: category.name, cID: category.id, id: ''});
  category.list.forEach(item => {
    data.push({type: 'item', text: item.name, cID: category.id, id: item.id});
  });
});

interface IStateTypes {
  opened: boolean;
}

class Root extends Sein.GUI.Component<{}, IStateTypes> {
  public state: IStateTypes = {
    opened: true
  }

  public render() {
    const game = this.system.getGame();

    return (
      <React.Fragment>
        <Sein.GUI.Label
          visibility={!this.state.opened}
          shape={new Sein.Vector2(140, 60)}
          x={20}
          y={20}
          fontSize={13}
          text={'设置'}
          onClick={() => {
            console.log('sss');
            this.setState({opened: true});
          }}
        />
        <Sein.GUI.Container
          visibility={this.state.opened}
          shape={new Sein.Vector2(game.bound.width, game.bound.height)}
          background={new Sein.Color(1.0, 1.0, 1.0, 0.4)}
          transparent
          onClick={() => this.setState({opened: false})}
        />
        <Sein.GUI.List
          visibility={this.state.opened}
          shape={new Sein.Vector2(180, game.bound.height)}
          itemWidth={140}
          itemHeight={40}
          columnNum={1}
          rowSpace={10}
          padding={new Sein.Vector4(20, 15, 20, 20)}
          background={new Sein.Color(0.2, 0.2, 0.2, 0.7)}
          data={data}
          renderItem={this.renderItem}
          scrollBar
        />
      </React.Fragment>
    );
  }

  private renderItem = (item: IItem, index: number, transform: {x: number, y: number}) => {
    return (
      <Sein.GUI.Label
        key={`${item.cID}/${item.id}`}
        shape={new Sein.Vector2(140, 40)}
        x={transform.x}
        y={transform.y}
        fontSize={item.type === 'category' ? 16 : 13}
        background={item.type === 'category' ? new Sein.Color(1, 1, 1, 1) : new Sein.Color(.9, .9, .9, 1)}
        text={item.text}
        onClick={() => {
          if (item.type === 'item') {
            console.log(item.text);
            // this.system.event.trigger('Switch', item);
          }
        }}
      />
    );
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();

    loadSein(game);
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state);
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    createDefaultCamera(game);
    createDefaultLights(game);
    createSein(game);

    // 在实际使用GUI系统的所有功能之前，先至少添加一个GUI系统
    const guiSystem = game.addActor('guiSystem', Sein.GUI.SystemActor);

    guiSystem.createLayer('ui', {
      priority: 0,
      element: <Root />,
    });
  }
}
