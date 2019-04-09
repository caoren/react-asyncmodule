import React from 'react';
import { AsyncProvider } from "./asynccontext";

const AsyncChunk = ({ report, receiveData, children }) => {
    const providerValue = { report, receiveData };
    return (
        <AsyncProvider value={providerValue}>
            {children}
        </AsyncProvider>
    );
}
export default AsyncChunk;