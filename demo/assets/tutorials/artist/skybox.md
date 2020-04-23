# 加上背景吧，使用天空盒！

目前我们尝试了导出场景中的各种物体，并对它们进行了预览，但整个背景仍然是灰蒙蒙的，这是因为我们并没有指定天空盒，或者说是相机的背景。

为了拥有背景，我们必须要在Unity中创建一个摄像机（默认场景里就会有一个），选中它然后在右侧的检视视图里是这样的：

![skybox-0](/assets/tutorials/artist/img/44.png)  

注意这里面的`Clear Flags`选项，目前Sein仅支持`Skybox`和`Solid Color`两种类型：

1. Skybox：是指以**天空盒材质为基准**
2. Solid Color：是以下面的`Background`选项中中指定的颜色为背景色。

你可以先尝试一下一下`Solid Color`类型，然后选中相机导出预览看看。

## 创建纹理

为了创建天空盒，我们首先需要一张特殊的纹理，这个纹理可以是HDR纹理，也可以是LDR纹理，但它们需要被处理成**Cubemap或者Panoramic（全景2D图）模式**。

如果是Cubemap，则需要在导入纹理后，，选中它查看Inspector，这里**Texture Shape**我们需要选择**Cube**，**Convolution Type**可选**Specular**，如图：

![skybox-1](/assets/tutorials/artist/img/35.png)

然后点击Apply，之后可以看到纹理变成了球状的表现：

![skybox-2](/assets/tutorials/artist/img/36.png)

如果是全景图，则默认设置即可。

## 天空盒材质

为了创建天空盒，我们还需要创建一个材质，`Shader`选择`Skybox/Cubemap`（其他也可以，看你需求），然后将前面教程的那张纹理拖入图示位置（别的也可以，看需求）：

![skybox-3](/assets/tutorials/artist/img/42.png)

创建完成后，你还需要打开**Lighting**窗口，将刚才创建的材质拖到**Environment**下的**Skybox Material**上赋值：

![skybox-4](/assets/tutorials/artist/img/41.png)

之后只需要返回摄像机组件的检视视图，将类型切换为`Skybox`即可。切换后可以再Unity主视图右下角看到天空盒的大致样子。

此时你只需要再点击预览，便可以看到导出后的样子啦。
