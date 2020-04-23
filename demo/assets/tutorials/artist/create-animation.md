## 动起来，制作或使用模型动画

实际项目中我们经常要使用动画，有时候这些动画是在建模软件做好的，有时候也可以直接在Unity中制作！无论是哪种方式，Sein都是支持的。

对于在建模软件中制作的动画，比如存储在FBX中的，你只需要和上一小节一样拖到Unity中，便已经处理好了。点击拖动到场景框的模型，可以看到上面有一个组件**Animator**，便是处理这些动画的：

![animator-1](/assets/tutorials/artist/img/26.png)

此时我们还需要创建一个控制器来控制动画，在资源框里创建**Animator Controller**：

![animator-2](/assets/tutorials/artist/img/27.png)

然后将其拖动到上面的Animator组件的**Controller**选项中：

![animator-3](/assets/tutorials/artist/img/28.png)

之后双击创建的Controller，进入动画控制器编辑界面（不要担心，我们只会用到很简单的功能），然后将FBX模型包中的动画拖入其中：

![animator-4](/assets/tutorials/artist/img/29.png)
![animator-5](/assets/tutorials/artist/img/30.png)

然后，回到主场景窗口，便可以在下方的Animation窗口中预览动画了：

![animator-6](/assets/tutorials/artist/img/31.png)

那么如何直接在Unity中新建动画呢？请看视频：

<video style="max-width: 100%;" src="/assets/tutorials/artist/img/1.mp4" controls></video>

是不是很简单？