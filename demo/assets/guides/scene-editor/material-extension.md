# 自定义材质

我们可以直接在Unity中指定自定义材质，并通过`Sein_customMaterial`扩展集成到GlTF中，并最终解析。这提供了一个将Unity中的材质和最终端上的材质连接起来的能力。

Unity扩展提供了两种方式来让开发者实现这样的目的，第一种方法适合临时使用（无法在Unity中看到最终效果），第二种方法适合长期复用（可以看到效果）。

## 临时方案

临时方案比较简单，直接使用`SeinCustomMaterial`即可：

### Unity中

![Sein_customMaterial](/assets/guides/assets/material-extension/1.png)  

你可以通过`ClassName`指定在Sein中编写的材质名字；若该模型有多个材质，你还可以使用`Unity Material Name`来指定改自定义材质对应的哪个原始材质（图元/SubMesh）；之后若有需求，可以用`CloneForInst`来告诉引擎实例化的时候克隆材质，这适用于拥有材质动画的模型；最后，还可以通过`Render Order`来指定渲染顺序。

而`Uniforms`下的所有字段，则是用于指定要传到Sein中、在初始化时使用的uniform参数。

### Sein中

要使用材质扩展，必须在Sein中也编写有对应的材质，让我们看个例子：

```ts
@Sein.SMaterial({className: 'TestMaterial'})
class TestMaterial extends Sein.RawShaderMaterial {
  constructor(options: {
    uniforms: {
      u_diffuseMap: {value: Sein.Texture}
    }
  }) {
    super({
      blendSrc: Sein.Constants.ONE,
      blendDst: Sein.Constants.ONE,
      attributes: {
        a_position: 'POSITION',
        a_uv: 'TEXCOORD_0'
      },
      uniforms: {
        u_modelViewProjectionMatrix: 'MODELVIEWPROJECTION',
        u_diffuseMap: options.uniforms.u_diffuseMap
      },
      vs: `
precision highp float;
precision highp int;

attribute vec3 a_position;
attribute vec2 a_uv;

uniform mat4 u_modelViewProjectionMatrix;

varying vec2 v_uv;

void main()
{
  gl_Position = u_modelViewProjectionMatrix * vec4(a_position, 1.0);
  v_uv = a_uv;
}
      `,
      fs: `
precision mediump float;
precision mediump int;

uniform sampler2D u_diffuseMap;
varying vec2 v_uv;

void main()
{
  gl_FragColor = texture2D(u_diffuseMap, v_uv);
}     
      `
    });
  }
}
```

这是一个最简单的无光照材质，其使用`u_diffuseMap`作为纹理。在这个材质中，我们可以知道要注意的几点：

1. 使用`SMatrial`装饰器指定材质名称，这个名称一定要对应Unity中`SeinCustomMaterial`组件中指定的`Class Name`。
2. 实例化带有扩展材质的模型前，必须保证材质定义代码已被执行。
3. 材质的构造函数形式是有约定的，必须是上面这种`options: {uniforms: {u: {value: T}}}`的形式。
4. 至少指定一个顶点着色器`vs`和片段着色器`fs`。

在Sein端编写了材质并运行后，你就可以直接实例化带有`Sein_customMaterial`扩展的模型啦。

### 定制化

当然，我也这种临时方案也提供了一定程度的复用能力，但需要你写一丢丢C#代码：

```c#
using UnityEngine;
using System.Collections.Generic;
using System;
using UnityEditor;

[CustomEditor(typeof(CustomSeinMaterial))]
public class CustomSeinMaterialInspector : SeinCustomMaterialInspector
{
    public override string[] GetActiveUniforms() {
        return new string[] {
            "uniformsTexture",
            "uniformsFloat",
            "uniformsFloatVec3"
        };
    }
}

public class CustomSeinMaterial : SeinCustomMaterial
{
    CustomSeinMaterial()
    {
        className = "CustomSeinMaterial";
        Array.Resize(ref this.uniformsFloat, 1);
        uniformsFloat.SetValue(new SeinMaterialUniformFloat { name = "haha", value = 1 }, 0);
    }
}
```

这段代码中我编写了一个C#文件，分别在两个类的方法中指定了不同的功能，`GetActiveUniforms`方法中返回的是要显示在编辑器中的Uniform字段，而`CustomSeinMaterial`的构造方法中则可以做一些其他的定制，比如指定默认值。

有更多问题可以直接联系我。

## 长期方案

上面的方法虽然简单，但美术或者开发者没有办法在Unity中就看到自定义材质的效果，于是有了这个长期方案。

长期方案稍微复杂一些，但收益更大。你需要在Unity中编写Unity的Shader，并且在Sein中也编写一个对应的材质，两者对应起来就可以让美术或者开发者在Unity中可以看到和最终展示出来的一致的效果。  

### Sein中

Sein中要做的事情和上一种方案一致。

### Unity中

首先要编写Unity的材质，我们有两种方式——可以使用用**CG**语言编写，也可以使用**glsl**。对于我们当然是glsl更熟悉啦，所以你需要使用**OpenGL**渲染：

1. 其一，我们需要开启OpenGLCore渲染，这个需要在**File -> Build Setting -> Player Setting**中修改，比如在MAC中，就需要将**Metal Eidtor Support**选项关掉。
2. 必须使用**glsl**来编写Shader，如何使用可以看Unity官方教程[GLSL Shader programs](https://docs.unity3d.com/Manual/SL-GLSLShaderPrograms.html)，也可以从下面“实例”一节查看一个基础的Shader例子。


完成后，便可以创建并编写Unity中的Shader，这里我们再次先看一个例子：  

```glsl
Shader "Sein/Unlit"
{
     Properties {
        u_diffuseMap ("Base (RGB)", 2D) = "white" {}
        u_t1 ("t1", Float) = 0.
        u_t2 ("t2", Int) = 0
        u_t3 ("t3", Range(0, 1)) = 0
        u_t4 ("t4", Color) = (0, 0, 0, 1)
        u_t5 ("t5", Vector) = (0, 0, 0, 1)
        u_t6 ("t6", Cube) = "defaulttexture" {}
        
        [MaterialToggle] cloneForInst ( "Clone For Inst", int ) = 0
    }
   
    SubShader {
        Tags { "Queue" = "Geometry" }
       
        Pass {
            GLSLPROGRAM
           
            #ifdef VERTEX
           
            varying vec2 TextureCoordinate;
           
            void main()
            {
                gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
                TextureCoordinate = gl_MultiTexCoord0.xy;
            }
           
            #endif
           
            #ifdef FRAGMENT
                       
            uniform sampler2D u_diffuseMap;
            varying vec2 TextureCoordinate;
           
            void main()
            {
                gl_FragColor = texture2D(u_diffuseMap, TextureCoordinate);
            }
           
            #endif
           
            ENDGLSL
        }
    }
}
```

这段代码中我们定义了一个拥有很多uniform的材质，其uniform选项通过Unity专用的语法定义在`Properties`中。可见，其和Unity其他材质的使用没有区别，需要注意的只有三点：  

1. 为了让Sein扩展能识别到这是一个对应于Sein扩展材质的Unity材质，必须将其命名为**Sein/${ClassName}**的形式，其中`ClassName`是对应在Sein中的`SMaterial`装饰的名称，比如在上面的例子中，他就是`Unlit`。
2. `cloneForInst`是一个特殊的属性，你必须用`[MaterialToggle] cloneForInst ( "Clone For Inst", int ) = 0`的形式定义，它不会被解析成`uniform`，而会被对应到`Sein_customMaterial`中的`cloneForInst`。
3. **Render Queue**对应于`renderOrder`。

### 使用

编写完成后，我们便可以创建一个Unity的Material资源、将其绑定到模型上或者直接使用模型原始材质，之后修改其**Shader**配置，找到我们编写的材质，其被使用时展示的效果如下：  

![Sein_customMaterial](/assets/guides/assets/material-extension/2.jpg)  

和通常材质一样使用即可，编辑完导出，剩下的流程和上一种方案一致。
