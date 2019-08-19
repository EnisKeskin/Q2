import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Pin from './components/Pin';
import Players from './components/Players';
import User from './components/User';
import Quiz from './components/Quiz';
import QuizEdit from './components/QuizEdit';
import Question from './components/Question';
import Profile from './components/Profile';
import ProfileEdit from './components/ProfilEdit'
import Answer from './components/Answer';
import Username from './components/Username';
import Scoreboard from './components/Scoreboard'
import Discover from './components/Discover'
import QuestionEdit from './components/QuestionEdit'

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={Pin} />
                    <Route exact path='/Username' component={Username} />
                    <Route exact path='/Players' component={Players} />
                    <Route exact path='/Answer' component={Answer} />
                    <Route exact path='/Scoreboard' component={Scoreboard} />

                    <Route exact path='/User' component={User} />
                    <Route exact path='/Profile' component={Profile} />
                    <Route exact path='/Profile/Edit' component={ProfileEdit} />
                    <Route exact path='/Quiz' component={Quiz} />
                    <Route exact path='/QuizEdit' component={QuizEdit} />
                    <Route exact path='/Question' component={Question} />
                    <Route exact path='/QuestionEdit' component={QuestionEdit} />

                    <Route exact path='/Discover' component={Discover} />

                    <Route component={Pin} />
                </Switch>
            </Router>
        )
    };
};

export default App