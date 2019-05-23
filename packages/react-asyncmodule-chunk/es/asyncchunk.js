function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import { AsyncProvider } from './asynccontext';

var AsyncChunk = function AsyncChunk(props) {
    var children = props.children,
        providerValue = _objectWithoutProperties(props, ['children']);

    return React.createElement(
        AsyncProvider,
        { value: providerValue },
        children
    );
};
export default AsyncChunk;