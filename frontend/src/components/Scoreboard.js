import React, { Component } from 'react'
import io from '../connection';

class scoreboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: {},
            isVisible: false,
        }
    }

    componentDidMount() {
        io.on('Scoreboard', (users) => {
            this.setState({
                users: users,
                isVisible: true
            })         
        })
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
                {this.state.isVisible?
                <div className="capsule">

                    <div className="score-title">
                        <h1 className="h1 h1-score">Scoreboard</h1>
                    </div>

                    <div className="container score-content">

                        <div className="score-block-1st">
                            <span> {this.state.users[0].username}  </span> <span> {this.state.users[0].score} </span>
                            {/* <img src={require('../images/user-icon/create.png')} className="img-medal" alt="" /> */}
                            <div className="block-1st"></div>
                        </div>
                        {this.createUserScore()}

                    </div>

                </div>
            : null
            }
            </div>
        )
    }
}

export default scoreboard;