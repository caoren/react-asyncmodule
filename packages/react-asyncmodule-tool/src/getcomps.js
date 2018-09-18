const getModule = mod =>  mod && typeof mod === 'object' && mod.__esModule ? mod.default : mod;  // eslint-disable-line
const getCompsByMatch = (matchRoute = []) => {
    const components = matchRoute.map((item) => {
        return item.route.component;
    })
    .filter(item => {
        if (item && item.preload) {
            return true;
        }
        return false;
    })
    .map(item => item.preload());
    return Promise.all(components).then((item) => {
        return item.map(getModule);
    });
}
export default getCompsByMatch;