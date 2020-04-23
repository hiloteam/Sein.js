@cn

你可以使用RawShaderMaterial来创建完全自定义的材质，此材质不会有任何预制的Attributes和Uniforms，适合想完全控制整个材质的开发者。  

要使用该材质，主要是需要指定两个着色器`vs`、`fs`、`uniforms`、`attributes`和`defines`等。你可以直接通过实例化`RawShaderMaterial`的方式来创建，如示例代码，也可以继承它并重写构造函数来实现，这种方式一般用于给gltf模型自定义材质（详见“材质扩展”）。

@en

hahahaha
