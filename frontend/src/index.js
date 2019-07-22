import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/style.css';
import Pin from './pin';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Pin />, document.getElementById('root'));



serviceWorker.unregister();
