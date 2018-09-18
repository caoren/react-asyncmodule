const getChunksByMatch = (matchRoute = []) => {
    return matchRoute
        .map(item => item.route.component)
        .filter(item => !!item)
        .map((item) => {
            const { chunk } = item;
            if (typeof chunk === 'function') {
                return chunk.call(item);
            } else {
                return '';
            }
        })
        .filter(item => item !== '');
}
export default getChunksByMatch;