import React, { Component } from 'react'
import Io from '../connection';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'

let io = null;

class Lobby extends Component {
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

    componentDidMount() {
        let props = this.props;
        let propsState = props.location.state;
        if (typeof (propsState) !== 'undefined') {
            if (propsState.visible) {
                this.setState({
                    visible: false
                });
                props.history.replace({ state: {} });
            } else {
                this.setState({
                    visible: true
                });
                props.history.replace({ state: {} });
            }
        } else {
            this.setState({
                visible: true
            });
        }

        if (document.querySelector('.modal-backdrop')) {
            document.querySelector('body').classList.remove("modal-open");
            document.querySelector('.modal-backdrop').remove();
        }

        io = Io.connectionsRoom('game');
        if (typeof (propsState) !== 'undefined') {
            if (propsState.pin !== 0) {
                const pin = propsState.pin;

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
                io.on('gameStartError', (msg) => { this.setState({ error: <div className="player-error">{msg}</div> }) });
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

            if (players && isNaN(players)) {
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
        io.emit('startGame', this.state.userCount);
    }

    render() {
        let state = this.state;
        let token = localStorage.getItem('token');
        return (
            <div>
                {state.isVisible ?
                    <Redirect to={
                        {
                            pathname: '/Game',
                            state: { visible: true }
                        }
                    } />
                    :
                    <div>
                        {state.visible ?
                            <div> {token ? <Redirect to='/profile' /> : <Redirect to='/' />} </div>
                            :
                            <div className="capsule-2">

                                <div className="players-close">
                                    <Link to={token ? '/profile' : '/'} > <img src={require('../images/quiz/cancel-p.png')} alt="" onClick={() => Io.connectionsRoomDelete()} /></Link>
                                </div>
                                <div className="container players-content" >
                                    <div className="players-top" > {state.pin}  </div>
                                    <div className="players-bottom" > {
                                        state.players.map((player, i) => {
                                            return (< div key={i} > {player} </div>)
                                        })
                                    } </div>
                                </div>
                                <div className="container-fluid players-start" >
                                    <div className="players-number" > {state.userCount} Players </div>
                                    {state.error} {state.startButton}

                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }
};

export default Lobby;