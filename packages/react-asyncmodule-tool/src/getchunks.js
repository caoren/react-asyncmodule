const filterEmpty = item => !!item;
const getChunksByMatch = (matchRoute = []) => {
    const components = matchRoute.map((item) => {
        return item.route.component;
    }).filter(filterEmpty);
    const chunkNames = components.map((item) => {
        const { chunk } = item;
        if (typeof chunk === 'function') {
            return chunk.call(item);
        } else {
            return '';
        }
    }).filter(item => item !== '');
    const comps = components.map((item) => {
        return item.comp;
    }).filter(filterEmpty);
    return { chunkNames, comps }
}
export default getChunksByMatch;