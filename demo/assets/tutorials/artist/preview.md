## 先预览一下效果

到此，我们可以预览效果了（终于要见到Toolkit的本体了），从SeinJS菜单唤起**Export to GlTF**：

![preview-1](/assets/tutorials/artist/img/20.png)

可以看到有很多配置选项，但目前我们不需要关注。这里我们只需要在左侧的场景区域选择需要预览的物体，然后点击Exporter左下方的**Preview**按钮即可（如果选择了一个相机，则会用这个相机预览，否则创建默认的相机）：

>如果你也需要预览环境光，请勾选**Lighting Settings**中的**Export ambient light**即可。

![preview-2](/assets/tutorials/artist/img/21.png)

之后变回唤起浏览器打开一个页面，里面就是当前场景的在**Sein.js**中预览的结果，可见基本完全一致：

![preview-3](/assets/tutorials/artist/img/22.png)

同时这里面还附带了**seinjs-inspector**，你可以使用它检视系统信息和场景中的物体，还附带了一个二维码，**可以用手机直接扫描**查看！

当打开了页面后，再次Preview并不会打开新页面，而是在原页面刷新！

>关于Inspector目前不需要介绍太多，需要用到的功能后面会说到。
