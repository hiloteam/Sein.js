precision HILO_MAX_FRAGMENT_PRECISION float;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;
uniform mat4 u_modelViewProjectionMatrix;
uniform mat3 u_normalMatrix;

                       
            uniform sampler2D u_diffuseMap;
            varying vec2 TextureCoordinate;
           
            void main()
            {
                gl_FragColor = texture2D(u_diffuseMap, TextureCoordinate);
            }
           
            