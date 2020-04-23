# SeinPBR标准材质

我们在Unity中实现了Sein中的标准材质，目前有`PBRMaterial`，并还在不断添加。这些Unity中的材质和Sein中对应材质的效果**完全一致**，推荐你使用这些材质来构建场景！

## 注意

使用之前，请务必保证你的扩展是最新版本：[SeinJSUnityToolkit](https://github.com/hiloteam/SeinJSUnityToolkit/tree/master/bin)！  

>同时在声明一遍，一定要走**线性工作流**！具体切换方式请见[使用Unity扩展](../scene-editor/unity-extension)的材质一节的注意！

## PBRMaterial

首先就是PBRMaterial了，Sein（HILO）中的PBR材质实现的是标准的**GlTF-WebGL-PBR**材质。引入扩展后，这个材质在Unity中的名字是**Sein/PBR**，使用它能让你获得和Sein中PBRMaterial一致的效果。与此同时，由扩展导入的带PBR材质的GlTF场景中的材质也会默认被转换为Sein/PBR，扩展还提供了**由现有的Unity基础材质向Sein/PBR的一键转换功能**。

### 新建使用

你可以按照Unity流程新建一个材质，将其拖动绑定到一个模型上，之后修改这个材质的**Shader**为：

![](/assets/guides/assets/material-sein/0.png)  

选择之后，你就可以开始配置Sein/PBR了：  

![](/assets/guides/assets/material-sein/1.png)  

Sein/PBR的使用中大部分配置和Unity基础材质一致，不过有一些细微的区别：  

1. 可以直接使用**Workflow**选项来选择走金属还是高光渲染流程，不再需要像Unity基础材质一样分为两个Shader。
2. 使用**Unlit mode**配置，你可以直接切换当前材质到无光照模式，导出时也会按照无光照模式导出。
3. PBR相关的贴图完全按照GlTF标准定义来走，比如`Metallic`贴图只识别**B通道**。
4. **Rendering Mode**中，**Fade**选项和**Transparent**选项效果一样，这也是为了和PBR标准一致。
5. **Env reflection**可以指定全局反射的模式，详见以下**全局反射**小节。

>注意使用Sein/PBR是，光照全部和Sein端一样，是物理光照，所以需要把亮度调的高一些。

调整材质后，你可以布光看看效果，差不多了就可以导出了。这里举个例子来证明最后的完全一致性——第一张是Unity中的，第二张是Sein中的：  

![](/assets/guides/assets/material-sein/2.png)  

![](/assets/guides/assets/material-sein/3.png)  

### 全局反射

配置属性**Env reflection**可以选择全局反射的模式，默认是`Off`，即关闭。`Diffuse`和`Specular`分别表示全局漫反射和全局高光反射，`All`则是两种都开启。

要使用全局反射，你还需要在Unity的**Lighting**配置中，配置**Environment**下的参数，主要是**Environment Reflection**下的选项中，**Source**目前只支持**Custom**，然后将的HDR纹理拖入**Cubemap**选项中即可。

### 导入GlTF中的PBR

这个不用多说，在最新版本的扩展中，GlTF中的PBR材质会被作为Sein/PBR材质导入，来保证效果一致性。

### 从Unity标准材质转换

当然我也知道还有一些阻力阻止你用Sein/PBR——“我已经用了这么久基础材质，已经有这么多基础材质了，你让我一个一个调，不得累死我啊！”  

作为一个过来人，我深刻明白这有多么难受，所以提供了一个工具解放你们的痛苦——扩展提供了**四种方法**，来从标准PBR材质转换为Sein/PBR，满足你的各种偷懒！  

>当然，所有原来的材质都会被备份以防万一，你可以在${原先材质名}_bak找到它们。

#### 直接从资源窗口转换

最常用的做法了。直接在资源窗口选中材质或者Prefab，右键唤出菜单选择**Materials to SeinPBR**：  

![](/assets/guides/assets/material-sein/4.png)  

稍等片刻就搞定了。如果你选择的是Prefab，那么会把这个Prefab下关联的所有材质都做转换。

>如果是要转换FBX文件中已经包含的材质，则需要注意你必须在导入模型的时候，在导入选项（先选中资源栏中的模型文件，然后看右上角）的**Materials**Tab中，切换`Location`选项为`Use External Materials`。

#### 从GameObject窗口转换

如果懒得找具体的资源，你也可以直接使用这个方式。选中一堆绑定了标准材质的GameObject，右键唤出菜单选择**Materials to SeinPBR**：  

![](/assets/guides/assets/material-sein/5.png)  

等一会就搞定了。

#### 从Inspector窗口转换

也可以选中GameObject后，在它的Inspector窗口的材质框（最后一栏）右键唤出菜单选择**To SeinPBR**：  

![](/assets/guides/assets/material-sein/6.png)  

等一会就搞定了。

#### 转换整个项目所有的

如果你确实不想一个一个来，又能保证没啥问题，那么终极方案来了——顶部菜单栏选择**SeinJS -> Materials to SeinPBR**：  

![](/assets/guides/assets/material-sein/7.png)  

等一会（可能是一大会），就搞定了。
