Shader "UnlitGLSLShader"
{
    Properties {
        u_diffuseMap ("Base (RGB)", 2D) = "white" {}
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
