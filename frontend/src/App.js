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
import Scoreboard from './components/Scoreboard'


class App extends Component {
    render() {
        return (
            <Router>
                <Route exact path='/' component={Pin} />
                <Route exact path='/Username' component={Username} />
                <Route exact path='/Players' component={Players} />
                <Route exact path='/Answer' component={Answer} />
                <Route exact path='/Scoreboard' component={Scoreboard} />

                <Route exact path='/User' component={User} />
                <Route exact path='/Quiz' component={Quiz} />
                <Route exact path='/Question' component={Question} />
                <Route exact path='/Profil' component={Profil} />

                {/* <Route component = {}/> farklı linklere gidildiğinde */}
            </Router>
        )
    };
};

export default App