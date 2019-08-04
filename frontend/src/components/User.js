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
      rfirstname: "",
      rlastname: "",
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
    this.onChangeRFirstEvent = this.onChangeRFirstEvent.bind(this);
    this.onChangeRLastEvent = this.onChangeRLastEvent.bind(this);


  }

  componentDidMount() {
    io = Io('user');
    if(localStorage.getItem('token')){
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

    io.on('unsuccLogin', () => {
      this.setState({
        loginInfo: "email and password incorrect"
      });
    })
  }

  onChangeEmailEvent = (e) => {
    this.setState({
      lemail: e.target.value
    });
  }

  onChangePassEvent = (e) => {
    this.setState({
      lpassword: e.target.value
    });
  }

  onClickLoginEvent = (e) => {
    e.preventDefault();
    const state = this.state;
    io.emit('userLogin', state.lemail, state.lpassword);
  }

  onChangeRUserEvent = (e) => {
    this.setState({
      rusername: e.target.value
    });
  }

  onChangeRMailEvent = (e) => {
    this.setState({
      remail: e.target.value
    });
  }

  onChangeRPasswordEvent = (e) => {
    this.setState({
      rpassword: e.target.value
    });
  }

  onChangeRFirstEvent = (e) => {
    this.setState({
      rfirstName: e.target.value
    })
  }
  
  onChangeRLastEvent = (e) => {
    this.setState({
      rlastName: e.target.value
    })
  }

  onClickRegisterEvent = (e) => {
    e.preventDefault();
    const state = this.state;
    io.emit('userRegister', state.remail, state.rpassword, state.rusername, state.rfirstname, state.rlastname);
  }


  render() {
    return (
      <div>
        {this.state.profilVisible ?
          <Redirect to='/Profil' />
          :
          <div>

            <div className="figure">

            </div>
            <div className="figure-2">

            </div>

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
                            <input type="text" placeholder="User Name" className="txt-user" autoComplete="username" required onChange={this.onChangeEmailEvent} />
                          </div>

                        </div>

                        <div className="login-password-input">

                          <div className="login-img">
                            <img src={require('../images/user-icon/password.png')} className="img-password" alt="" />
                          </div>

                          <div className="login-textarea">
                            <input type="password" placeholder="Password" className="txt-password" autoComplete="current-password" required onChange={this.onChangePassEvent} />
                          </div>

                        </div>

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
                          <input type="text" className="txt-username" placeholder="First Name" required onChange={this.onChangeRFirstEvent} />

                          <input type="text" className="txt-username" placeholder="Last Name" required onChange={this.onChangeRLastEvent} />
                        </div>
                        <input type="text" className="txt-signup" placeholder="User Name" required onChange={this.onChangeRUserEvent} />

                        <input type="email" className="txt-signup" placeholder="E-Mail" autoComplete="username" required onChange={this.onChangeRMailEvent} />

                        <input type="password" className="txt-signup" placeholder="Password" autoComplete="current-password" required onChange={this.onChangeRPasswordEvent} />

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