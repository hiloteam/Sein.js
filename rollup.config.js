/**
 * @File   : rollup.config.js
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 12/3/2018, 1:54:33 PM
 * @Description:
 */
import path from 'path';
import json from 'rollup-plugin-json';
import alias from 'rollup-plugin-alias';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import {terser} from 'rollup-plugin-terser';

const commonPlugins = [
  alias({
    axios: path.resolve(__dirname, './node_modules/axios/dist/axios.js'),
    hilo3d: path.resolve(__dirname, './Hilo3d/seinjs-build/Hilo3d.js')
  }),
  typescript({
    tsconfig: './src/tsconfig.json',
    tsconfigOverride: {
      compilerOptions: {
        module: 'es2015',
        allowJs: false,
        declaration: true
      }
    },
    rollupCommonJSResolveHack: true
  }),
  json(),
  nodeResolve({browser: true}),
  commonjs({
    namedExports: {
      [path.resolve(__dirname, './Hilo3d/seinjs-build/Hilo3d.js')]: [
        'util',
        'GLTFExtensions',
        'Class',
        'EventMixin',
        'Fog',
        'Mesh',
        'Node',
        'SkinedMesh',
        'Stage',
        'Tween',
        'version',
        'BoxGeometry',
        'Geometry',
        'GeometryData',
        'MorphGeometry',
        'PlaneGeometry',
        'SphereGeometry',
        'Camera',
        'PerspectiveCamera',
        'OrthographicCamera',
        'Buffer',
        'capabilities',
        'extensions',
        'Framebuffer',
        'glType',
        'Program',
        'RenderInfo',
        'RenderList',
        'VertexArrayObject',
        'WebGLRenderer',
        'WebGLResourceManager',
        'WebGLState',
        'BasicLoader',
        'CubeTextureLoader',
        'GLTFLoader',
        'GLTFParser',
        'AliAMCExtension',
        'HDRLoader',
        'KTXLoader',
        'LoadCache',
        'LoadQueue',
        'ShaderMaterialLoader',
        'TextureLoader',
        'Loader',
        'Texture',
        'LazyTexture',
        'CubeTexture',
        'DataTexture',
        'Shader',
        'BasicMaterial',
        'GeometryMaterial',
        'Material',
        'PBRMaterial',
        'semantic',
        'ShaderMaterial',
        'AxisHelper',
        'AxisNetHelper',
        'CameraHelper',
        'AmbientLight',
        'AreaLight',
        'DirectionalLight',
        'CubeLightShadow',
        'Light',
        'LightManager',
        'LightShadow',
        'PointLight',
        'SpotLight',
        'Animation',
        'AnimationStates',
        'MeshPicker',
        'Ticker',
        'log',
        'Cache',
        'browser',
        'WebGLSupport',
        'constants',
        'Color',
        'Euler',
        'EulerNotifier',
        'Frustum',
        'math',
        'Matrix3',
        'Matrix4',
        'Matrix4Notifier',
        'Plane',
        'Quaternion',
        'Ray',
        'Sphere',
        'Vector2',
        'Vector3',
        'Vector3Notifier',
        'Vector4',
        'SphericalHarmonics3',
        'Skeleton'
      ]
    }
  })
];
const minifyPlugins = commonPlugins.slice();
minifyPlugins.push(terser({
  output: {
    comments: function(node, comment) {
      var text = comment.value;
      var type = comment.type;
      if (type == 'comment2') {
        // multiline comment
        return /@preserve|@license|@cc_on/i.test(text);
      }
    }
  }
}));

export default [
  {name: 'seinjs', format: 'cjs', minify: false},
  {name: 'seinjs', format: 'cjs', minify: true},
  {name: 'seinjs.es', format: 'esm', minify: false},
  {name: 'seinjs.es', format: 'esm', minify: true},
  {name: 'seinjs.umd', format: 'umd', minify: false},
  {name: 'seinjs.umd', format: 'umd', minify: true}
].map(({name, format, minify, external}) => ({
  input: './src/index.ts',

  output: [
    {
      file: `./lib/${name}${minify ? '.min' : ''}.js`,
      format: format,
      name: 'Sein'
    }
  ],

	plugins: minify ? minifyPlugins : commonPlugins
}))
