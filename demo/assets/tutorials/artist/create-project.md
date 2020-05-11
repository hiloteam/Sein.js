## 第一步，创建新工程

这一步对于新手建议使用模板用例工程来避免一些配置上的的麻烦：

[Sein.js Unity标准模板工程](/assets/tutorials/artist/SeinjsProjectTemplate.zip)

如果你需要更进一步的自定义性，可以参考下面的内容，否则直接进入下一节即可[# 加入魔法，导入Sein扩展](#加入魔法，导入Sein扩展)。

### 自定义

点击右上角的**新建**按钮，唤出新建项目栏便可以开始开始创建：

![create](/assets/tutorials/artist/img/2.png)

>项目名称不建议有空格！建议全部使用英文！

创建完成后，便可以看到Unity主界面了：

![new](/assets/tutorials/artist/img/3.png)

为了保证迎合现代的工作流程，我们需要先设置一下工作流，这一步对于设计同学可能有点难以理解，不用担心，每个项目只需要配置一遍即可：

![build-settings](/assets/tutorials/artist/img/4.png)

![player-settings](/assets/tutorials/artist/img/5.png)

![player](/assets/tutorials/artist/img/6.png)

在最后这个界面的**Other Settings**中，将**Color Space**改成**Linear**即可。

>目前而言，如果是windows平台下使用`Sein/PBR`材质出现问题，请将`Auto Graphics API for Windows`关闭，然后手动设定为`OpenGLCore`（需要设置为第一位）！

最后是灯光设置，打开:

![lightings](/assets/tutorials/artist/img/7.png)

目前环境光只支持**Color**，并且不支持全局太阳光，所以要将这些去掉（因为目前不需要烘焙，所以**Realtime lighting**和**Baked lighting**也都去掉）：

![lightings-2](/assets/tutorials/artist/img/8.png)
