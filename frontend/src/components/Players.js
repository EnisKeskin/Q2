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
            pin: 0,
        }
    }

    componentDidMount() {
        if (document.querySelector('.modal-backdrop')) {
            document.querySelector('.modal-backdrop').remove();
        }
        io = Io('game');
        if (this.props.location.state.pin !== 0) {
            // io.emit('sendAdmin', this.props.location.state.pin)
            const pin = this.props.location.state.pin

            io.emit('sendAdmin', pin);

            io.on('startButton', (pin) => {
                this.setState({
                    startButton:
                        <div className="button-start" >
                            <button onClick={this.onClickEvent}
                                className="btn-start"
                                type="button" > Start </button>
                        </div>,
                })
            });
            console.log(pin);
        }
        io.on('userCount', (data) => {
            this.setState({
                pin: data.pin,
            })
        })
        io.on('newUser', (players) => {
            const userCount = players.length;
            if (isNaN(players)) {
                this.setState({
                    players: players,
                    userCount:userCount
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
                    <Redirect to='/Answer' />
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
                            {this.state.startButton}
                        </div>
                    </div>
                }
            </div>
        );
    }
};

export default Players;