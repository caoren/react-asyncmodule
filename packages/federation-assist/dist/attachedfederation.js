"use strict";

var _lodash = _interopRequireDefault(require("lodash.uniq"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var AttachedFederationPlugin = /*#__PURE__*/function () {
  function AttachedFederationPlugin(option) {
    var newopt = option || {};
    this.name = newopt.name;
  }

  var _proto = AttachedFederationPlugin.prototype;

  _proto.apply = function apply(compiler) {
    var _this = this;

    compiler.hooks.compilation.tap('AttachedFederationPlugin', function (compilation) {
      // 获取
      compilation.hooks.afterRuntimeRequirements.tap('AttachedFederationPlugin', function () {
        var remoteChunk = {};
        var exposesMap = {};
        var remotesRelatedDepends = [];
        var entrypoints = compilation.entrypoints,
            chunkGraph = compilation.chunkGraph,
            moduleGraph = compilation.moduleGraph;

        for (var _iterator = _createForOfIteratorHelperLoose(entrypoints), _step; !(_step = _iterator()).done;) {
          var _step$value = _step.value,
              key = _step$value[0],
              entrypoint = _step$value[1];
          var runtimeChunk = entrypoint.getRuntimeChunk();
          var asyncChunks = runtimeChunk.getAllAsyncChunks();

          for (var _iterator2 = _createForOfIteratorHelperLoose(asyncChunks), _step2; !(_step2 = _iterator2()).done;) {
            var chunk = _step2.value;

            var _modules = chunkGraph.getChunkModulesIterableBySourceType(chunk, "remote");

            if (!_modules) {
              continue;
            }

            var remotes = remoteChunk[chunk.id] = [];

            for (var _iterator4 = _createForOfIteratorHelperLoose(_modules), _step4; !(_step4 = _iterator4()).done;) {
              var m = _step4.value;
              var name = m.internalRequest;
              var id = chunkGraph.getModuleId(m);
              remotesRelatedDepends.push(id);
              var shareScope = m.shareScope;
              var dep = m.dependencies[0];
              var externalModule = moduleGraph.getModule(dep);
              var externalModuleId = externalModule && chunkGraph.getModuleId(externalModule);
              remotesRelatedDepends.push(externalModuleId);
              remotes.push({
                shareScope: shareScope,
                name: name,
                externalModuleId: externalModuleId
              });
            }
          } // exposes


          if (runtimeChunk.name === _this.name) {
            var entryModule = runtimeChunk.entryModule;
            var blocks = entryModule.blocks;

            for (var _iterator3 = _createForOfIteratorHelperLoose(blocks), _step3; !(_step3 = _iterator3()).done;) {
              var block = _step3.value;
              var dependencies = block.dependencies;
              var modules = dependencies.map(function (dependency) {
                var dep = dependency;
                return {
                  name: dep.exposedName,
                  module: moduleGraph.getModule(dep),
                  request: dep.userRequest
                };
              });
              var chunkGroup = chunkGraph.getBlockChunkGroup(block);
              var chunks = chunkGroup.chunks.filter(function (chunk) {
                return !chunk.hasRuntime() && chunk.id !== null;
              });
              exposesMap[modules[0].name] = chunks.map(function (item) {
                return item.id;
              });
            }
          }
        }

        compilation.remotesMap = remoteChunk;
        compilation.exposesMap = exposesMap;
        compilation.remotesRelatedDepends = remotesRelatedDepends;
      }); // 挂载到 stats 上

      compilation.hooks.statsFactory.tap('AttachedFederationPlugin', function (statsFactory) {
        statsFactory.hooks.extract["for"]('compilation').tap("AttachedFederationPlugin", function (obj, data, ctx) {
          var remotesMap = data['remotesMap'];
          var exposesMap = data['exposesMap'];
          var remotesRelatedDepends = data['remotesRelatedDepends'];

          if (Object.keys(remotesMap).length > 0) {
            obj['remotesMap'] = remotesMap;
          }

          if (Object.keys(exposesMap).length > 0) {
            obj['exposesMap'] = exposesMap;
          }

          if (remotesRelatedDepends.length > 0) {
            obj['remotesRelatedDepends'] = (0, _lodash["default"])(remotesRelatedDepends);
          }
        });
      });
    });
  };

  return AttachedFederationPlugin;
}();

module.exports = AttachedFederationPlugin;