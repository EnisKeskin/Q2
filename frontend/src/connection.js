import io from 'socket.io-client';
const connections = {};
export default (room, token) => {
    connections[room] = connections[room] ? connections[room] : io('http://localhost:3000/'+room, token ? {
        query : {token: token}
    }: null);
    return connections[room];
};
