import React, { Component } from 'react'
import Io from '../connection';
import { Redirect } from 'react-router'

let io = null;

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lemail: "",
      lpassword: "",
      rusername: "",
      rpassword: "",
      remail: "",
      profilVisible: false,
      loginInfo: "",
    }

    this.onChangePassEvent = this.onChangePassEvent.bind(this);
    this.onChangeEmailEvent = this.onChangeEmailEvent.bind(this);
    this.onClickLoginEvent = this.onClickLoginEvent.bind(this);

    this.onChangeRMailEvent = this.onChangeRMailEvent.bind(this);
    this.onChangeRPasswordEvent = this.onChangeRPasswordEvent.bind(this);
    this.onChangeRUserEvent = this.onChangeRUserEvent.bind(this);
    this.onClickRegisterEvent = this.onClickRegisterEvent.bind(this);

  }

  componentDidMount() {
    io = Io('user');
    io.on('succLogin', (token) => {
      if (isNaN(token)) {
        localStorage.removeItem('token');
        localStorage.setItem('token', token);
      }
      this.setState({
        profilVisible: true
      });
    });

    io.on('unsuccLogin', () => {
      this.setState({
        loginInfo: "email and password incorrect"
      });
    })
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

  onClickLoginEvent(e) {
    e.preventDefault();
    const state = this.state;
    io.emit('userLogin', state.lemail, state.lpassword);
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

  onClickRegisterEvent(e) {
    e.preventDefault();
    const state = this.state;
    io.emit('userRegister', state.remail, state.rpassword, state.rusername);
  }

  render() {
    return (
      <div>
        {this.state.profilVisible ?
          <Redirect to='/Profil' />
          :
          <div>

            <div class="figure">

            </div>
            <div class="figure-2">

            </div>

            <div class="capsule">



              <div class="container user">
                <div class="user-logo">
                  <img src={require('../images/logo/logo-w.png')} class="img-user-logo" alt="Quiz" />
                </div>


                <div class="row">

                  <div class="col-lg-6 login">

                    <div class="login-text">Log In</div>

                    <div class="login-in">

                      <form action="." method="POST">
                        <div class="login-input">

                          <div class="login-img">
                            <img src={require('../images/user-icon/user.png')} class="img-user" alt="" />
                          </div>

                          <div class="login-textarea">
                            <input type="text" placeholder="User Name" class="txt-user" required onChange={this.onChangeEmailEvent} />
                          </div>

                        </div>

                        <div class="login-password-input">

                          <div class="login-img">
                            <img src={require('../images/user-icon/password.png')} class="img-password" alt="" />
                          </div>

                          <div class="login-textarea">
                            <input type="password" placeholder="Password" class="txt-password" required onChange={this.onChangePassEvent} />
                          </div>

                        </div>

                        <div class="login-button">

                          <button type="submit" class="btn-login" onClick={this.onClickLoginEvent} >Enter</button>
                        </div>
                      </form>

                    </div>

                  </div>

                  <div class="col-lg-6 signup">
                    <div class="signup-text">
                      Sign Up
              </div>
                    <div class="signup-in">

                      <form action="." method="POST">
                        <div class="user-name">
                          <input type="text" class="txt-username" placeholder="First Name" required />

                          <input type="text" class="txt-username" placeholder="Last Name" required  />
                        </div>
                        <input type="text" class="txt-signup" placeholder="User Name" required onChange={this.onChangeRUserEvent} />

                        <input type="email" class="txt-signup" placeholder="E-Mail" required onChange={this.onChangeRMailEvent} />

                        <input type="password" class="txt-signup" placeholder="Password" required onChange={this.onChangeRPasswordEvent} />

                        <div class="sign-button">
                          <button type="submit" class="btn-sign" onClick={this.onClickRegisterEvent} >Sign Up</button>
                        </div>
                      </form>

                    </div>

                  </div>

                </div>
              </div>
            </div>

          </div>
        }
      </div>
    )
  }
}

export default User


                        // let email = this.state.lemail;
                        // let password = this.state.lpassword;
                        // superagent
                        //   .post('http://127.0.0.1:3000/api/login')
//   .send({email, password })
//   .end((err, res) => {
//     if (err) {

//     } else {
//       if (isNaN(res.body.token)) {
//         localStorage.removeItem('token');
//         localStorage.setItem('token', res.body.token);
//         this.setState({
//           profilVisible: true
//         });
//       }
//     }
//   });