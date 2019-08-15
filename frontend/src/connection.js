import io from 'socket.io-client';
import Ip from './Ip';
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
        this.connections[room] = this.room2 ? this.room2 : io(`${Ip}` + room, token ? { query: { token: token } } : null);
        return this.connections[room]
    }
    
    connectionsRoomDelete(){
        return this.connections = [];
    }

}
const socket = new socketConnect();

export default socket
