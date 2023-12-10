import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import axios from 'axios';

const backEndUrl = process.env.REACT_APP_BASEURL;

const client = new ApolloClient({
    uri: backEndUrl + 'graphql/',
    cache: new InMemoryCache(),
    shouldBatch: true
});

axios.defaults.baseURL = backEndUrl + "api/"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ApolloProvider client={client}>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    </ApolloProvider>
);


