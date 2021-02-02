"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sourcebase = _interopRequireDefault(require("./sourcebase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var CKRPSTR = 'var installedChunks = {';
var IDRPSTR = 'var idToExternalAndNameMapping = {';
var CARPSTR = 'var __webpack_module_cache__ = {};';

var LastExportModulePlugin = /*#__PURE__*/function (_SourceBase) {
  _inheritsLoose(LastExportModulePlugin, _SourceBase);

  function LastExportModulePlugin(option) {
    return _SourceBase.call(this, option) || this;
  }

  var _proto = LastExportModulePlugin.prototype;

  _proto.apply = function apply(compiler) {
    this._apply(compiler);
  }
  /* 
   * __webpack_module_cache__
   * installedChunks
   * idToExternalAndNameMapping
   * 针对上诉 3 种，挂在到 __webpack_require__ 下
   **/
  ;

  _proto.replaceSource = function replaceSource(source) {
    var ckIdx = source.indexOf(CKRPSTR);
    var idIdx = source.indexOf(IDRPSTR);
    var caIdx = source.indexOf(CARPSTR);
    var idx;
    var replacestr;
    var originstr;

    if (ckIdx > -1) {
      idx = ckIdx;
      replacestr = 'var installedChunks = __webpack_require__.__installedChunks__ = {';
      originstr = CKRPSTR;
    } else if (idIdx > -1) {
      idx = idIdx;
      replacestr = 'var idToExternalAndNameMapping = __webpack_require__.__idToExternalAndNameMapping__ = {';
      originstr = IDRPSTR;
    } else if (caIdx > -1) {
      idx = caIdx;
      replacestr = 'var __webpack_module_cache__ = __webpack_require__.mcache = {};';
      originstr = CARPSTR;
    }

    if (idx && replacestr) {
      return "" + source.slice(0, idx) + replacestr + source.slice(idx + originstr.length);
    }

    return source;
  };

  return LastExportModulePlugin;
}(_sourcebase["default"]);

var _default = LastExportModulePlugin;
exports["default"] = _default;
module.exports = exports.default;