# SeinBasic材质

除了PBR材质之外，为了应对某些特殊场景，Sein还在Unity中提供了标准的`BasicMaterial`供大家使用，其名为`Sein/Basic`，支持了`NONE`（无光照）和`PHONG`、`BILINN-PHONE`、`LAMBERT`这三种经典的光照模型。

## 材质详情

材质在编辑器中如下：

![](/assets/guides/assets/material-basic/0.png)  

如图，其提供了如下属性：

1. Rendering Mode: 渲染方式。
2. Light Type: 光照模型。
3. Diffuse：漫反射贴图或颜色，贴图优先。
4. Specular：高光贴图或颜色，贴图优先。
5. Ambient：环境贴图。
6. Normal：法线贴图。
7. Emission：自发光贴图或颜色，贴图优先。
8. Shininess：高光亮度。
9. 后面几个配合全局反射，暂时不支持。

开发者可以自行调整后预览，看看效果。
