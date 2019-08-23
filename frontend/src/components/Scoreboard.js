import React, { Component } from 'react';
import Io from '../connection';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom'

let io = null;

class scoreboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: {},
            isVisible: true,
            visible: false,
        }
    }

    componentDidMount() {
        io = Io.connectionsRoom('game');
        if (typeof (this.props.location.state) !== 'undefined') {
            if (this.props.location.state.visible) {
                this.setState({
                    visible: false
                })
                this.props.history.replace({ state: {} });
            } else {
                this.setState({
                    visible: true
                })
                this.props.history.replace({ state: {} });
            }
        } else {
            this.setState({
                visible: true
            })
        }
        io.on('Scoreboard', (users) => {
            this.setState({
                users: users,
                isVisible: true,
            });
        });
    }

    createUserScore() {
        const scoreboard = [];
        let users = this.state.users;
        for (let i = 1; i < Math.min(users.length, 4); i++) {
            scoreboard.push(
                <div className="score-block" key={i}>
                    <span> {users[i].username}  </span> <span> {users[i].score} </span>
                </div>
            )
        }
        return scoreboard;
    }

    render() {

        return (
            <div>
                {this.state.visible ?
                    <Redirect to='/' />
                    :
                    <div>
                        {this.state.isVisible ?
                            <div className="capsule">
                                <div class="profile-edit-close">
                                    <Link to='/profile'> <img src={require('../images/quiz/cancel.png')}alt="" /> </Link>
                                </div>
                                <div className="score-title">
                                    <h1 className="h1 h1-score">Scoreboard</h1>
                                </div>

                                <div className="container score-content">

                                    <div className="score-block-1st">
                                        <span> {this.state.users[0] ? this.state.users[0].username : null}  </span> <span> {this.state.users[0] ? this.state.users[0].score : null} </span>
                                        <img src={require('../images/user-icon/medal.png')} className="img-medal" alt="" />
                                        <div className="block-1st"></div>
                                    </div>
                                    {this.createUserScore()}

                                </div>

                            </div>
                            : <Redirect to='/' />
                        }
                    </div>
                }
            </div>
        )
    }
}

export default scoreboard;