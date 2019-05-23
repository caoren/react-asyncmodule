import React from 'react';
import createReactContext from 'create-react-context';
import hoistNonReactStatics from 'hoist-non-react-statics';

const AsyncContext = createReactContext({});
const AsyncProvider = AsyncContext.Provider;
const AsyncConsumer = AsyncContext.Consumer;
const withConsumer = (Component) => {
    const consumer = props => (
        <AsyncConsumer>
            {asyncProp => <Component
                {...props}
                {...asyncProp} />}
        </AsyncConsumer>
    );
    hoistNonReactStatics(consumer, Component);
    return consumer;
};
export { AsyncProvider };
export default withConsumer;