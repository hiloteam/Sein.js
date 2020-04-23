/**
 * @File   : Global.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/3/2018, 6:58:26 PM
 * @Description:
 */
import World from '../Core/World';
import Level from '../Core/Level';
import Game from '../Core/Game';
import {IMouseEvent, IMouseWheelEvent, IWheelEvent, IKeyboardEvent, ITouchEvent} from './Event';
import {IResourceState} from './Resource';
import GlTFLoader, {IGlTFResourceEntity, IGlTFInstantOptions, IGlTFInstantResult} from '../Resource/GlTFLoader';
import TextureLoader, {ITextureResourceEntity} from '../Resource/TextureLoader';
import CubeTextureLoader, {ICubeTextureResourceEntity} from '../Resource/CubeTextureLoader';
import AtlasLoader, {IAtlasResourceEntity, IAtlasInstantOptions, IAtlasInstantResult} from '../Resource/AtlasLoader';
import ImageLoader, {IImageResourceEntity} from '../Resource/ImageLoader';

export interface IGlobalHIDDefaultEvents {
  MouseClick: IMouseEvent;
  MouseDown: IMouseEvent;
  MouseUp: IMouseEvent;
  MouseEnter: IMouseEvent;
  MouseLeave: IMouseEvent;
  MouseMove: IMouseEvent;
  MouseOut: IMouseEvent;
  MouseOver: IMouseEvent;
  MouseWheel: IMouseWheelEvent;
  Wheel: IWheelEvent;
  ContextMenu: IMouseEvent;
  KeyDown: IKeyboardEvent;
  KeyUp: IKeyboardEvent;
  KeyPress: IKeyboardEvent;
  TouchStart: ITouchEvent;
  TouchEnd: ITouchEvent;
  TouchMove: ITouchEvent;
  TouchCancel: ITouchEvent;
}

export interface IGlobalDefaultEvents {
  Resize: never;
  GameDidInit: {game: Game};
  GameDidStart: {game: Game};
  GameWillPause: {game: Game};
  GameDidResume: {game: Game};
  GameWillDestroy: {game: Game};
  WorldDidInit: {world: World};
  WorldDidCreatePlayers: {world: World};
  WorldWillDestroy: {world: World};
  LevelDidInit: {level: Level};
  LevelWillPreload: {level: Level};
  LevelIsPreloading: {level: Level, state: IResourceState};
  LevelDidPreload: {level: Level};
  LevelDidCreateActors: {level: Level};
  LevelWillDestroy: {level: Level};
  WebglContextLost: never;
  WebglContextRestored: never;
  MainRendererWillStart: never;
  MainRendererIsCleared: never;
  MainRendererIsFinished: never;
}

export interface IGlobalDefaultLoaders {
  GlTF: {
    loader: GlTFLoader;
    entity: IGlTFResourceEntity;
    instantOptions: IGlTFInstantOptions;
    instantResult: IGlTFInstantResult;
  };
  Image: {
    loader: ImageLoader;
    entity: IImageResourceEntity;
    instantOptions: never;
    instantResult: never;
  };
  Texture: {
    loader: TextureLoader;
    entity: ITextureResourceEntity;
    instantOptions: never;
    instantResult: never;
  };
  CubeTexture: {
    loader: CubeTextureLoader;
    entity: ICubeTextureResourceEntity;
    instantOptions: never;
    instantResult: never;
  };
  Atlas: {
    loader: AtlasLoader;
    entity: IAtlasResourceEntity;
    instantOptions: IAtlasInstantOptions;
    instantResult: IAtlasInstantResult;
  };
}
