import React, { Component } from 'react';
import Io from '../connection';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'

let io = null;

class Pin extends Component {

  constructor(props) {
    super(props);
    this.pin = 0;
    this.state = {
      isVisible: false,
      err: ""
    }
  }

  componentDidMount() {
    io = Io.connectionsRoom('game');
    io.on('join', (req) => {
      if (req.status) {
        this.setState({ isVisible: true });
      } else {
        this.setState({
          err: <div class="pin-error">
            <img src={require('../images/quiz/cancel-2.png')} className="img-cancel-2" alt="" />
            Pin Not Found
        </div>
        })
      }
    });
  };

  componentWillUnmount() {
    io.removeListener('join');
  }

  onClickEvent = (e) => {
    if (this.pin > 0) {
      io.emit("sendPin", this.pin);

    } else {
      this.setState({
        err: <div className="pin-error">
          <img src={require('../images/quiz/cancel-2.png')} className="img-cancel-2" alt="" />
          Pin Cannot Be Left Blanke
      </div>
      })
    }
  };

  onChangeEvent = (e) => {
    const re = /^[0-9\b]+$/;
    const value = e.target.value;
    if ((value === '' || re.test(value)) && value.length <= 6) {
      this.setState({ pin: value })
      this.pin = value
    }
  };

  render() {
    let state = this.state
    return (
      <div>
        {state.isVisible ?
          <Redirect to={
            {
              pathname: '/Username',
              state: { visible: true }
            }
          } />
          :
          <div>
            <div className="figure"></div>
            <div className="figure-2"></div>
            <div className="capsule">
              <div className="container pin">
                <div className="pin-logo">
                  <img src={require('../images/logo/logo-w.png')} className="img-pin-logo" alt="" />
                </div>
                {state.err}
                <div className="pin-text">
                  <input type="text" className="txt-pin" value={state.pin || ''} placeholder="Game Pin" onChange={this.onChangeEvent} />
                </div>
                <div className="pin-button">
                  <button onClick={this.onClickEvent} type="submit" className="btn-pin">Enter</button>
                </div>
              </div>
              <div className="a-pin">
                <Link to="/user">{localStorage.getItem('token') ? 'Go to profile' : 'Login or Register'}</Link>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
};


export default Pin;
