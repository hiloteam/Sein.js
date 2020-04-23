## 导入模型！

上面的章节基本介绍了一个完整的工程流程，接下来就是如何导入模型了。模型的种类多种多样，但目前最通用的还是FBX，所以我们需要先有一个FBX模型，然后将其直接拖入Unity中。

这里以小鸡为例，我们先把它拖入，然后点击拖入的资源，展开便可以看到里面的内容：

![model-1](/assets/tutorials/artist/img/23.png)

还可以查看右侧的Inspector：

![model-2](/assets/tutorials/artist/img/24.png)

这里面有许多选项，但一般都不需要管。

然后还是一样，直接把模型拖动到场景栏中，创建Sein/PBR材质，绑定给模型，添加纹理、调节材质参数：

![model-3](/assets/tutorials/artist/img/25.png)

之后便可以预览了。 

## 直接转换已有材质

如果你的FBX文件中已经包含了材质球，那么我们可以直接复用这些材质，而不需要自行创建，这里唯一需要注意的是你需要在导入模型的时候，在导入选项（先选中资源栏中的模型文件，然后看右上角）的**Materials**Tab中，切换`Location`选项为`Use External Materials`（如图）：

![model-3](/assets/tutorials/artist/img/45.png)

如果是使用新版本的Unity，你也可以在同界面使用`Extract Materials`按钮，来进行材质分离操作。

剩下的操作参考这里即可：[教程 - SeinPBR标准材质 - 从Unity标准材质转换](../../guide/scene-editor/material-sein#PBRMaterial-从Unity标准材质转换)。

如此一来，便可以自动化完成FBX中的材质到Sein标准材质的转换。

>Sein的扩展同样也支持导入GlTF文件，你可以先使用导出功能导出后，参考这里的教程导入：[导入GlTF模型](../../guide/unity#导入)。
