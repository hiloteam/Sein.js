# 使用图集和精灵

SeinJSUnityToolkit 1.0.6以上的版本加入了对图集和精灵的支持，让我们先以一个视频来预览一下这个功能吧：

<video style="max-width: 100%;" src="/assets/guides/assets/unity-atlas-sprite/0.mp4" controls></video>

## 图集

图集是Sein中一个重要的功能，它可以有效的增加纹理复用率，现在我们可以直接在Unity中构建Sein中的图集了，方法很简单：

1. 在资源窗口，右键 -> Sein -> Atlas，便可以创建一个图集：

![](/assets/guides/assets/unity-atlas-sprite/1.png)  

![](/assets/guides/assets/unity-atlas-sprite/2.png)  

2. 在Inspector窗口中，在**Images**下添加你需要打包的图片，并设置合理的Width、Height和Padding，比如：

![](/assets/guides/assets/unity-atlas-sprite/3.png)  


3. 点击**Pack**按钮，进行打包，如果出错了会有详细信息，按情况调整即可，这是打包成功后：

![](/assets/guides/assets/unity-atlas-sprite/4.png)  

然后就可以进入下一节给精灵使用啦。

### 直接导入已有图集

有时候我们拥有一些已有的资源，比如从**pixi.js**项目中遗留下来的，想复用。这里我们也提供了一个简单的方式，只需要在创建图集后，点击**Import**按钮，选择你要导入的图集的json索引，便可以自动导入分割了。

当然，GlTF文件中的图集导入自然是支持的。

## 精灵

有了图集，我们便可以创建精灵进行使用，要创建精灵也很简单：

1. 在GameObject窗口右键，选择Sein -> Create Sprite：

![](/assets/guides/assets/unity-atlas-sprite/5.png)  

![](/assets/guides/assets/unity-atlas-sprite/6.png)  

2. 调节Inspector中**Sein Sprite**组件的Width、Height，点击**Generate**按钮可以重新生成图元数据。

![](/assets/guides/assets/unity-atlas-sprite/7.png)  

3. 将刚才创建的图集（Atlas文件）直接拖动到**Sein Sprite**组件的`Atlas`属性中，接着配置`FrameName`属性，便可以看到结果啦：

![](/assets/guides/assets/unity-atlas-sprite/8.png)  

4. 还可以调节`isBillboard`属性决定精灵是否是公告牌模式，确认后便可以用Exporter的预览功能预览了，也可以正常导出使用了。
