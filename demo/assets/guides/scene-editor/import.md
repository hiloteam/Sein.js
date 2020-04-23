# 导入glTF

Toolkit同样支持GlTF文件的导入，如果要使用，建议配合标准的PBR流程。虽然不支持扩展导入，但如果导入的预制体已然被修改并保存，在覆盖导入时这些修改将被合并，不用重新添加一遍！  

要使用导入，只需要在Topbar中的**SeinJS**中选择**Import GlTF**，便可唤出导入菜单：  

![import](/assets/guides/assets/unity/6.png)  

你可以点击**Select file**或者直接拖动`gltf`文件或者打包后的`zip`文件到窗口上来选择要导入的模型，并通过`Change destination`来指定导入到项目下的哪个文件夹内，建议使用默认路径。通过`Perfab name`可以指定预制体的名字，这个一般也不需要修改。  

同时如果你想要使用烘焙功能，却没有预先生成UV2，那么可以勾选`Generate LightMap UVS`，将自动生成。  

配置后点击**Import**，便可以执行导入，导入后的文件结构如下：  

![import-result](/assets/guides/assets/unity/7.png)  

之后正常使用即可。
