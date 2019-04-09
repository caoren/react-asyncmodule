import React from 'react';
import createReactContext  from 'create-react-context';
import hoistNonReactStatics from 'hoist-non-react-statics';

const AsyncContext = createReactContext({});
export const AsyncConsumer = AsyncContext.Consumer;
export const AsyncProvider = AsyncContext.Provider;
export const withConsumer = Component => {
    const consumer = (props) =>  (
        <AsyncConsumer>
            {(asyncProp) => <Component {...props} report={asyncProp.report} receiveData={asyncProp.receiveData} />}
        </AsyncConsumer>
    );
    hoistNonReactStatics(consumer, Component);
    return consumer;
}
export default AsyncContext;