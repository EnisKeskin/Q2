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
        let propsLocation = props.location;
        if (typeof (propsLocation.state) !== 'undefined') {
            if (propsLocation.state.visible) {
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
        if (typeof (propsLocation.state) !== 'undefined') {
            if (propsLocation.state.pin !== 0) {
                const pin = propsLocation.state.pin;

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
        return (
            <div>
                {this.state.isVisible ?
                    <Redirect to={
                        {
                            pathname: '/Game',
                            state: { visible: true }
                        }
                    } />
                    :
                    <div>
                        {this.state.visible ?
                            <div> {localStorage.getItem('token') ? <Redirect to='/profile' /> : <Redirect to='/' />} </div>
                            :
                            <div className="capsule-2">

                                <div className="players-close">
                                    <Link to={localStorage.getItem('token') ? '/profile' : '/'} > <img src={require('../images/quiz/cancel-p.png')} alt="" /></Link>
                                </div>
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

export default Lobby;