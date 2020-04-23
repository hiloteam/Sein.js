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
