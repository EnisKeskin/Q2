import React, { Component } from 'react';
import Io from '../connection';
import { Redirect } from 'react-router'

let io = null;

class Username extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      isVisible: false,
      gameStart: false,
      err: "",
    }
  }

  componentDidMount() {
    io = Io.connectionsRoom('game');
    io.on('gameStart', () => {
      this.setState({
        gameStart: true
      })
    })
    io.on('usernameErr', (msg) => {
      this.setState({
        err: <div className="pin-error">
          <img src={require('../images/quiz/cancel-2.png')} className="img-cancel-2" alt="" />
          {msg}
        </div>
      })
    });
    io.on('start', () => {
      this.setState({ isVisible: true });
    })
  }

  componentWillUnmount() {
    io.removeListener('gameStart');
  }

  onClickEvent = () => {
    io.emit("sendUsername", this.state.value);
  }

  onChangeEvent = (e) => {
    this.setState({ value: e.target.value });
  }

  render() {
    return (
      <div>
        {this.state.gameStart ?
          <Redirect to='/' />
          :
          <div>
            {this.state.isVisible ?
              <Redirect to={{
                pathname: '/Players',
                state: { pin: 0 }
              }} />
              :
              <div>
                <div className="figure"></div>
                <div className="figure-2"></div>
                <div className="capsule">
                  <div className="container pin">
                    <div className="pin-logo">
                      <img src={require('../images/logo/logo-w.png')} className="img-pin-logo" alt="" />
                    </div>
                    <div className="pin-text">
                      <input type="text" className="txt-pin" placeholder="Username" onChange={this.onChangeEvent} />
                    </div>
                    {this.state.err}
                    <div className="pin-button">
                      <button onClick={this.onClickEvent} type="submit" className="btn-pin">Enter</button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    )
  }
}

export default Username;
