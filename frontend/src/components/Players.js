import React, { Component } from 'react'
import io from '../connection';

class Players extends Component {
    constructor(props) {
        super(props);

        this.state = {
            person: "",
            players: []
        }
    }
    
    componentDidMount() {
        io.on('newUser', (players) => {
            if (isNaN(players)) {
                this.setState({
                    players: players
                });
            } else {
                console.log("at");
            }
        })
    }

    render() {
        console.log(this.state.players);
        return (
            <div>
                <div className="container players-content">
                    <div className="players-top">
                        123456
                </div>
                    <div className="players-bottom">
                        {this.state.players.map((player, i) => {
                            return (<div key={i}>{player}</div>)
                        })}
                    </div>
                </div>

                <div className="container-fluid players-start">
                    <div className="players-number">20 Players</div>
                    <div className="button-start">
                        <button className="btn-start" type="button">Start</button>

                    </div>
                </div>
            </div>
        )
    }
}

export default Players;

