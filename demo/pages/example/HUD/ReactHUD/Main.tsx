/**
 * @File   : Main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import * as React from 'react';
import * as cx from 'classnames';
import 'seinjs-react-hud';

import {config, createDefaultLights, createDefaultCamera, createSein, loadSein} from '../../utils';

class ActorHUD extends React.PureComponent<{actor: Sein.SceneActor, game: Sein.Game}> {
  public render() {
    if (!this.props.game) {
      return;
    }

    return (
      <Sein.ReactHUD.Container
        name={'sphere-hud'}
        game={this.props.game}
        target={this.props.actor}
        offsetY={-10}
      >
        <div
          style={{
            background: '#f00',
            color: '#fff',
            padding: 6
          }}
        >
          {this.props.actor.name.value}
        </div>
      </Sein.ReactHUD.Container>
    );
  }
}

class HUDGUIActions extends React.PureComponent<{hudActor: Sein.SceneActor}> {
  public componentDidMount() {
    const {event} = this.props.hudActor;

    if (!event.has('AddBox')) {
      this.props.hudActor.event.register('AddBox');
    }

    if (!event.has('ClearBox')) {
      this.props.hudActor.event.register('ClearBox');
    }
  }

  public render() {
    return (
      <div
        style={{
          padding: 12,
          background: 'rgba(.4, .4, .4, .4)',
          color: '#fff',
          textAlign: 'center',
          lineHeight: 2,
          cursor: 'pointer',
          pointerEvents: 'all'
        }}
      >
        <div onClick={() => this.props.hudActor.event.trigger('AddBox')}>Add box</div>
        <div onClick={() => this.props.hudActor.event.trigger('ClearBox')}>Clear box</div>
      </div>
    )
  }
}

class HUDGUI extends React.PureComponent<{game: Sein.Game}> {
  public componentDidMount() {
    this.props.game.event.trigger('GUIHasReady');
  }

  public render() {
    if (!this.props.game) {
      return null;
    }

    return (
      <Sein.ReactHUD.Container
        name={'main-ui'}
        game={this.props.game}
      >
        <Sein.ReactHUD.Consumer>
          {context => <HUDGUIActions {...context} />}
        </Sein.ReactHUD.Consumer>
      </Sein.ReactHUD.Container>
    );
  }
}

class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    loadSein(this.getGame());
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    createSein(game);
    createDefaultLights(game);
    createDefaultCamera(game);

    game.event.add('GUIHasReady', () => {
      const gui = Sein.findActorByName(world, 'main-ui');

      gui.event.add('AddBox', () => {
        console.log('add');
        const box = world.addActor(null, Sein.BSPBoxActor,
        {
          width: 1, height: 1, depth: 1,
          material: new Sein.BasicMaterial({diffuse: new Sein.Color(0, 1, 1)})
        });
        box.tag = new Sein.SName('box');
        box.transform.setPosition(20 - Math.random() * 40, Math.random() * 40, Math.random() * 20);
      });

      gui.event.add('ClearBox', () => {
        Sein.findActorsByTag(world, 'box').forEach(box => box.removeFromParent());
      });
    });
  }
}

export default class Main extends React.PureComponent {
  private canvas: React.RefObject<HTMLCanvasElement> = React.createRef();
  private engine: Sein.Engine;
  private game: Sein.Game;

  public componentDidMount() {
    const canvas = this.canvas.current;

    this.engine = new Sein.Engine();

    const game = this.game = new Sein.Game(
      'intro-game',
      {
        canvas,
        clearColor: config.background,
        width: canvas.offsetWidth,
        height: canvas.offsetHeight
      }
    );

    this.engine.addGame(game);

    game.addWorld('main', Sein.GameModeActor, MainScript);

    game.start();

    game.event.add('LevelDidCreateActors', () => {
      this.forceUpdate();
    });
  }

  public componentWillUnmount() {
    this.engine.destroy();
  }

  public componentDidUpdate() {

  }

  public render() {
    return (
      <React.Fragment>
        <canvas
          className={cx('example-game-canvas')}
          ref={this.canvas}
        />
        {this.renderActorHUD()}
        {this.renderHUDGUI()}
      </React.Fragment>
    );
  }

  private renderActorHUD() {
    if (!this.game) {
      return;
    }

    return (
      <ActorHUD
        game={this.game}
        actor={Sein.findActorByName(this.game.world, 'Sphere')}
      />
    )
  }

  private renderHUDGUI() {
    if (!this.game) {
      return;
    }

    return (
      <HUDGUI game={this.game} />
    );
  }
}
