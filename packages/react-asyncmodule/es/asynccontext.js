var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import createReactContext from 'create-react-context';
import hoistNonReactStatics from 'hoist-non-react-statics';

var AsyncContext = createReactContext({});
export var AsyncConsumer = AsyncContext.Consumer;
export var AsyncProvider = AsyncContext.Provider;
export var withConsumer = function withConsumer(Component) {
    var consumer = function consumer(props) {
        return React.createElement(
            AsyncConsumer,
            null,
            function (asyncProp) {
                return React.createElement(Component, _extends({}, props, { report: asyncProp.report, receiveData: asyncProp.receiveData }));
            }
        );
    };
    hoistNonReactStatics(consumer, Component);
    return consumer;
};
export default AsyncContext;