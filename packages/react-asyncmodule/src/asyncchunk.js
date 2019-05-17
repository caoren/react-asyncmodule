import React from 'react';
import { AsyncProvider } from './asynccontext';

const AsyncChunk = (props) => {
    const { children, ...providerValue } = props;
    return (
        <AsyncProvider value={providerValue}>
            {children}
        </AsyncProvider>
    );
};
export default AsyncChunk;