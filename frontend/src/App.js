import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Pin from './components/Pin';
import Players from './components/Players';
import User from './components/User';
import Quiz from './components/Quiz';
import Question from './components/Question';
import Profil from './components/Profile';
import Answer from './components/Answer';
import Username from './components/Username';



class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path='/' component={Pin} />
                    <Route exact path='/user' component={User} />
                    <Route exact path='/Quiz' component={Quiz} />
                    <Route exact path='/Question' component={Question} />
                    <Route exact path='/Profil' component={Profil} />
                    <Route exact path='/Answer' component={Answer} />
                    <Route exact path='/Players' component={Players} />
                    <Route exact path='/Username' component={Username} />


                    {/* <Route component = {}/> farklı linklere gidildiğinde */}
                </div>
            </Router>
        )
    };
};

export default App