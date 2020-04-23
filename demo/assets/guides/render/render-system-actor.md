# RenderSystemActor

有时候我们需要一些特别的效果，这在一个PASS的渲染是搞不定的，所以Sein提供了`RenderSystemActor`，它继承自`SystemActor`，拥有着让开发者在不同的渲染阶段进行不同逻辑定制的能力。

## 生命周期

以实例[进阶渲染](../../example/render/advance)为例：

```ts
interface IMirrorRenderSystemOptions {
  mirror: Sein.StaticMeshActor;
}

class MirrorRenderSystem extends Sein.RenderSystemActor<IMirrorRenderSystemOptions> {
  private buffer: Sein.FrameBuffer;
  private mirror: Sein.StaticMeshActor;

  public onAdd(initState: IMirrorRenderSystemOptions) {
    this.buffer = new Sein.FrameBuffer(this.getGame());
    this.mirror = initState.mirror;
  }

  public onPreRender() {
    const game = this.getGame();
    const world = this.getWorld();
    const {mainCamera} = world;

    mainCamera.layers.set(1);
    const {r, g, b, a} = game.renderer.clearColor;
    game.renderer.clearColor.set(.5, .5 , .5, 1);

    mainCamera.render(this.buffer);

    this.mirror.root.material.setUniform<Sein.Texture>('diffuse', this.buffer.texture);

    mainCamera.layers.reset();
    game.renderer.clearColor.set(r, g, b, a);
  }

  public onPostClear() {

  }

  public onPostRender() {

  }
}
```

这里我们继承自`RenderSystemActor`实现了一个类`MirrorRenderSystem`，可以重写三个方法`onPreRender`、`onPostClear`和`onPostRender`，这代表着三个不同的渲染阶段。这里我们在`onPreRender`中强行用相机的`render`方法将其渲染到一个`FrameBuffer`中，然后再讲这个纹理作为`mirror`的一个`uniform`传入它的材质中。

定义好了以后，我们只需要将其添加到游戏中即可：

```ts
game.addActor('CustomRenderSystem', MirrorRenderSystem, {mirror});
```

>注意添加的顺序非常重要！每个渲染系统是按照添加顺序顺序执行的，请务必按照你的预期添加！
