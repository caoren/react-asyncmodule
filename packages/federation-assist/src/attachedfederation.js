import uniq from 'lodash.uniq';

class AttachedFederationPlugin {
    constructor(option) {
        const newopt = option || {};
        this.name = newopt.name;
    }

    apply(compiler) {
        compiler.hooks.compilation.tap('AttachedFederationPlugin', (compilation) => {
            // 获取
            compilation.hooks.afterRuntimeRequirements.tap('AttachedFederationPlugin', () => {
                const remoteChunk = {};
                const exposesMap = {};
                const remotesRelatedDepends = [];
                const { entrypoints, chunkGraph, moduleGraph } = compilation;
                for (const [key, entrypoint] of entrypoints) {
                    const runtimeChunk = entrypoint.getRuntimeChunk();
                    const asyncChunks = runtimeChunk.getAllAsyncChunks();
                    for (const chunk of asyncChunks) {
                        const modules = chunkGraph.getChunkModulesIterableBySourceType(
                            chunk,
                            "remote"
                        );
                        if (!modules) {
                            continue;
                        }
                        const remotes = (remoteChunk[chunk.id] = []);
                        for (const m of modules) {
                            const name = m.internalRequest;
                            const id = chunkGraph.getModuleId(m);
                            remotesRelatedDepends.push(id);
                            const shareScope = m.shareScope;
                            const dep = m.dependencies[0];
                            const externalModule = moduleGraph.getModule(dep);
                            const externalModuleId =
                                externalModule && chunkGraph.getModuleId(externalModule);
                            remotesRelatedDepends.push(externalModuleId);
                            remotes.push({ shareScope, name, externalModuleId });
                        }
                    }
                    // exposes
                    if (runtimeChunk.name === this.name) {
                        const { entryModule } = runtimeChunk;
                        const { blocks } = entryModule;
                        for (const block of blocks) {
                            const { dependencies } = block;
                            const modules = dependencies.map(dependency => {
                                const dep = dependency;
                                return {
                                    name: dep.exposedName,
                                    module: moduleGraph.getModule(dep),
                                    request: dep.userRequest
                                };
                            });
                            const chunkGroup = chunkGraph.getBlockChunkGroup(block);
                            const chunks = chunkGroup.chunks.filter(
                                chunk => !chunk.hasRuntime() && chunk.id !== null
                            );
                            exposesMap[modules[0].name] = chunks.map(item => item.id);
                        }
                    }
                }
                compilation.remotesMap = remoteChunk;
                compilation.exposesMap = exposesMap;
                compilation.remotesRelatedDepends = remotesRelatedDepends;
            });
            // 挂载到 stats 上
            compilation.hooks.statsFactory.tap('AttachedFederationPlugin', (statsFactory) => {
                statsFactory.hooks.extract
                    .for('compilation')
                    .tap("AttachedFederationPlugin", (obj, data, ctx) => {
                        const remotesMap = data['remotesMap'];
                        const exposesMap = data['exposesMap'];
                        const remotesRelatedDepends = data['remotesRelatedDepends'];
                        if (Object.keys(remotesMap).length > 0) {
                            obj['remotesMap'] = remotesMap;
                        }
                        if (Object.keys(exposesMap).length > 0) {
                            obj['exposesMap'] = exposesMap;
                        }
                        if (remotesRelatedDepends.length > 0) {
                            obj['remotesRelatedDepends'] = uniq(remotesRelatedDepends);
                        }
                    });
            });
        });
    }
}

module.exports = AttachedFederationPlugin;