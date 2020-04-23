## 进阶，添加灯光、相机

上面完成了最基本对象操作，下面让我们来看看灯光和相机应该如何操作。

在新建好的默认场景中本就存在一个灯光和一个相机——**透视相机MainCamera**和**平行光DirectionalLight**，你可以先调节一下他们的参数感受一下，同时也可以创建更多的灯光，和创建对象相似。

>在移动端建议只添加一个平行光。

除了这几个灯光之外，我们还有一个全局光可以配置，全局光，顾名思义就是整个场景提亮的光照，这需要我们打开**Lighting**界面，去设置它的**Environment Lighting**，注意目前`Source`只支持`Color`，然后调节`Ambient Color`即可：

![add-light](/assets/tutorials/artist/img/19.png)
