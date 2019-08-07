import React, { Component } from 'react';
import Io from '../connection';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'

let io = null;

class Pin extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: "",
      isVisible: false,
      err:""
    }
  }

  componentDidMount() {
    io = Io('game');
    io.on('join', (req) => {
      if (req.status) {
        this.setState({ isVisible: true });
      } else {
        this.setState({
          err: <div className="alert alert-danger">Pin bulunamadı</div>
        })
      }
    });
  };

  componentWillUnmount() {
    io.removeListener('join');
  }

  onClickEvent = (e) => {
    io.emit("sendPin", this.state.value);
  };

  onChangeEvent = (e) => {
    this.setState({ value: e.target.value });
  };

  render() {
    return (
      <div>
        {this.state.isVisible ?
          <Redirect to='/username' />
          :
          <div>
            <div className="figure"></div>
            <div className="figure-2"></div>
            <div className="capsule">
              <div className="container pin">
                <div className="pin-logo">
                  <img src={require('../images/logo/logo-w.png')} className="img-pin-logo" alt="" />
                </div>
                {this.state.err}
                <div className="pin-text">
                  <input type="text" className="txt-pin" placeholder="Game Pin" onChange={this.onChangeEvent} />
                </div>
                <div className="pin-button">
                  <button onClick={this.onClickEvent} type="submit" className="btn-pin">Enter</button>
                </div>
              </div>
                <div className="a-pin">
                  <Link to="/user">Login or Register</Link>
                </div>
            </div>
          </div>
        }
      </div>
    );
  }
};


export default Pin;
