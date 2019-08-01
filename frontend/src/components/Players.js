import React, { Component } from 'react'
import Io from '../connection';
import { Redirect } from 'react-router'

let io = null;

class Players extends Component {
    constructor(props) {
        super(props);

        this.state = {
            person: "",
            players: [],
            userCount: 0,
            isVisible: false,
        }
    }

    componentDidMount() {
        io = Io('game');
        io.on('newUser', (players) => {
            if (isNaN(players)) {
                this.setState({
                    players: players
                });
            } else {
                console.log("at");
            }
        });

        io.on('gameStart', () => {
            this.setState({
                isVisible: true
            })
        });

    };

    onClickEvent = (e) => {
        io.emit('startGame')
    }

    render() {
        return (
            <div>
                {this.state.isVisible ?
                    <Redirect to={
                        {
                            pathname: '/Answer',
                            state: { id: 0 }
                        }
                    } />
                    :
                    <div>
                        <div className="container players-content" >
                            <div className="players-top" > {this.state.userCount} </div>
                            <div className="players-bottom" > {
                                this.state.players.map((player, i) => {
                                    return (< div key={i} > {player} </div>)
                                })
                            } </div>
                        </div>
                        <div className="container-fluid players-start" >
                            <div className="players-number" > 20 Players </div>
                            <div className="button-start" >
                                <button onClick={this.onClickEvent}
                                    className="btn-start"
                                    type="button" > Start </button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
};

export default Players;