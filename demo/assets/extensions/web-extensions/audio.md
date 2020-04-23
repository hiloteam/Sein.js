# 空间音频系统

音频是游戏中除了视觉之外最重要的感官组成部分，空间音频系统，则是将音频放入3D空间内，能够在游戏世界中模拟现实世界中的聆听者和音源的相对位置而引发听感的差异。当然，如果你不需要空间音频，也可以不开启它——它默认是关闭的。  

空间音频系统基于**WebAudio**，提供了丰富的功能来细致得控制每一个音源和聆听者。它有一个全局的管理器`SystemActor`，有音源组件`SourceComponent`和其简单封装容器`SourceActor`、以及聆听者组件`ListenerComponent`和其简单封装容器`ListenerActor`，同时还有一个资源加载器`Loader`来加载资源。

你可以根据不同的状况选择不同的细分功能，诸如`Stream`和`Buffer`模式（前者适合长段音频如BGM，边播放边解码，后者适合音效，一齐解码完再播放），是否需要惰性加载，可选的区间播放和循环等等，能够让你面对任何场景都可以游刃有余。

## 使用

要使用它，首先安装：  

```shell
npm i seinjs-audio --save
```

之后直接引入使用：  

```ts
import 'seinjs-audio';

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();
    // 首先注册音频加载器
    game.resource.register('Audio', Sein.Audio.Loader);

    // 在实际使用音频系统的所有功能之前，先至少添加一个音频系统
    game.addActor('audioSystem', Sein.Audio.SystemActor);

    // 加载音频
    game.resource.load({type: 'Audio', name: 'sakura.mp3', url: '/assets/audios/sakura.mp3'});
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

  
    // 找到你需要将音频源添加到的系统
    const audioSystem = Sein.findActorByClass(game, Sein.Audio.SystemActor);

    // 添加一个音频源组件，默认添加一个clip，后面也可以通过`source.addClip`来添加。
    // 一般添加的第一个clip为默认clip，也可以通过`isDefault`指定。
    world.addActor('audioSource', Sein.Audio.SourceActor, {
      system: audioSystem,
      clips: [{
        name: 'sakura',
        clip: game.resource.get<'Audio'>('sakura.mp3')
      }],
      autoPlay: {loop: true}
    });

    // 添加一个监听器来让声音可以输出，你可以添加多个监听器，并用`listener.enable`来切换他们。
    world.addActor('audioListener', Sein.Audio.ListenerActor);
  }
}
```

此例中，我们展示了如何是用最基础的方式添加系统、加载器、音频源和监听器，来使用音频系统。

## 在Unity中指定

通过[使用Unity扩展](./unity)中提到的插件，你也可以直接在Unity中通过特定组件，来为一个类型为`Actor`的`Sein Scene Node`添加音频源或者音频监听器功能。


### Sein Audio Source

![source](/assets/guides/audio/0.png)

如图，**Sein Audio Source**组件提供了丰富的配置来配置一个音频源，其直接对应`SourceComponent`的功能：

1. Clips：音频源的音频剪辑列表，其元素其实是一个`ScriptableObject`，不知道这个概念也没关系，总之它定义了每一个剪辑的名字和其资源，这个下面再详细讲。
2. Default Clip：指定一个默认的剪辑。
3. Need Auto Play：是否需要加载完自动播放。
4. Auto Play Options：开启自动播放时有效，直接对标`SourceComponent`初始化时的`autoPlay`属性，指定默认播放的循环、起始和结束区间。
5. Is Space Audio：是否是空间音频源。
6. Space Options：开启空间音频时有效，对标`SourceComponent`初始化时的`spaceOptions`参数。

### Sein Audio Clip

上面提到了剪辑的资源，这个可以认为是Sein在Unity中定义的一种特殊资源，你可以像创建材质等资源的方式来创建它——**在资源窗口右键，Create -> Sein -> AudioClip。**  

创建了一个新的AudioClip后，便可以对其进行编辑：  

![clip](/assets/guides/audio/1.png)  

1. Mode：音频剪辑加载模式，对应使用`AudioLoader`加载时的模式。
2. Clip：指定一个Unity原生的`AudioClip`，需要从外部将mp3等格式的文件拖入Unity后再拉进来。
3. Is Lazy：是否需要惰性加载。

### Sein Audio Listener

最后一个组件就是音频监听器了，其配置和`ListenerComponent`一致。  

![listener](/assets/guides/audio/2.png)  

1. rotatable：监听器是否跟随Actor的旋转。

## 实例

我们提供了丰富的实例来展示空间音频系统的效果——[基础](../../example/audio/basic)、[音频模式](../../example/audio/mode)、[惰性加载](../../example/audio/lazy)、[空间音频](../../example/audio/space)、[背景音乐](../../example/audio/bgm)、[音量控制](../../example/audio/volume)、[播放控制](../../example/audio/control)、[多个监听器](../../example/audio/multi-listener)、[多个系统](../../example/audio/multi-system)以及[GlTF](../../example/audio/gltf)。

更详细的API文档可见[Audio](https://github.com/hiloteam/seinjs-audio/blob/master/doc/README.md)。  
