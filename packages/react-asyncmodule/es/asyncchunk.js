import React from 'react';
import { AsyncProvider } from "./asynccontext";

var AsyncChunk = function AsyncChunk(_ref) {
    var report = _ref.report,
        receiveData = _ref.receiveData,
        children = _ref.children;

    var providerValue = { report: report, receiveData: receiveData };
    return React.createElement(
        AsyncProvider,
        { value: providerValue },
        children
    );
};
export default AsyncChunk;