import io from 'socket.io-client';

class socketConnect{
    constructor(){
        this.connections= []
        this.room2= []
    }

    connectionsRoom(room, token){
        this.room2 = this.connections[room];
        if (this.room2 && this.room2.query) {
            this.room2.query.token = token ? token : null;
        }
        this.connections[room] = this.room2 ? this.room2 : io('http://192.168.1.101:3000/' + room, token ? { query: { token: token } } : null);
        return this.connections[room]
    }
    
    connectionsRoomDelete(){
        return this.connections = [];
    }

}
const socket = new socketConnect();

export default socket
