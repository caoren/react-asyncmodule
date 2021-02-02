class SourceBase {
    constructor(option) {
        const newopt = option || {};
        this.entryChunkName = newopt.entryChunkName;
    }

    _apply(compiler) {
        compiler.hooks.afterCompile.tapAsync('LastExportModulePlugin', (compilation, cb) => {
            for(const [key, value] of Object.entries(compilation.assets)) {
                if (key === `${this.entryChunkName}.js`) {
                    this.fetchSource(value);
                }
            }
            cb();
        });
    }

    // 存在 4 种source (cacheSouce, concatSource, PrefixSource, RawSource)
    fetchSource(source) {
        let cursource = source;
        // cacheSource 的 originalLazy 方法返回内部的 _source，一般是 concatSource
        if (source.originalLazy) {
            cursource = source.originalLazy();
            source._cachedSource = undefined;
        } else if (source.original) {
            cursource = source.original();
        } else if (source.getChildren) { // concatSource 的 getChildren 返回内部的 _children, 一般是 RawSource 和 字符串
            cursource = source.getChildren();
        }
        this.eachSource(cursource);
    }

    eachSource(source) {
        if (Array.isArray(source)) {
            source.forEach((item, n) => {
                if (typeof item === 'string') {
                    source[n] = this.replaceSource(item);
                } else if (typeof item._value === 'string') {
                    item._value = item._value ? this.replaceSource(item._value) : item._value;
                } else {
                    this.fetchSource(item);
                }
            });
        } else if (typeof source._value === 'string') {
            source._value = source._value ? this.replaceSource(source._value) : source._value;
        } else {
            this.fetchSource(source);
        }
    }

    replaceSource(source) {
        return source;
    }
}
export default SourceBase;
