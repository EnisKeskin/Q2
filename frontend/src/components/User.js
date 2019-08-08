import React, { Component } from 'react'
import Io from '../connection';
import { Redirect } from 'react-router'

let io = null;

class User extends Component {
  constructor(props) {
    super(props);
    this.userLogin = {
      email: "",
      password: "",
    }
    this.register = {
      email: "",
      password: "",
      username: "",
      firstname: "",
      lastname: "",
    }
    this.state = {
      profilVisible: false,
      loginErrMessage: "",
      registerErrMessage: "",
    }

    this.onClickLoginEvent = this.onClickLoginEvent.bind(this);
    this.onClickRegisterEvent = this.onClickRegisterEvent.bind(this);
  }

  componentDidMount() {
    //io çıktığı için sıkıntı
    io = Io.connectionsRoom('user');

    if (localStorage.getItem('token')) {
      this.setState({
        profilVisible: true
      });
    }

    io.on('succLogin', (token) => {
      if (isNaN(token)) {
        localStorage.removeItem('token');
        localStorage.setItem('token', token);
      }
      this.setState({
        profilVisible: true
      });
    });

    io.on('loginErr', (err) => {
      this.setState({
        loginErrMessage: <div className="login-error sign-err">{err.message}</div>
      })
    })

    io.on('registerError', (err) => {
      this.setState({
        registerErrMessage: <div className="login-error sign-err">{err.message}</div>
      })
    })

  }

  componentWillUnmount() {
    io.removeListener('succLogin');
    io.removeListener('loginErr');
    io.removeListener('registerError');
  }

  onClickLoginEvent = (e) => {
    e.preventDefault();
    io.emit('userLogin', this.userLogin);
  }

  onClickRegisterEvent = (e) => {
    e.preventDefault();
    io.emit('userRegister', this.register);
  }

  render() {
    return (
      <div>
        {this.state.profilVisible ?
          <Redirect to='/Profile' />
          :
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

                    <div className="login-text">Log In</div>

                    <div className="login-in">

                      <form action="." method="POST">
                        <div className="login-input">

                          <div className="login-img">
                            <img src={require('../images/user-icon/user.png')} className="img-user" alt="" />
                          </div>

                          <div className="login-textarea">
                            <input type="text" placeholder="User Name" className="txt-user" autoComplete="username" onChange={(e) => { this.userLogin.email = e.target.value }} />
                          </div>

                        </div>

                        <div className="login-password-input">

                          <div className="login-img">
                            <img src={require('../images/user-icon/password.png')} className="img-password" alt="" />
                          </div>

                          <div className="login-textarea">
                            <input type="password" placeholder="Password" className="txt-password" autoComplete="current-password" onChange={(e) => { this.userLogin.password = e.target.value }} />
                          </div>

                        </div>
                        {this.state.loginErrMessage}
                        <div className="login-button">

                          <button type="submit" className="btn-login" onClick={this.onClickLoginEvent} >Enter</button>
                        </div>
                      </form>

                    </div>

                  </div>

                  <div className="col-lg-6 signup">
                    <div className="signup-text">Sign Up</div>
                    <div className="signup-in">

                      <form action="." method="POST">
                        <div className="user-name">
                          <input type="text" className="txt-username" placeholder="First Name" required onChange={(e) => { this.register.firstname = e.target.value }} />

                          <input type="text" className="txt-username" placeholder="Last Name" required onChange={(e) => { this.register.lastname = e.target.value }} />
                        </div>
                        <input type="text" className="txt-signup" placeholder="User Name" required onChange={(e) => { this.register.username = e.target.value }} />

                        <input type="email" className="txt-signup" placeholder="E-Mail" autoComplete="username" required onChange={(e) => { this.register.email = e.target.value }} />

                        <input type="password" className="txt-signup" placeholder="Password" autoComplete="current-password" required onChange={(e) => { this.register.password = e.target.value }} />
                        <div>{this.state.registerErrMessage}</div>

                        <div className="sign-button">
                          <button type="submit" className="btn-sign" onClick={this.onClickRegisterEvent} >Sign Up</button>
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