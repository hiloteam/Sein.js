(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (factory((global.SeinUMDCustomMaterials = global.SeinUMDCustomMaterials || {}, global.SeinUMDCustomMaterials.UnlitMaterial = {}, global.SeinUMDCustomMaterials.UnlitMaterial)));
}(this, (function (exports) {
  "use strict";
  var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
      extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
    };
    return function (d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  })();
  var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  var Sein = Sein || window.Sein;
  var Material = /** @class */ (function (_super) {
    __extends(Material, _super);
    function Material(options) {
      var _this = _super.call(this, {
          attributes: {
              a_position: 'POSITION',
              a_uv: 'TEXCOORD_0'
          },
          uniforms: {
              u_modelViewProjectionMatrix: 'MODELVIEWPROJECTION',
              u_color: options.uniforms.u_color,
              u_texture: options.uniforms.u_texture
          },
          vs: "\nprecision HILO_MAX_VERTEX_PRECISION float;\nattribute vec3 a_position;\nattribute vec2 a_uv;\nuniform mat4 u_modelViewProjectionMatrix;\nuniform mat3 u_uvMatrix;\nvarying vec2 v_uv;\n\nvoid main() {\nv_uv = a_uv;\n\ngl_Position = u_modelViewProjectionMatrix * vec4(a_position, 1.0);\n}\n",
          fs: "\nprecision HILO_MAX_FRAGMENT_PRECISION float;\nuniform sampler2D u_texture;\nuniform vec4 u_color;\nvarying vec2 v_uv;\n\nvoid main() {\ngl_FragColor = texture2D(u_texture, v_uv) * u_color;\n}\n"
      }) || this;

      _this.isUnlitMaterial = true;
      _this.className = 'Material';
      return _this;
    }
    
    Material = __decorate([
      Sein.SMaterial({ className: 'UnlitMaterial' })
    ], Material);
    return Material;
  }(Sein.RawShaderMaterial));

  exports.default = Material;
})));
