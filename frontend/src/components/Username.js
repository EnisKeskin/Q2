import React, { Component } from 'react';
import io from '../connection';
import { Redirect } from 'react-router'

class Username extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      isVisible: false,
    }
  }

  componentDidMount() {

  }

  onClickEvent = () => {
    io.emit("sendUsername", this.state.value);
    this.setState({ isVisible: true });
    
  }

  onChangeEvent = (e) => {
    this.setState({ value: e.target.value });
  }

  render() {
    return (
      <div>
        {this.state.isVisible ?
          <Redirect to='/Players' />
          :
          <div>
            <div className="figure"></div>
            <div className="figure-2"></div>
            <div className="capsule">
              <div className="container pin">
                <div className="pin-logo">
                  <img src="../images/logo/logo-w.png" className="img-pin-logo" alt="" />
                </div>
                <div className="pin-text">
                  <input type="text" className="txt-pin" placeholder="Username" onChange={this.onChangeEvent} />
                </div>

                <div className="pin-button">
                  <button onClick={this.onClickEvent} type="submit" className="btn-pin">Enter</button>
                </div>
                <div className="a">
                  {/* <a href="">Login or Register</a> */}
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Username;