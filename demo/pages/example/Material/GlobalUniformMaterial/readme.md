@cn

拥有全局Uniform的材质，准确来讲是创建全局Uniform的方法，本例子给出了如何创建一个全局共享的Uniform的方法，比如默认中带有的“相机的视图矩阵”。  

此方法是比较简洁的方法，利用`isGlobal`开关控制Uniform是否全局，若有特殊需求，需要使用全局的自定义Senmatic，请见另一个DEMO——[自定义语义](./custom-semantic)。  

>注意在这种情况下，需要自己管理特殊的Uniform的`{value: xxx}`对象，不要直接使用`setUniform`或者`changeUniform`方法！

@en

hahahaha
