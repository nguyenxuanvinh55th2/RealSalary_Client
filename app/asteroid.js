import {createClass} from "asteroid";
const Asteroid = createClass();
// Connect to a Meteor backend
export const asteroid = new Asteroid({
    endpoint: "ws://localhost:3000/websocket"
});
