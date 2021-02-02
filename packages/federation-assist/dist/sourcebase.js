"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var SourceBase = /*#__PURE__*/function () {
  function SourceBase(option) {
    var newopt = option || {};
    this.entryChunkName = newopt.entryChunkName;
  }

  var _proto = SourceBase.prototype;

  _proto._apply = function _apply(compiler) {
    var _this = this;

    compiler.hooks.afterCompile.tapAsync('LastExportModulePlugin', function (compilation, cb) {
      for (var _i = 0, _Object$entries = Object.entries(compilation.assets); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _Object$entries[_i],
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];

        if (key === _this.entryChunkName + ".js") {
          _this.fetchSource(value);
        }
      }

      cb();
    });
  } // 存在 4 种source (cacheSouce, concatSource, PrefixSource, RawSource)
  ;

  _proto.fetchSource = function fetchSource(source) {
    var cursource = source; // cacheSource 的 originalLazy 方法返回内部的 _source，一般是 concatSource

    if (source.originalLazy) {
      cursource = source.originalLazy();
      source._cachedSource = undefined;
    } else if (source.original) {
      cursource = source.original();
    } else if (source.getChildren) {
      // concatSource 的 getChildren 返回内部的 _children, 一般是 RawSource 和 字符串
      cursource = source.getChildren();
    }

    this.eachSource(cursource);
  };

  _proto.eachSource = function eachSource(source) {
    var _this2 = this;

    if (Array.isArray(source)) {
      source.forEach(function (item, n) {
        if (typeof item === 'string') {
          source[n] = _this2.replaceSource(item);
        } else if (typeof item._value === 'string') {
          item._value = item._value ? _this2.replaceSource(item._value) : item._value;
        } else {
          _this2.fetchSource(item);
        }
      });
    } else if (typeof source._value === 'string') {
      source._value = source._value ? this.replaceSource(source._value) : source._value;
    } else {
      this.fetchSource(source);
    }
  };

  _proto.replaceSource = function replaceSource(source) {
    return source;
  };

  return SourceBase;
}();

var _default = SourceBase;
exports["default"] = _default;
module.exports = exports.default;