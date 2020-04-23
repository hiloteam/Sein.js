/**
 * @File   : MainScript.tsx
 * @Author : AlchemyZJK (alchemyzjk@foxmail.com)
 * @Link   : 
 * @Date   : 8/28/2019, 11:07:57 AM
 */

import * as Sein from 'seinjs';
import {React} from 'seinjs-gui';

import {createDefaultCamera} from '../../utils';

class ProcessBar extends Sein.GUI.Component {
  public state = {process: 0.8}
  private _startX = 400;
  private _length = 400;

  private _timeId;

  public componentDidMount() {
    this._timeId = setInterval(
      () => {this.setState({process: new Date().getMilliseconds() / 1000})},
      20
    );
  }

  public componentWillUnmount() {
    clearInterval(this._timeId);
  }

  public render() {
    return (
      <React.Fragment>
        <Sein.GUI.Container
          shape={new Sein.Vector2(this._length, 20)}
          background={new Sein.Color(0.4, 0.4, 0.6, 1.0)}
          x={this._startX}
          y={50}
        />
        <Sein.GUI.Slider
          shape={new Sein.Vector2(this._length, 20)}
          background={new Sein.Color(1.0, 0.8, 0.2, 1.0)}
          x={this._startX}
          y={50}
          layout={'row'}
          percent={this.state.process}
        />
      </React.Fragment>
    );
  }
}

class ProcessBarWithCursor extends Sein.GUI.Component {
  public state = {process: 0.8}
  private _startX = 400;
  private _length = 400;
  private _cursorSize = 30;

  private _timeId;

  public componentDidMount() {
    this._timeId = setInterval(
      () => {this.setState({process: new Date().getMilliseconds() / 1000})},
      20
    );
  }

  public componentWillUnmount() {
    clearInterval(this._timeId);
  }

  public render() {
    return (
      <React.Fragment>
        <Sein.GUI.Container
          shape={new Sein.Vector2(this._length, 20)}
          background={new Sein.Color(0.4, 0.4, 0.6, 1.0)}
          x={this._startX}
          y={120}
        />
        <Sein.GUI.Slider
          shape={new Sein.Vector2(this._length, 20)}
          background={new Sein.Color(1.0, 0.8, 0.2, 1.0)}
          x={this._startX}
          y={120}
          layout={'row'}
          percent={this.state.process}
        />
        <Sein.GUI.Container
          shape={new Sein.Vector2(this._cursorSize, this._cursorSize)}
          background={new Sein.Color(1.0, 1.0, 1.0, 1.0)}
          x={this._startX + this.state.process * this._length - this._cursorSize / 2}
          y={115} // slider.y - (cursor.height - slider.height) / 2
        />
      </React.Fragment>
    );
  }
}

class RowSliderBar extends Sein.GUI.Component {
  public state = {percent: 0.8};
  public render() {
    return (
      <Sein.GUI.SliderBar
        shape={new Sein.Vector2(250, 20)}
        x={50}
        y={50}
        layout={'row'}
        percent={this.state.percent}
        trackBackground={new Sein.Color(1.0, 1.0, 1.0)}
        pieceBackground={new Sein.Color(0.4, 0.4, 0.6)}
        thumbShape={new Sein.Vector2(30, 30)}
        thumbBackground={new Sein.Color(1.0, 0.8, 0.2)}
      />
    );
  }
}

class ColumnSliderBar extends Sein.GUI.Component {
  public state = {percent: 0.8};
  public render() {
    return (
      <Sein.GUI.SliderBar
        shape={new Sein.Vector2(20, 250)}
        x={150}
        y={100}
        layout={'column'}
        percent={this.state.percent}
        trackBackground={new Sein.Color(1.0, 1.0, 1.0)}
        pieceBackground={new Sein.Color(0.4, 0.4, 0.6)}
        thumbShape={new Sein.Vector2(30, 30)}
        thumbBackground={new Sein.Color(1.0, 0.8, 0.2)}
      />
    );
  }
}

class Root extends Sein.GUI.Component {
  public render() {
    return (
      <React.Fragment>
        <RowSliderBar/>
        <ColumnSliderBar/>
        <ProcessBar/>
        <ProcessBarWithCursor/>
      </React.Fragment>
    );
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
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
      element: <Root />
    });
  }
}