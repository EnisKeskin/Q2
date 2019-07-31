import key from '../config'
import jwt from 'jsonwebtoken';

const token = localStorage.getItem('token');
let check;
if (isNaN(token)) {
    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            check = false;
        } else {
            check = decoded;
        }
    })
}
export default check;