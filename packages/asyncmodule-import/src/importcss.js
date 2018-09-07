// copy by 
const LOADED = {};
const getResource = (rsName) => {
    if (typeof window === 'undefined' || !window.__ASSETS_CHUNKS__) {
        return null;
    }
    const CSSChunks = window.__ASSETS_CHUNKS__;
    return CSSChunks[rsName];
};
const ImportCss = (rsName) => {
    const href = getResource(rsName);
    // 不存在、已加载、在node环境
    // 返回一个resolve的Promise
    if (!href || LOADED[href] === true || typeof window === 'undefined') {
        return Promise.resolve();
    }
    LOADED[href] = true;
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.href = href;
    link.charset = 'utf-8';
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.timeout = 20000;
    return new Promise((resolve, reject) => {
        let timeout;
        link.onerror = () => {
            link.onerror = null;
            link.onload = null;
            clearTimeout(timeout);
            const message = `could not load css: ${rsName}`;
            reject(new Error(message));
            delete LOADED[href];
        };
        // link.onload doesn't work well enough, but this will handle it
        // since images can't load css (this is a popular fix)
        const img = document.createElement('img');
        img.onerror = () => {
            link.onerror = null;
            img.onerror = null;
            clearTimeout(timeout);
            resolve();
        };
        timeout = setTimeout(link.onerror, link.timeout);
        head.appendChild(link);
        img.src = href;
    });
};
export default ImportCss;