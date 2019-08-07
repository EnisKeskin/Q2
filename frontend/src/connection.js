import io from 'socket.io-client';
const connections = {};
export default (room, token, del) => {
    connections[room] = connections[room] ? connections[room] : io('http://localhost:3000/' + room, token ? {
        query: { token: token }
    } : null);
    // if(del === connections[room].nsp){
    //     connections[room] = connections.filter((value) => {
    //         return value.nsp === del; 
    //     });
    // }
    return connections[room];
};
