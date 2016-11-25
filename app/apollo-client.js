import ApolloClient,{createNetworkInterface} from 'apollo-client';
import { Client } from 'subscriptions-transport-ws';

// import login from './login'
import addGraphQLSubscriptions from './addGraphQL.js'

//conect websocket on server
const wsClient = new Client('ws://localhost:8090');
//conect graphql
const networkInterface = createNetworkInterface({ uri: 'http://localhost:8080/graphql' })

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

export const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
})
