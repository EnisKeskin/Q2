import React, { Component } from 'react'
import superagent from 'superagent'


class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lemail: "",
      lpassword: "",
      rusername: "",
      rpassword: "",
      remail: "",
    }

    this.onChangePassEvent = this.onChangePassEvent.bind(this);
    this.onChangeEmailEvent = this.onChangeEmailEvent.bind(this);
    this.onClickLoginEvent = this.onClickLoginEvent.bind(this);

    this.onChangeRMailEvent = this.onChangeRMailEvent.bind(this);
    this.onChangeRPasswordEvent = this.onChangeRPasswordEvent.bind(this);
    this.onChangeRUserEvent = this.onChangeRUserEvent.bind(this);
    this.onClickRegisterEvent = this.onClickRegisterEvent.bind(this);
  }

  onChangeEmailEvent(e) {
    this.setState({
      lemail: e.target.value
    });
  }

  onChangePassEvent(e) {
    this.setState({
      lpassword: e.target.value
    });
  }

  onClickLoginEvent() {
    superagent
      .post('http://127.0.0.1:3000/api/login')
      .send({ email: this.state.lemail, password: this.state.lpassword })
      .set('Access-Control-Allow-Origin', '*')
      .end((err, res) => {
        console.log(res);
      });
  }

  onChangeRUserEvent(e) {
    this.setState({
      rusername: e.target.value
    });
  }

  onChangeRMailEvent(e) {
    this.setState({
      remail: e.target.value
    });
  }
  onChangeRPasswordEvent(e) {
    this.setState({
      rpassword: e.target.value
    });
  }

  onClickRegisterEvent() {
    superagent
    .post('http://127.0.0.1:3000/api/register')
    .send({ email: this.state.remail, password: this.state.rpassword, username: this.state.rusername })
    .end((err, res) => {
      console.log(res.body);
    });
  }

  render() {
    return (
      <div>
        <div className="figure"></div>
        <div className="figure-2"></div>

        <div className="capsule">
          <div className="container user">
            <div className="user-logo">
              <img src={require('../images/logo/logo-w.png')} className="img-user-logo" alt="Quiz" />
            </div>

            <div className="row">

              <div className="col-lg-6 login">

                <div className="login-text"> Log In </div>

                <div className="login-in">

                  <div className="login-input">

                    <div className="login-img">
                      <img src={require('../images/user-icon/user.png')} className="img-user" alt="" />
                    </div>

                    <div className="login-textarea">
                      <input type="text" placeholder="Email" className="txt-user" onChange={this.onChangeEmailEvent} />
                    </div>

                  </div>

                  <div className="login-password-input">

                    <div className="login-img">
                      <img src={require('../images/user-icon/password.png')} className="img-password" alt="" />
                    </div>

                    <div className="login-textarea">
                      <input type="password" placeholder="Password" className="txt-password" onChange={this.onChangePassEvent} />
                    </div>

                  </div>
                  {/* ajax verilerini gönderecek */}
                  <div className="login-button">
                    <button type="button" className="btn-login" onClick={this.onClickLoginEvent}>Enter</button>
                  </div>

                </div>

              </div>

              <div className="col-lg-6 signup">
                <div className="signup-text">
                  Sign Up
              </div>

                <div className="signup-in">

                  <input type="text" className="txt-signup" placeholder="User Name" onChange={this.onChangeRUserEvent} />

                  <input type="text" className="txt-signup" placeholder="E-Mail" onChange={this.onChangeRMailEvent} />

                  <input type="password" className="txt-signup" placeholder="Password" onChange={this.onChangeRPasswordEvent} />

                  <div className="sign-button">
                    <button type="button" className="btn-sign" onClick={this.onClickRegisterEvent}>Sign Up</button>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    )
  }
}

export default User