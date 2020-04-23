## 小试牛刀，添加物体、材质、纹理

接下来便可以开始场景布置工作了，让我们从一个简单的模型开始，首先在左上角（已经存在了一个灯光和一个摄像机）的场景区域，右键唤起菜单并如图选择一个球体：

![add-sphere](/assets/tutorials/artist/img/11.png)

之后便可以看到有一个球体被放置在场景中间了，但目前这个球体还只是纯白的，这是因为我们还没有给他赋予**材质**，对于Sein的工程，我们需要给每一个物体都绑定材质，对于大部分工程，使用的都是Sein的标准PBR材质。

>Sein使用的PBR材质完全遵守WebGL的PBR规范。

## 创建材质

下面让我们来创建材质，新建一个文件夹**Resource**，下面在新建**Sphere**文件夹作为这个模型的分类，最后创建**Materials**文件夹：

![add-folder](/assets/tutorials/artist/img/12.png)

之后再创建一个材质**Materials**：

![add-material-1](/assets/tutorials/artist/img/13.png)
![add-material-2](/assets/tutorials/artist/img/14.png)

点击这个材质，可以在右侧的**Inspector**看到他的配置，这里我们需要把**Shader**改成**Sein/PBR**：

![add-material-3](/assets/tutorials/artist/img/15.png)

之后便可以看到整体的材质了，详细的材质说明请见[在Unity中的Sein标准材质](../../guide/material-sein)。

接着，便可以直接把材质**直接拖到**刚才创建好的对象上，便可以完成材质的绑定，此时点击那个球体对象，应该可以在右边的Inspector看到他的详情，最下面就是绑定的材质：

![add-material-4](/assets/tutorials/artist/img/16.png)

## 创建纹理

接下来，让我们创建一个纹理，所谓纹理，在美术角度可以理解为图片。这里我们新建一个**Textures**文件夹用来存放他们，然后随便选一张图**拖放到这个目录下**，然后点击这个资源，便可以在右边看到详情：

![add-texture-1](/assets/tutorials/artist/img/17.png)

>这里特别要注意**SRB(Color Texture)**这个选项，它是默认勾选的，但如果不是颜色纹理，而是线性纹理，比如金属度贴图、粗糙度贴图这些，就需要把勾选去掉，然后点击右下角的**Apply**保存。

然后让我们点击对象返回到材质详情，将这个纹理**拖放到**材质详情的**Base(RGBA)**属性的左侧小格子中，便可以看到效果了：

![add-texture-2](/assets/tutorials/artist/img/18.png)

同理，其他的属性也可以这样配置。