import {
    ApolloClient,
    DefaultOptions, 
    InMemoryCache, 
    createHttpLink 
} from '@apollo/client';

export const BASE_URL = 
    process.env.NODE_ENV !== "development" 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
    : "http://localhost:3000";

const httpsLink = createHttpLink({ 
    uri: `${BASE_URL}/api/graphql`, //Point to the new API route
});


const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "all"
    },
    query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all"
    },
    mutate: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
    }
};

const client = new ApolloClient({
    link: httpsLink,
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions
});

export default client;
