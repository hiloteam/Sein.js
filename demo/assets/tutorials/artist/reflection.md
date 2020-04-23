## 更酷炫，需要全局反射？

有时候，我们需要全局反射来让PBR达到更好的效果，Sein当然也提供了这个能力。

首先你可以按照上一章的方法，创建一个天空盒材质并使用它，之后回到需要受环境反射影响的对象，比如上面创建的球体，将其材质的**Env Reflection**选项设置为**All**：

>注意，如果使用`Cubemap`或者`6Sided`材质，则目前在安卓机上无法正确使用（因为Shader不支持`texEnvLod`），所以建议使用全景图材质，即`Panoramic`。

![reflection-1](/assets/tutorials/artist/img/38.png)

即可看到效果：

![reflection-2](/assets/tutorials/artist/img/39.png)

然后我们就可以预览了，注意这里要勾选**Export reflection**选项：

![reflection-3](/assets/tutorials/artist/img/40.png)

>当然，你也可以不依赖于天空盒用别的贴图来实现全局反射，暂时不推荐

如果要不依赖天空盒使用自定义纹理，让我们打开**Lighting**配置，在**Environment Reflections**中的**Source**选择Custom，将刚才的HDR纹理拖到**Cubemap**选项中，如图：

![reflection-4](/assets/tutorials/artist/img/37.png)
