import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Pin from './components/Pin';
import Lobby from './components/Lobby';
import User from './components/User';
import Quiz from './components/Quiz';
import QuizEdit from './components/QuizEdit';
import Question from './components/Question';
import Profile from './components/Profile';
import ProfileEdit from './components/ProfilEdit'
import Game from './components/Game';
import Username from './components/Username';
import Scoreboard from './components/Scoreboard'
import Discover from './components/Discover'
import QuestionEdit from './components/QuestionEdit'

class App extends Component {
    render() {
        let token = localStorage.getItem('token');
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={Pin} />
                    <Route exact path='/Username' component={Username} />
                    <Route exact path='/Lobby' component={Lobby} />
                    <Route exact path='/Game' component={Game} />
                    <Route exact path='/Scoreboard' component={Scoreboard} />

                    <Route exact path='/User' component={User} />
                    <Route exact path='/Profile' component={Profile} />
                    <Route exact path='/Profile/Edit' component={ProfileEdit} />
                    <Route exact path='/Quiz' component={Quiz} />
                    <Route exact path='/Quiz/Edit' component={QuizEdit} />
                    <Route exact path='/Question' component={Question} />
                    <Route exact path='/Question/Edit' component={QuestionEdit} />

                    <Route exact path='/Discover' component={Discover} />

                    <Route component={token ? Profile : Pin} />
                </Switch>
            </Router>
        )
    };
};

export default App