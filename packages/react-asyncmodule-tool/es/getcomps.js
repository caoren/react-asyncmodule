var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var getModule = function getModule(mod) {
    return mod && (typeof mod === 'undefined' ? 'undefined' : _typeof(mod)) === 'object' && mod.__esModule ? mod.default : mod;
}; // eslint-disable-line
var getCompsByMatch = function getCompsByMatch() {
    var matchRoute = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var components = matchRoute.map(function (item) {
        return item.route.component;
    }).filter(function (item) {
        if (item && item.preload) {
            return true;
        }
        return false;
    }).map(function (item) {
        return item.preload();
    });
    return Promise.all(components).then(function (item) {
        return item.map(getModule);
    });
};
export default getCompsByMatch;