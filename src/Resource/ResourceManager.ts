/**
 * @File   : ResourceManager.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/27 下午11:05:34
 * @Description:
 */
import SObject from '../Core/SObject';
import {SClass} from '../Core/Decorator';
import Observable from '../Core/Observable';
import {IResourceEntity, IResourceState, IInstantOptions} from '../types/Resource';
import ResourceLoader from '../Resource/ResourceLoader';
import {TConstructor} from '../types/Common';
import MemberConflictException from '../Exception/MemberConflictException';
import MissingMemberException from '../Exception/MissingMemberException';
import Game from '../Core/Game';
import StateActor from '../Info/StateActor';
import Debug from '../Debug';
import ResourceLoadException from '../Exception/ResourceLoadException';
import GlTFLoader from './GlTFLoader';

/**
 * @hidden
 */
function getExt(url: string) {
  return '.' + url.split('.').pop();
}

/**
 * 判断一个实例是否为`ResourceManager`。
 */
export function isResourceManager(value: SObject): value is ResourceManager {
  return (value as ResourceManager).isResourceManager;
}

/**
 * 资源管理器类。作为资源的集中管理容器，承担着引擎所有的资源加载器的注册、销毁，以及资源的添加、加载和释放。
 * 
 * @template IDefaultLoaders 用于标注所有资源的名称以及对应的事件参数类型。
 * @noInheritDoc
 */
@SClass({className: 'ResourceManager'})
export default class ResourceManager<IDefaultLoaders extends any = {}> extends SObject {
  public isResourceManager = true;

  protected _onError = new Observable<{error: Error, state: IResourceState}>(this);
  protected _onLoading = new Observable<IResourceState>(this);
  protected _onLoaded = new Observable<IResourceState>(this);
  protected _loaders: {[type: string]: ResourceLoader} = {};
  protected _loadersFormat: {[format: string]: string} = {};
  protected _queue: {[name: string]: {entity: IResourceEntity, pending: Promise<any>}} = {};
  protected _store: {[name: string]: IResourceEntity} = {};
  protected _state: IResourceState = {
    totalCount: 0,
    loadedCount: 0,
    progress: 0,
    totalWeight: 0,
    loadDone: true,
    current: null
  };
  protected _game: Game;

  /**
   * @hidden
   */
  constructor(game: Game) {
    super();
    this._game = game;
  }

  /**
   * 此批资源是否加载完毕。
   */
  get loadDone() {
    return this._state.loadDone;
  }

  /**
   * 获取父级Game实例。
   */
  get parent() {
    return this._game;
  }

  /**
   * 此批资源加载错误时的可观察实例。
   */
  get onError() {
    return this._onError;
  }

  /**
   * 此批资源加载进度更新时的可观察实例。
   */
  get onLoading() {
    return this._onLoading;
  }

  /**
   * 此批资源加载完毕时的可观察实例。
   */
  get onLoaded() {
    return this._onLoaded;
  }

  /**
   * 获取一个指定的Loader。
   */
  public getLoader<TKey extends keyof IDefaultLoaders>(type: TKey): IDefaultLoaders[TKey]['loader'];
  public getLoader<TLoader extends ResourceLoader = ResourceLoader>(type: string): TLoader;
  public getLoader(type: string): ResourceLoader {
    return this._loaders[type];
  }

  /**
   * 获取一个指定格式的Loader。
   * 
   * **指定格式需要在`ResourceLoader.EXTENSIONS`静态变量中定义！**
   */
  public getLoaderByFormat<TLoader extends ResourceLoader = ResourceLoader>(format: string): TLoader {
    return this.getLoader<TLoader>(this._loadersFormat[format]);
  }

  /**
   * 指定资源类型`type`和加载器`LoaderClass`，注册一个Loader。
   * 关于加载器，请见[ResourceLoader](../resourceloader)。
   */
  public register<TKey extends keyof IDefaultLoaders>(
    type: TKey,
    LoaderClass?: TConstructor<ResourceLoader<IDefaultLoaders[TKey]['entity']>>
  ): this;
  public register<IResource extends IResourceEntity = IResourceEntity>(
    type: string,
    LoaderClass?: TConstructor<ResourceLoader<IResource>>
  ): this;
  public register(
    type: string,
    LoaderClass?: TConstructor<ResourceLoader<IResourceEntity>>
  ): this {
    if (this._loaders[type]) {
      throw new MemberConflictException(this, 'Loader', type, this, 'You should unregister it at first !');
    }

    const loader = new LoaderClass();
    loader.game = this._game;
    this._loaders[type] = loader;

    ((LoaderClass as any).FORMATS || []).forEach((format: string) => {
      this._loadersFormat[format] = type;
    });

    return this;
  }

  /**
   * 卸载一个Loader。
   */
  public unregister<TKey extends keyof IDefaultLoaders>(type: TKey): this;
  public unregister(type: string): this;
  public unregister(type: string): this {
    if (!this._loaders[type]) {
      return;
    }

    ((this._loaders[type].constructor as any) || []).FORMATS.forEach((format: string) => {
      delete this._loadersFormat[format];
    });

    delete this._loaders[type];
    return this;
  }

  /**
   * 直接添加一个加载过的、或构造好的资源到资源管理器中。
   */
  public add<TKey extends keyof IDefaultLoaders>(
    type: TKey,
    name: string,
    resource: IDefaultLoaders[TKey]['entity']['result']
  ): this;
  public add<IResource extends IResourceEntity['result'] = IResourceEntity['result']>(
    type: string,
    name: string,
    resource: IResource
  ): this;
  public add(type: string, name: string, resource: IResourceEntity['result']): this {
    if (!this._loaders[type]) {
      throw new MissingMemberException(this, 'Loader', type, this, 'Register it before adding resource !');
    }

    if (this._store[name]) {
      return;
    }

    this._store[name] = {name, result: resource, type, url: ''};

    return this;
  }

  /**
   * 判断一个资源是否已经存在。
   */
  public has(name: string): boolean {
    return !!this._store[name];
  }

  /**
   * 获取一个指定的资源实例。
   */
  public get<TKey extends keyof IDefaultLoaders>(name: string): IDefaultLoaders[TKey]['entity']['result'];
  public get<IResource extends IResourceEntity = IResourceEntity>(name: string): IResource['result'];
  public get(name: string) {
    if (!this._store[name]) {
      Debug.warn(`Resource ${name} is not existed !`);
      return null;
    }

    return this._store[name].result;
  }

  /**
   * 释放一个指定的资源。
   */
  public release(name: string): this {
    const entity = this._store[name];
    if (!entity) {
      throw new MissingMemberException(this, 'Entity', name, this);
    }

    this._loaders[entity.type].release(entity);

    delete this._store[name];
    return this;
  }

  /**
   * 清除所有资源。
   */
  public clear(): this {
    for (const name in this._store) {
      this.release(name);
    }

    return this;
  }

  /**
   * 取消特定资源加载。
   */
  public cancel(name: string): this {
    if (!this._queue[name]) {
      return;
    }

    const {entity} = this._queue[name];

    delete this._queue[name];

    this._loaders[entity.type].cancel(entity);
    this._state.loadedCount += 1;

    if (this._state.loadedCount === this._state.totalCount) {
      this.handleLoadDone();
    }

    return this;
  }

  /**
   * 取消当前所有资源加载。
   */
  public cancelAll(): this {
    for (const key in this._queue) {
      this.cancel(key);
    }

    return this;
  }

  /**
   * 指定`type`、`name`和`url`等，加载一个资源，实际上会代理到特定加载器的`load`方法。
   * 此方法很灵活，其返回一个`Promise`，让你可以在资源加载完成时直接取得。
   * 也可以配合`LevelScriptActor`的`onPreload`和`onLoading`声明周期，实现关卡资源的批量预加载。
   */
  public async load<TKey extends keyof IDefaultLoaders>(
    entity: IDefaultLoaders[TKey]['entity']
  ): Promise<IDefaultLoaders[TKey]['entity']['result']>;
  public async load<IResource extends IResourceEntity = IResourceEntity>(
    entity: IResourceEntity
  ): Promise<IResource['result']>;
  public async load(entity: IResourceEntity): Promise<IResourceEntity['result']> {
    if (typeof entity.url === 'function') {
      entity.url = (entity as any).url(this._game);
    }

    let type = entity.type || this._loadersFormat[getExt(entity.url)];

    if (!this._loaders[type]) {
      throw new MissingMemberException(this, 'Loader', type, this, 'Register it before adding resource !');
    }

    if (this._store[entity.name]) {
      return this._store[entity.name];
    }

    if (this._queue[entity.name]) {
      return this._queue[entity.name];
    }

    const loader = this._loaders[type];

    entity.type = type;
    entity.weight = entity.weight || 1;
    entity.preProgress = 0;
    entity.canceled = false;

    this._state.totalCount += 1;
    this._state.totalWeight += entity.weight;
    this._state.loadDone = false;
    const pending = new Promise((resolve, reject) => {
      loader.load(entity, {
        onLoading: this.handleLoadingOne,
        onLoaded: () => {
          // resource has been canceled
          if (!this._queue[entity.name]) {
            return;
          }

          this.handleLoadedOne(entity);
          resolve(entity.result);
        },
        onError: (_, error) => {
          // resource has been canceled
          if (!this._queue[entity.name]) {
            return;
          }

          const {stack} = error;
          error = new ResourceLoadException(entity.name, this, error.message);
          error.stack = stack;
          this.handleLoadedOne(entity, error);
          reject(error);
        }
      });
    });

    this._queue[entity.name] = {pending, entity};

    return this._queue[entity.name].pending;
  }

  /**
   * 指定资源名和配置，通过资源实例化一个对象。
   * 比如你可以指定一个`GlTF`资源，将其实例化为一个具体的`SceneActor`或者`SceneComponent`。
   */
  public instantiate<TKey extends keyof IDefaultLoaders>(
    resourceName: string,
    options?: IDefaultLoaders[TKey]['instantOptions']
  ): IDefaultLoaders[TKey]['instantResult'];
  public instantiate(
    resourceName: string,
    options?: IInstantOptions
  ): any {
    const entity = this._store[resourceName];
    if (!entity) {
      throw new MissingMemberException(this, 'Entity', resourceName, this);
    }

    return this._loaders[entity.type].instantiate(entity, options || {});
  }

  private handleLoadingOne = (entity: IResourceEntity, progress: number) => {
    // resource has been canceled
    if (!this._queue[entity.name]) {
      return;
    }

    const {weight, preProgress} = entity;

    entity.preProgress = progress;
    this._state.current = entity;
    this._state.progress += (weight * (progress - preProgress) / this._state.totalWeight);

    this.onLoading.notify(Object.assign({}, this._state));
  }

  private handleLoadedOne = (entity: IResourceEntity, error: Error = null) => {
    const {weight, preProgress} = entity;
    const progress = 1;

    entity.preProgress = progress;
    this._state.current = entity;
    this._state.progress += (weight * (progress - preProgress) / this._state.totalWeight);
    this._state.loadedCount += 1;

    delete this._queue[entity.name];

    if (!error) {
      this._store[entity.name] = entity;
    } else {
      this.onError.notify({error, state: Object.assign({}, this._state)});
    }

    this.onLoading.notify(Object.assign(error ? {error} : {}, this._state));

    if (this._state.loadedCount === this._state.totalCount) {
      this.handleLoadDone();
    }
  }

  private handleLoadDone() {
    (GlTFLoader as any).clearCache();

    this._state.loadDone = true;
    this._state.progress = 1;

    const state = Object.assign({}, this._state);

    this._state.totalCount = 0;
    this._state.loadedCount = 0;
    this._state.totalWeight = 0;
    this._state.progress = 0;
    this._state.current = null;

    this.onLoaded.notify(state);
  }

  /**
   * 销毁，继承请先`super.onDestroy()`。
   */
  public onDestroy() {
    if (!this._state.loadDone) {
      this.cancelAll();
    }
    this.clear();
    this._loaders = {};
  }
}
