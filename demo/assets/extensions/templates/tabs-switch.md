# Tabs Switch Viewer

这是一个针对多TAB模型切换的场景（类似于支付宝2020新春红包项目主页的3D模型展示），封装的一个模板。

>目前暂时只支持自行手动引入，后续会加入模板中。

<video style="max-width: 320px" src="/assets/extensions/templates/tabs-switch/0.mp4" controls></video>

## 功能

1. 开发者需要提供包含多个场景模型的gltf文件，并将每个场景作为顶层节点。
2. 初始化时传入这些顶层节点名字的列表，按顺序。
3. 可以通过名字来切换场景。
4. 可以指定切换时长和插值曲线，提供贝塞尔曲线生成器。
5. 可以按需开启陀螺仪功能。
6. 可知指定是否强依赖与压缩纹理。

### API文档

关于初始化参数和API请见：

[API文档](https://github.com/hiloteam/seinjs-tabs-switch-viewer/blob/master/doc/globals.md)。

## 使用

### Unity内

首先，我们需要在Unity内准备好场景，如果你不知道如何使用请先看[写给艺术家的教程](../../tutorials/artist/preface)。

为了满足模板的需求，亲务必保证你要用到的每个场景模型都是一个**顶层节点**，并且给他们赋予**合理的名字**，这个名字在后续会用到，比如：

![](/assets/extensions/templates/tabs-switch/0.jpg)

这里我就设置了三个场景：`miku`、`pig`和`bird`。

之后**导出为一个gltf文件**即可（不要勾选“分割物体”选项 ！）

>注意要将相机一起导出。

#### 预览测试

为了快速预览场景在实际渲染中的最终表现，来调整到最佳状态，你可以先切换到Unity的**Game**Tab，按照下图添加一个自定义的屏幕（比如例子中就是`320x160`的、按比例`Aspect Ratio`的屏幕），然后切换到这个屏幕来调整相机，直到在达到理想的效果：

![](/assets/extensions/templates/tabs-switch/1.png)

>注意要将相机一起导出。


#### 体积优化

在当前时点，一般来讲，为了满足最多设备的兼容和稳定性需求，我们建议将所有的光影信息烘焙到纹理（详细可以咨询我或者美术），在这种情况下，我们可以免去**法线**、**切线**等信息来缩减图元数据大小，一般是至少可以缩减**1/3**。为了做到这一点，只需要勾选导出工具的`Unlit(No Normals)`选项即可：


![](/assets/extensions/templates/tabs-switch/2.png)

另一方面，限制输出贴图的大小也可以削减体积，一般建议限制为512x512：

![](/assets/extensions/templates/tabs-switch/3.png)

#### 降级优化方案

我们也提供了配套的降级优化方案，来达到：

1. 3D不可用时降级到静态图片。
2. 3D加载完成前先显示静态图片，加载完再移除掉静态图。

可见难点在于**静态图和3D场景的无缝过渡**，为了解决这个难度，我提供了一个Unity脚本：

[ScreenCapture](/assets/extensions/templates/tabs-switch/screen-capture.unitypackage)。

将其下载导入Unity，之后选中所有调整好的场景模型和相机，右键唤起彩蛋，选择`Take a capture`：

![](/assets/extensions/templates/tabs-switch/4.png)

完成后会弹出一个文件夹，里面就是对应的截图，你可以自行调整大小。

#### 注意事项

1. 注意如果要使用陀螺仪，请务必保证**模型的Y轴旋转是0!**如果想旋转请调整相机！
2. 要注意所有贴图的空白的地方，底色一定要是白色！（即便是透明的），否则可能会出现黑边等问题。
3. **输出天空盒**选项没有必要请不要启用。


### Runtime

然后就是在Runtime中使用这个gltf文件了，先安装：

```sh
tnpm i seinjs-tabs-switch-viewer
```

然后下面是一个依赖于React的用例：

>注意要保证`tabList`中的名字和Unity导出的顶层节点名字完全一致！

```tsx
import * as Sein from 'seinjs';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import TabSwitchViewer from 'seinjs-tabs-switch-viewer';

import './base.scss';

class Demo extends React.Component {
  private canvas: React.RefObject<HTMLCanvasElement> = React.createRef();
  private viewer: TabSwitchViewer;
  private switching: boolean = true;

  public async componentDidMount() {
    this.canvas.current.style.opacity = '0.04';
    // 创建viewer
    this.viewer = new TabSwitchViewer();
    // 初始化参数
    await this.viewer.init({
      canvas: this.canvas.current,
      gltf: require('./assets/gltfs/main.gltf'),
      tabList: ['miku', 'pig', 'bird'],
      leave: {
        duration: 500
      },
      enter: {
        duration: 500
      }
    });
    // 指定tab作为第一个，正式启动。
    await this.viewer.start('miku');
    this.canvas.current.style.opacity = '1';

    this.switching = false;
  }

  private async handleSwitch(tab: string) {
    if (this.switching) {
      return;
    }

    this.switching = true;
    // 响应请求切换Tab。
    await this.viewer.switchTab(tab);
    this.switching = false;
  }

  public render() {
    return (
      <React.Fragment>
        <canvas ref={this.canvas} className={'game'} />
        <div className={'tabs'}>
          <div onClick={() => this.handleSwitch('miku')}>Miku</div>
          <div onClick={() => this.handleSwitch('pig')}>Pig</div>
          <div onClick={() => this.handleSwitch('bird')}>Bird</div>
        </div>
      </React.Fragment>
    );
  }
}

ReactDom.render(
  <Demo />,
  document.getElementById('container')
);
```
