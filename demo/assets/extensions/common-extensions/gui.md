# GUI系统

GUI系统为一套基于非DOM的UI系统，而在底层的实现和外在的表现上均基本符合DOM的处理方式和框架结构。


## GUI系统的使用

引入必要的模块。

> 此处注意需要从``seinjs-gui``中引入``React``。

```ts
import * as Sein from 'seinjs';
import {React} from 'seinjs-gui';
```

在开发使用GUI系统前，请先添加一个``SystemActor``来管理整个GUI系统。

```ts
const guiSystem = game.addActor('guiSystem', Sein.GUI.SystemActor);

guiSystem.createLayer('ui', {
  priority: 0,
  element: <Root />,
  baseWidth: game.bound.width
});
```

> 在创建Layer时，你可以设定基准宽度进行自适应UI排版，其默认值为game的宽度。

之后你可以通过扩展``Sein.GUI.Component``以你熟悉的React Component的形式编写或者组合你的UI组件。

```ts
class Root extends Sein.GUI.Component {
  public render() {
    return (
      <React.Fragment>
        <Sein.GUI.Container
          shape={new Sein.Vector2(100, 100)}
        />
      </React.Fragment>
    );
  }
}
```


## 系统设计

GUI系统的底层在设计上参照DOM的渲染和事件处理行为进行，在外在表现上也于基于DOM的UI系统类似。

在渲染顺序上，按照构建的GUI树结构，先渲染父组件，再依次渲染其子组件，以此递归。

在事件处理上，提供对于``click``、``touchstart``、``touchmove``、``touchend``和``touchcancel``事件的捕获和冒泡处理。以上提及的几类事件的处理均参照浏览器对于触摸事件的处理，即在``touchstart``事件中向下捕获，获取``target``，捕获后向上冒泡。在``touchmove``和``touchend``事件中，``target``为对应``touchstart``事件中捕获的``target``，并进行冒泡，并且通过``touchStart``和``touchMove``事件触摸点的欧氏偏移量来判断是否发生``click``事件。对于触摸事件的判断顺序为``touchStart``->``touchMove``->``touchEnd``->``click``。

在``game``层次上，做了对GUI系统的交互事件截断，即如果GUI系统的组件经检测为交互事件的``target``，则不继续传递给三维世界进行交互。

> P.S. 在官网的基础事件实例中，采用监听mousedown、mousemove以及mouseup事件来模拟移动端的触摸事件。

在对用户以及开发者的外在表现上，GUI组件表现为根节点相对于``game``的左上角进行定位，相对于中心进行缩放和旋转，定位以及宽高的设置单位为**pixel**。子GUI相对于父GUI的左上角进行定位，按照其自身中心进行缩放和旋转。


## 组件使用

在GUI系统中，所有的组件均继承自``Container``这个基类。在``Container``的基础上，扩展出``Label``、``Button``、``Checkbox``、``RadioButton``、``Slider``、``Clip``裁剪组件、``Scroll``以及``CombineContainer``这个优化渲染的组件。在这一部分中，将简单介绍各个组件的使用和组合。通过``React.Component``封装了``SlideBar``和``List``（仅支持纵向）。

### Container

``Container``提供以下几个供开发者使用的props，定义最基础的组件：

| props | 含义 | 类型/单位 | 示例 | 备注 |
| :---: | :---: | :---: | :---: | :---: |
| shape | 形状（组件的长和宽) | pixel | ``shape={new Sein.Vector2(100, 100)}`` |  |
| x | 相对于``game``左上角或父组件左上角x轴方向位移 | pixel | ``x={50}`` |  |
| y | 相对于``game``左上角或父组件左上角y轴方向位移 | pixel | ``y={50}`` |  |
| rotation | 以组件中心为锚点旋转角度 | 弧度制 | ``rotation={Math.PI/6}``|  |
| scaleX | 以组件中心为锚点x轴方向上缩放 | (0, +∞) | ``sccaleX={0.6}`` | 在已知长宽的前提下建议通过shape直接初始化 |
| scaleY | 以组件中心为锚点y轴方向上缩放 | (0, +∞) | ``scaleY={1.2}`` | 在已知长宽的前提下建议通过shape直接初始化 |
| id | id | ``string`` | ``id={'container'}`` |  |
| background | 背景 | ``Color``、``Texture``、``{atlas: AtlasManager, frame: string}`` | ``background={Sein.Color(0.6, 0.8, 0.2)}`` |  |
| transparent | 是否开启透明度测试 | ``boolean`` | ``tranparent={true}`` | 不透明背景不建议开启透明度测试 |
| visibility | 组件是否可见 | ``boolean`` | ``visibility={false}`` | 优化参数，设置``visibility``为``false``的组件不加入渲染队列 |
| onTouchStart | touchstart事件回调 | (event: Event) => void | ``onTouchStart={(event)=>{console.log(event)}}`` |  |
| onTouchMove | touchmove事件回调 | (event: Event) => void | ``onTouchMove={(event)=>{console.log(event)}}`` |  |
| onTouchEnd | touchend事件回调 | (event: Event) => void | ``onTouchEnd={(event)=>{console.log(event)}}`` |  |
| onTouchCanncel | touchcancel事件回调 | () => void | ``onTouchCancel={()=>{console.log('TOUCHCANCEL')}}`` |  |
| onClick | click事件回调 | (event: Event) => void | ``oonClick={(event)=>{console.log('CLICK')}}`` |  |

``Container``为GUI系统中的基础组件，你可能不会直接使用它。但是，它实现了底层的渲染以及事件处理工作，并且它能够实现一些纯图片和图集的展示，以及自定义组件的扩展。

```ts
/* Container组件使用样例 */
class Root extends Sein.GUI.Component {
  public render() {
    const game = this.system.getGame();

    return (
      <React.Fragment>
        <Sein.GUI.Container
          id={'root-0'}
          shape={new Sein.Vector2(300, 200)}
          x={120} y={100}>
        />
      </React.Fragment>
    );
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();
  }

  public onLoading(state: Sein.IResourceState) {
    console.log(state);
  }

  public onCreate() {
    const game = this.getGame();
    const world = this.getWorld();

    createDefaultCamera(game);

    const guiSystem = game.addActor('guiSystem', Sein.GUI.SystemActor);

    guiSystem.createLayer('ui', {
      priority: 0,
      element: <Root />
    });
  }
}
```

### Label和Button

``Label``继承自``Container``基类，主要引入文字的绘制。``Button``继承自``Label``，拥有在按下时向右下角偏移一小段距离，松开时恢复的属性。如果需要实现更加负责的按钮动效，你可以继承``Label``自定义按钮组件。

``Label``提供以下几个供开发者使用的props：

| props | 含义 | 类型/单位 | 示例 | 备注 |
| :---: | :---: | :---: | :---: | :---: |
| text | 文字内容 | ``string`` | ``text={'Label'}`` |  |
| textAlign | 文字对齐方式 | 'middle'、'left'、'right' | ``textAlign={'right'}`` | 参照canvas中文字的对齐方式，按照中线进行对齐 |
| textBaseline | 文字基线位置 | 'middle'、'top'、'bottom' | ``textBaseline={'middle'}`` | 参照canvas中文字基线位置 |
| fontColor | 文字颜色 | ``Color`` | ``fontColor={new Sein.Color(0.8, 0.8, 0.8)}`` |  |
| fontSize | 文字大小 | ``string`` / pixel | ``fontSize={'14'}`` |  |
| fontStyle | 文字样式 | ``string`` | ``fontStyle={'sans-serif'}`` | 参照Web通用的字体样式 |
| fontWeight | 文字粗细 | ``string`` | ``fontWighr={'normal'}`` | 参照canvas中文字粗细设置 |
| border | 标签边框粗细 | ``string`` / pixel | ``border={'4'}`` |  |
| borderColor | 标签边框颜色 | ``Color`` | ``borderColor={new Sein.Color(1.0, 0.7, 0.6)}`` |  |

``Label``不仅在基础组件``Container``上提供了渲染文字的能力，同时，也为自定义``Button``提供了可能。

```ts
/* Label和Button使用样例 */
class Root extends Sein.GUI.Component {
  public render() {
    const game = this.system.getGame();

    return (
      <React.Fragment>
        <Sein.GUI.Label
          id={'Label'}
          shape={new Sein.Vector2(100, 50)}
          text={'Label'}
          background={new Sein.Color(1.0, 0.6, 0.8)}
          x={50}
          y={50}
        />
        <Sein.GUI.Button
          id={'Button'}
          shape={new Sein.Vector2(100, 50)}
          text={'Button'}
          x={200}
          y={50}
        />
      </React.Fragment>
    );
  }
}
```

### Checkbox

``Checkbox``继承自``Container``基类，引入动态勾选的功能，并且能够自定义与其它组件的编联。

``Checkbox``提供以下几个供开发者使用的props：

| props | 含义 | 类型/单位 | 示例 | 备注 |
| :---: | :---: | :---: | :---: | :---: |
| checkedAtlas | 被选中时显示的图集和帧 | ``{atlas: AtlasManager, frame: string}`` | [详见实例](../../example/gui/selection) |  |
| uncheckedAtlas | 未选中时显示的图集和帧 | ``{atlas: AtlasManager, frame: string}`` | [详见实例](../../example/gui/selection) |  |
| checked | 初始化状态 | ``boolean`` | ``checked={true}`` | 用于初始化checkbox状态 |
| onCheck | checkbox选择的回调函数 | ``boolean`` | [详见实例](../../example/gui/selection) | 可用于与其它组件的编联 |

```ts
/* Checkbox使用样例 */
class Root extends Sein.GUI.Component {
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
```

### RadioButton

``RadioButton``继承自``Container``基类，提供了动态选择的功能，并且能够自定义与其它组件的编联。

``Radiobutton``提供以下几个供开发者使用的props：

| props | 含义 | 类型/单位 | 示例 | 备注 |
| :---: | :---: | :---: | :---: | :---: |
| selectedAtlas | 被选择时显示的图集和帧 | ``{atlas: AtlasManager, frame: string}`` | [详见实例](../../example/gui/selection) |  |
| unselectedAtlas | 未选择时显示的图集和帧 | ``{atlas: AtlasManager, frame: string}`` | [详见实例](../../example/gui/selection) |  |
| selected | 初始化状态 | ``boolean`` | ``selected={true}`` | 初始化使用，在RadioGroup中建议初始化其中一个RadioButton的状态为selected |
| onSelect | RadioButton选择回调函数 | ``boolean`` | [详见实例](../../example/gui/selection) | 可用于RadioGroup中与其它组件的编联 |

```ts
/* RadioButton使用样例 */
class Root extends Sein.GUI.Component {
  public render() {
    const game = this.system.getGame();

    return (
      <React.Fragment>
        <Sein.GUI.RadioButton
          id={'radio-0'}
          shape={new Sein.Vector2(32, 32)}
          unselectedAtlas={{atlas: game.resource.get<'Atlas'>('gui.json'), frame: 'unselected'}}
          selectedAtlas={{atlas: game.resource.get<'Atlas'>('gui.json'), frame: 'selected'}}
          x={50}
          y={120}
        />
      </React.Fragment>
    );
  }
}
```


### Slider

``Slider``继承自``Container``基类，提供了动态显示部分纹理图的功能，并且能够与自定义的控制器或者游标进行编联，同时，进度条组件也能通过``Slider``进行实现。在此GUI系统中，``SliderBar``组件中封装有``Slider``组件。

``Slider``提供以下几个供开发者使用的props：

| props | 含义 | 类型/单位 | 示例 | 备注 |
| :---: | :---: | :---: | :---: | :---: |
| layout | Slider样式 | ``string`` / 'row'或'column' | ``layout={'row'}`` |  |
| percent | 填充百分比 | [0, 1] | ``percent={0.8}`` | 可用于后期与控制器或者触摸事件的监听绑定 |


```ts
/* Slider使用样例 */
class Slider extends Sein.GUI.Component {
  public state = {percent: 0.8};
  private _startX = 50;
  private _length = 400;
  private _controlerSize = 30

  public render() {
    return (
      <React.Fragment>
        <Sein.GUI.Container
          shape={new Sein.Vector2(this._length, 20)}
          background={new Sein.Color(1.0, 1.0, 1.0, 1.0)}
          x={this._startX}
          y={120}
        />
        <Sein.GUI.Slider
          shape={new Sein.Vector2(this._length, 20)}
          background={new Sein.Color(0.4, 0.4, 0.6, 1.0)}
          x={this._startX}
          y={120}
          layout={'row'}
          percent={this.state.percent}
          transparent={true}
          onTouchMove={this.updateSlider}
          onTouchEnd={this.updateSlider}
        />
        <Sein.GUI.Container
          id={'controler'}
          shape={new Sein.Vector2(this._controlerSize, this._controlerSize)}
          background={new Sein.Color(1.0, 0.8, 0.2, 1.0)}
          x={this._startX + this._length * this.state.percent - this._controlerSize / 2}
          y={115} // slider.y - (controler.height - slider.height) / 2
          onTouchMove={this.updateSlider}
          onTouchEnd={this.updateSlider}
        />
      </React.Fragment>
    );
  }

  updateSlider = (event: Event) => {
    if (event.type === EventType.TouchMove) {
      if (event.touches[0].pageX <= this._startX || event.touches[0].pageX >= (this._startX + this._length)) {
        return;
      }
      const newPercent = (event.touches[0].pageX - this._startX) / this._length;
      this.setState({percent: newPercent});
    }
    else {
      if (event.changedTouches[0].pageX <= this._startX || event.changedTouches[0].pageX >= (this._startX + this._length)) {
        return;
      }
      const newPercent = (event.changedTouches[0].pageX - this._startX) / this._length;
      this.setState({percent: newPercent});
    }
  }
}
```


### CombineContainer

``CombineContainer``继承自``Container`` 基类，能够合并其子元素并绘制在同一图集中的同一帧的优化容器。

```ts
/* CombineContainer使用样例 */
class Root extends Sein.GUI.Component {
  public render() {
    const game = this.system.getGame();
    return (
      <React.Fragment>
        <Sein.GUI.CombineContainer
          shape={new Sein.Vector2(200, 250)}
          x={game.bound.width / 2 - 100}
          y={30}
          background={new Sein.Color(1.0, 0.8, 0.2, 1.0)}
        >
          <Sein.GUI.Container
            shape={new Sein.Vector2(100, 100)}
            x={50}
            y={30}
            rotation={Math.PI/4}
            background={new Sein.Color(1.0, 0.4, 0.4, 1.0)}
          >
            <Sein.GUI.Container
              shape={new Sein.Vector2(50, 50)}
              x={25}
              y={25}
              background={game.resource.get<'Texture'>('paradise.jpg')}
            />
          </Sein.GUI.Container>
          <Sein.GUI.Label
            shape={new Sein.Vector2(100, 50)}
            x={50}
            y={170}
            text={'Label'}
            background={new Sein.Color(0.6, 0.8, 0.4, 1.0)}
          />
        </Sein.GUI.CombineContainer>
      </React.Fragment>
    );
  }
}

export default class MainScript extends Sein.LevelScriptActor {
  public onPreload() {
    const game = this.getGame();
    game.resource.load({type: 'Texture', url: '/assets/paradise.jpg', name: 'paradise.jpg', flipY: true});
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
```

### Clip

``Clip``组件为裁剪组件，它对于其子组件进行裁剪。

``Clip``提供以下几个供开发者使用的props：

| props | 含义 | 类型/单位 | 示例 | 备注 |
| :---: | :---: | :---: | :---: | :---: |
| padding | 内边距 | Sein.Vector4 / pixel | ``padding={new Sein.Vector4(10, 10, 10, 10)}`` | 内边距设置的顺序依次为上边距、右边距、下边距和左边距 | 


### List

``List``继承自``React.Component``类，仅具有**纵向**列表的滑动功能。

``List``提供以下几个供开发者使用的props：

| props | 含义 | 类型/单位 | 示例 | 备注 |
| :---: | :---: | :---: | :---: | :---: |
| itemWidth | 列表元素宽 | ``number`` / pixel | ``itemWidth={100}`` |  |
| itemHeight | 列表元素高 | ``number`` / pixel | ``itemHeight={100}`` |  |
| columnNum | 列表列数 | ``number`` | ``column={3}`` |  |
| rowSpace | 列表行间距 | ``number`` | ``rowSpace={20}`` |  |
| padding | 列表内边距 | ``Vector4`` | ``padding={new Sein.Vector4(0, 10, 0, 10)}`` | 内边距设置的顺序依次为上边距、右边距、下边距和左边距 |
| data | 列表元素的信息 | any[] | [详见实例](../../example/GUI/List) |  |
| renderItem | 列表元素的回调函数 | function | [详见实例](../../example/GUI/List) | 开发者需自定义列表元素的回调函数 |
| scrollBar | 是否显示滚动条 | boolean | scrollBar={true} |  |
| renderScrollBar | 滚动条渲染函数 | function | [详见实例](../../example/GUI/List) | 如果设置scrollBar为true，但没有设置该渲染函数，会调用默认滚动条渲染函数（请设置右边距！） |

```ts
/* List使用样例 */
class List extends Sein.GUI.Component {
  public render() {
    return (
      <Sein.GUI.List
        shape={new Sein.Vector2(220, 300)}
        itemWidth={80}
        itemHeight={80}
        rowSpace={10}
        columnNum={2}
        padding={new Sein.Vector4(5, 30, 5, 10)}
        x={100}
        y={50}
        data={[
          {shape: new Sein.Vector2(80, 80), background: new Sein.Color(0.8, 0.6, 0.4)}, 
          {shape: new Sein.Vector2(80, 80), background: new Sein.Color(0.8, 0.4, 0.6)},
          {shape: new Sein.Vector2(80, 80), background: new Sein.Color(0.6, 0.8, 0.4)},
          {shape: new Sein.Vector2(80, 80), background: new Sein.Color(0.6, 0.4, 0.8)},
          {shape: new Sein.Vector2(80, 80), background: new Sein.Color(0.4, 0.8, 0.6)},
          {shape: new Sein.Vector2(80, 80), background: new Sein.Color(0.4, 0.6, 0.8)},
          {shape: new Sein.Vector2(80, 80), background: new Sein.Color(0.6, 0.4, 0.2)},
          {shape: new Sein.Vector2(80, 80), background: new Sein.Color(0.6, 0.2, 0.4)}
        ]}
        renderItem={(data: any, index: number, transform: {x: number, y: number}) => (
          <Sein.GUI.Container
            key={index}
            shape={data.shape}
            x={transform.x}
            y={transform.y}
            background={data.background}
          />
        )}
        scrollBar={true}
        renderScrollBar={(percent, height, onScroll) => (
          <Sein.GUI.SliderBar
            shape={new Sein.Vector2(20, height)}
            x={300}
            y={50}
            layout={'column'}
            percent={percent}
            onChange={onScroll}
            trackBackground={new Sein.Color(0.8, 0.8, 0.8)}
            pieceBackground={new Sein.Color(0.8, 0.8, 0.8)}
            thumbShape={new Sein.Vector2(20, 100)}
            thumbBackground={new Sein.Color(0.6, 0.6, 0.6)}
          />
        )}
      />
    );
  }
}
```

对于``List``中的每一项，如果静态元素较多，可以将这些元素合并在``CombineContainer``下成为一项进行优化，节约图集资源的动态申请开销以及优化渲染。对于列表，推荐使用``List``组件，除非对于``List``的排版有特殊的要求，可以使用``Scroll``组件进行排版。


### Scroll

``Scroll``组件为支持横向与纵向滚动的容器，继承自``Clip``组件。

``Scroll``提供以下几个供开发者使用的props：

| props | 含义 | 类型/单位 | 示例 | 备注 |
| :---: | :---: | :---: | :---: | :---: |
| padding | 内边距 | ``Vector4`` | ``padding={new Sein.Vector4(0, 10, 0, 10)}`` | 内边距设置的顺序依次为上边距、右边距、下边距和左边距 |
| isLockScrollX | 是否锁定横向滚动 | boolean | ``isLockScrollX={true}`` |  |
| isLockScrollY | 是否锁定纵向滚动 | boolean | ``isLockScrollY={true}`` |  |

```ts
/* Scroll使用样例 */
class ScrollView extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Sein.GUI.Scroll
          shape={new Sein.Vector2(200, 200)}
          x={400}
          y={50}
          padding={new Sein.Vector4(10, 10, 10, 10)}
        >
          <Sein.GUI.Container
            shape={new Sein.Vector2(100, 100)}
            background={new Sein.Color(0.965, 0.325, 0.078)}
            x={10}
            y={10}
          />
          <Sein.GUI.Container
            shape={new Sein.Vector2(100, 100)}
            background={new Sein.Color(0.486, 0.733, 0)}
            x={130}
            y={10}
          />
          <Sein.GUI.Container
            shape={new Sein.Vector2(100, 100)}
            background={new Sein.Color(0, 0.631, 0.945)}
            x={10}
            y={130}
          />
          <Sein.GUI.Container
            shape={new Sein.Vector2(100, 100)}
            background={new Sein.Color(1.0, 0.733, 0)}
            x={130}
            y={130}
          />
        </Sein.GUI.Scroll>
      </React.Fragment>
    );
  }
}
```


## 实例

这里，我们提供了更多详细的GUI系统的实例来展示它的功能和开发扩展的可能性。

- [基础组件](../../example/gui/base)
- [基础事件](../../example/gui/basic-event)
- [标签和按钮](../../example/gui/label)
- [选择](../../example/gui/selection)
- [滑块和进度条](../../example/gui/slider)
- [优化容器](../../example/gui/combine-container)
- [列表](../../example/gui/list)
- [滑动容器](../../example/gui/scroll)


## 自定义组件

开发者可以根据现有的基础组件，利用编联和继承自定义满足开发需求的GUI组件。以下仅给出一些自定义组件的建议，在上一部分的实例中，也展示了一部分自定义组件的编写方法。

- 需要更多更丰富动效的按钮，可以继承自``Label``实现自定义按钮组件
- 需要和其它``Container``或者``Label``组合的``Checkbox``可以通过编联成组
- 需要和其它``Container``或者``Label``组合的``RadioButton``，以及需要编组成RadioGroup的``RadioButton``可以通过编联成组
- 需要装配控制器的``Slider``，可以与使用其它组件编写的控制器进行编组
- 进度条的制作可以使用``Slider``实现，将其中的``percent``与进度进行绑定
- 需要装配游标的进度条，可以通过``Slider``与游标编联成组


## 系统优化事项说明

在GUI系统的设计中，设计有一些优化方案：

- 如果不需要显示的组件请设定为``visibility={false}``，该参数默认为true。设定visibility为false的组件不加入渲染队列，但保留其加载的资源。
- 对于完全超出``game``可视范围外的组件和完全超出父容器的组件，不加入渲染队列，但保留其加载的资源。
- 只有当需要展示的组件需要处理透明度信息时，才设定``transparent={true}``，该参数默认为false。设定transparent为true时，会开启透明度检测。
- 如果在一个组合组件中，其静态组件堆叠较多，建议使用``CombineContainer``进行优化，合并申请图集管理器并进行统一绘制。
- 对于列表中的每一项，如果确认其为静态组件，可合并为``CombineContainer``的子元素进行优化。
- 对于列表UI，建议使用``List``组件。
