/**
 * @File   : MainScript.tsx
 * @Author : AlchemyZJK (alchemyzjk@foxmail.com)
 * @Link   : 
 * @Date   : 8/23/2019, 4:57:19 PM
 */

import * as Sein from 'seinjs';
import {React} from 'seinjs-gui';

import {createDefaultCamera} from '../../utils';

class Checkbox0 extends Sein.GUI.Component<{}, {}> {
  public state = {clickedLabel: false};

  public render() {
    const game = this.system.getGame();
    return (
      <React.Fragment>
        <Sein.GUI.Checkbox
          shape={new Sein.Vector2(32, 32)}
          uncheckedAtlas={{atlas: game.resource.get<'Atlas'>('gui.json'), frame: 'unchecked'}}
          checkedAtlas={{atlas: game.resource.get<'Atlas'>('gui.json'), frame: 'checked'}}
          x={150}
          y={50}
          checked={this.state.clickedLabel}
          onCheck={checked => this.setState({clickedLabel: !checked})}
        />
        <Sein.GUI.Label
          shape={new Sein.Vector2(100, 32)}
          background={new Sein.Color(1.0, 0.4, 0.4, 1.0)}
          x={182}
          y={50}
          text={'Checkbox-0'}
          onTouchEnd={this.handleClickLabel}
        />
      </React.Fragment>
    );
  }

  handleClickLabel = () => {
    if (this.state.clickedLabel) {
      this.setState({clickedLabel: false});
    }
    else {
      this.setState({clickedLabel: true});
    }
  }
}

class Checkbox1 extends Sein.GUI.Component<{}, {}> {
  public state = {clickedLabel: false};

  public render() {
    const game = this.system.getGame();
    return (
      <React.Fragment>
        <Sein.GUI.Checkbox
          shape={new Sein.Vector2(32, 32)}
          uncheckedAtlas={{atlas: game.resource.get<'Atlas'>('gui.json'), frame: 'unchecked'}}
          checkedAtlas={{atlas: game.resource.get<'Atlas'>('gui.json'), frame: 'checked'}}
          x={300}
          y={50}
          checked={this.state.clickedLabel}
          onCheck={checked => this.setState({clickedLabel: !checked})}
        />
        <Sein.GUI.Label
          shape={new Sein.Vector2(100, 32)}
          background={new Sein.Color(1.0, 1.0, 0.4, 1.0)}
          x={332}
          y={50}
          text={'Checkbox-1'}
          onTouchEnd={this.handleClickLabel}
        />
      </React.Fragment>
    );
  }

  handleClickLabel = () => {
    if (this.state.clickedLabel) {
      this.setState({clickedLabel: false});
    }
    else {
      this.setState({clickedLabel: true});
    }
  }
}

class Checkbox2 extends Sein.GUI.Component<{}, {}> {
  public state = {clickedLabel: false};

  public render() {
    const game = this.system.getGame();
    return (
      <React.Fragment>
        <Sein.GUI.Checkbox
          shape={new Sein.Vector2(32, 32)}
          uncheckedAtlas={{atlas: game.resource.get<'Atlas'>('gui.json'), frame: 'unchecked'}}
          checkedAtlas={{atlas: game.resource.get<'Atlas'>('gui.json'), frame: 'checked'}}
          x={450}
          y={50}
          checked={this.state.clickedLabel}
          onCheck={checked => this.setState({clickedLabel: !checked})}
        />
        <Sein.GUI.Label
          shape={new Sein.Vector2(100, 32)}
          background={new Sein.Color(0.6, 0.8, 0.4, 1.0)}
          x={482}
          y={50}
          text={'Checkbox-2'}
          onTouchEnd={this.handleClickLabel}
        />
      </React.Fragment>
    );
  }

  handleClickLabel = () => {
    if (this.state.clickedLabel) {
      this.setState({clickedLabel: false});
    }
    else {
      this.setState({clickedLabel: true});
    }
  }
}

class RadioGroup extends Sein.GUI.Component<{}, {}> {
  public state = {clickedLabel: 'radiobutton-0'}

  public render() {
    const game = this.system.getGame();
    return (
      <React.Fragment>
        <Sein.GUI.RadioButton
          id={'radiobutton-0'}
          shape={new Sein.Vector2(32, 32)}
          unselectedAtlas={{atlas: game.resource.get<'Atlas'>('gui.json'), frame: 'unselected'}}
          selectedAtlas={{atlas: game.resource.get<'Atlas'>('gui.json'), frame: 'selected'}}
          x={150}
          y={120}
          selected={this.state.clickedLabel}
          onSelect={id => this.setState({clickedLabel: id})}
        />
        <Sein.GUI.Label
          id={'label-0'}
          shape={new Sein.Vector2(100, 32)}
          background={new Sein.Color(1.0, 0.6, 0.2, 1.0)}
          text={'RadioButton-0'}
          x={182}
          y={120}
          onTouchEnd={this.handleClickLabel0}
        />
        <Sein.GUI.RadioButton
          id={'radiobutton-1'}
          shape={new Sein.Vector2(32, 32)}
          unselectedAtlas={{atlas: game.resource.get<'Atlas'>('gui.json'), frame: 'unselected'}}
          selectedAtlas={{atlas: game.resource.get<'Atlas'>('gui.json'), frame: 'selected'}}
          x={150}
          y={170}
          selected={this.state.clickedLabel}
          onSelect={id => this.setState({clickedLabel: id})}
        />
        <Sein.GUI.Label
          id={'label-1'}
          shape={new Sein.Vector2(100, 32)}
          background={new Sein.Color(1.0, 1.0, 0.8, 1.0)}
          text={'RadioButton-1'}
          x={182}
          y={170}
          onTouchEnd={this.handleClickLabel1}
        />
        <Sein.GUI.RadioButton
          id={'radiobutton-2'}
          shape={new Sein.Vector2(32, 32)}
          unselectedAtlas={{atlas: game.resource.get<'Atlas'>('gui.json'), frame: 'unselected'}}
          selectedAtlas={{atlas: game.resource.get<'Atlas'>('gui.json'), frame: 'selected'}}
          x={150}
          y={220}
          selected={this.state.clickedLabel}
          onSelect={id => this.setState({clickedLabel: id})}
        />
        <Sein.GUI.Label
          id={'label-1'}
          shape={new Sein.Vector2(100, 32)}
          background={new Sein.Color(0.1, 0.6, 0.4, 1.0)}
          text={'RadioButton-2'}
          x={182}
          y={220}
          onTouchEnd={this.handleClickLabel2}
        />
      </React.Fragment>
    );
  }

  handleClickLabel0 = () => {
    this.setState({clickedLabel: 'radiobutton-0'});
  }

  handleClickLabel1 = () => {
    this.setState({clickedLabel: 'radiobutton-1'});
  }

  handleClickLabel2 = () => {
    this.setState({clickedLabel: 'radiobutton-2'});
  }
}

class Root extends Sein.GUI.Component<{}, {}> {
  public state = {
    checked: false
  };

  public render() {
    const game = this.system.getGame();

    return (
      <React.Fragment>
        <Sein.GUI.Checkbox
          id={'check-0'}
          shape={new Sein.Vector2(32, 32)}
          uncheckedAtlas={{atlas: game.resource.get<'Atlas'>('gui.json'), frame: 'unchecked'}}
          checkedAtlas={{atlas: game.resource.get<'Atlas'>('gui.json'), frame: 'checked'}}
          x={50}
          y={50}
          checked={this.state.checked}
          onCheck={checked => this.setState({checked: !checked})}
        />
        <Checkbox0/>
        <Checkbox1/>
        <Checkbox2/>
        <RadioGroup/>
      </React.Fragment>
    );
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();
    game.resource.load({type: 'Atlas', name: 'gui.json', url: '/assets/sprites/gui.json'});
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