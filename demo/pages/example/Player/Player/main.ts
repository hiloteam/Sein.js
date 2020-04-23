/**
 * @File   : main.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/5/2018, 3:41:53 PM
 * @Description:
 */
import * as Sein from 'seinjs';
import {config, loadSein, createSein, createDefaultCamera, createDefaultLights} from '../../utils';

const forwardVector = new Sein.Vector3(0, 0, 1);
const backVector = new Sein.Vector3(0, 0, -1);
const leftVector = new Sein.Vector3(1, 0, 0);
const rightVector = new Sein.Vector3(-1, 0, 0);
const speed = .2;
const activeKeys: {[keyCode: number]: boolean} = {};

class SeinPlayer extends Sein.Player {
  public onSwitchController() {
    this.getGame().hid.add('KeyDown', this.handleKey);
    this.getGame().hid.add('KeyUp', this.handleKey);
  }

  public onReleaseController() {
    this.getGame().hid.remove('KeyDown', this.handleKey);
    this.getGame().hid.remove('KeyUp', this.handleKey);
  }

  public onUpdate() {
    const controller = this.getController<SeinController>();

    if (!controller) {
      return;
    }

    // w
    if (activeKeys[87]) {
      controller.move(forwardVector, speed);
    }

    // s
    if (activeKeys[83]) {
      controller.move(backVector, speed);
    }

    // a
    if (activeKeys[65]) {
      controller.move(leftVector, speed);
    }

    // d
    if (activeKeys[68]) {
      controller.move(rightVector, speed);
    }
  }

  private handleKey = (event: Sein.IKeyboardEvent) => {
    if (event.type === 'keydown') {
      activeKeys[event.keyCode] = true;
    } else {
      activeKeys[event.keyCode] = false;
    }
  }
}

class SeinController extends Sein.PlayerControllerActor {
  public move(vector: Sein.Vector3, distance: number) {
    if (!this.actor) {
      return;
    }

    this.actor.transform.translate(vector, distance);
  }
}

class MainGameMode extends Sein.GameModeActor {
  public onCreatePlayers() {
    this.getGame().createPlayer('sein', SeinPlayer, true);
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

    const sein = Sein.findActorByName<Sein.StaticMeshActor>(world, 'Sein');
    const seinController = world.addActor('seinController', SeinController, {actor: sein});
    game.getPlayer().switchController(seinController);
  }
}

export default function main(canvas: HTMLCanvasElement): Sein.Engine {
  const engine = new Sein.Engine();
  const game = new Sein.Game(
    'intro-game',
    {
      canvas,
      clearColor: config.background,
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      antialias: true
    }
  );
  engine.addGame(game);
  game.addWorld('main', MainGameMode, MainScript);
  game.start();

  return engine;
}
