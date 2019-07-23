import React, { Component } from 'react'

class User extends Component {
  render() {
    return (
      <div>
        <div class="figure"></div>
        <div class="figure-2"></div>

        <div className="capsule">
          <div class="container user">
            <div class="user-logo">
              <img src="../images/logo/logo-w.png" class="img-user-logo" alt="Quiz" />
            </div>

            <div class="row">

              <div class="col-lg-6 login">

                <div class="login-text">
                  Log In
              </div>

                <div class="login-in">

                  <div class="login-input">

                    <div class="login-img">
                      <img src="images/user-icon/user.png" class="img-user" alt="" />
                    </div>

                    <div class="login-textarea">
                      <input type="text" placeholder="User Name" class="txt-user" />
                    </div>

                  </div>

                  <div class="login-password-input">

                    <div class="login-img">
                      <img src="images/user-icon/password.png" class="img-password" alt="" />
                    </div>

                    <div class="login-textarea">
                      <input type="password" placeholder="Password" class="txt-password" />
                    </div>

                  </div>

                  <div class="login-button">
                    <button type="button" class="btn-login">Enter</button>
                  </div>

                </div>

              </div>

              <div class="col-lg-6 signup">
                <div class="signup-text">
                  Sign Up
              </div>

                <div class="signup-in">

                  <input type="text" class="txt-signup" placeholder="User Name" />

                  <input type="text" class="txt-signup" placeholder="E-Mail" />

                  <input type="password" class="txt-signup" placeholder="Password" />

                  <div class="sign-button">
                    <button type="button" class="btn-sign">Sign Up</button>
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