precision HILO_MAX_VERTEX_PRECISION float;
attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord0;
attribute vec2 a_texcoord1;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;
uniform mat4 u_modelViewProjectionMatrix;
uniform mat3 u_normalMatrix;

           
            varying vec2 TextureCoordinate;
           
            void main()
            {
                gl_Position = u_modelViewProjectionMatrix * vec4(a_position, 1.);
                TextureCoordinate = a_texcoord0.xy;
            }
           
            