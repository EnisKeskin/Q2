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
            startButton: "",
            visible: false,
            pin: 0,
            error: '',
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (typeof (props.location.state) !== 'undefined') {
            if (props.location.state.visible) {
                return state.visible = false;
            } else {
                return state.visible = true;
            }
        } else {
            return state.visible = true;
        }
    }

    componentDidMount() {
        if (document.querySelector('.modal-backdrop')) {
            document.querySelector('.modal-backdrop').remove();
        }
        io = Io.connectionsRoom('game');
        if (typeof (this.props.location.state) !== 'undefined') {
            if (this.props.location.state.pin !== 0) {
                const pin = this.props.location.state.pin;

                this.setState({
                    pin: pin
                });

                io.emit('sendAdmin', pin);

                io.on('startButton', () => {
                    this.setState({
                        startButton:
                            <div className="button-start" >
                                <button onClick={this.onClickEvent}
                                    className="btn-start"
                                    type="button" > Start </button>
                            </div>,
                    });
                });
                io.on('gameStartError', (msg) => { this.setState({ error: <div class="player-error">{msg}</div> }) });
            };
        };
        io.on('quizPin', (quiz) => {
            this.setState({
                pin: quiz.pin,
            })
        });
        io.on('newUser', (players) => {
            let userCount = 0;
            if (players) {
                players.length ? userCount = players.length : userCount = 0;
            }

            if (isNaN(players)) {
                this.setState({
                    players: players,
                    userCount: userCount
                });
            } else {
                this.setState({
                    players: [],
                    userCount: 0
                });
            }
        });

        io.on('gameStart', () => {
            this.setState({
                isVisible: true
            });
        });

    };

    componentWillUnmount() {
        io.removeListener('startButton');
        io.removeListener('quizPin');
        io.removeListener('newUser');
        io.removeListener('gameStart');
        io.removeListener('gameStartError');
    }

    onClickEvent = (e) => {
        io.emit('startGame', this.state.userCount)
    }

    render() {
        return (
            <div>
                {this.state.isVisible ?
                    <Redirect to={
                        {
                            pathname: '/Answer',
                            state: { visible: true }
                        }
                    } />
                    :
                    <div>
                        {this.state.visible ?
                            <Redirect to='/' />
                            :
                            <div>
                                <div className="container players-content" >
                                    <div className="players-top" > {this.state.pin}  </div>
                                    <div className="players-bottom" > {
                                        this.state.players.map((player, i) => {
                                            return (< div key={i} > {player} </div>)
                                        })
                                    } </div>
                                </div>
                                <div className="container-fluid players-start" >
                                    <div className="players-number" > {this.state.userCount} Players </div>
                                    {this.state.error} {this.state.startButton}

                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }
};

export default Players;